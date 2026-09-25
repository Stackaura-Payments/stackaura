"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Phone, PhoneOff, Radio, Volume2 } from "lucide-react";

export type JarvisVoiceState =
  | "LISTENING"
  | "THINKING"
  | "ACTING"
  | "SPEAKING"
  | "WAITING FOR APPROVAL"
  | "VERIFYING"
  | "STANDBY"
  | "FAULT";

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

type VoiceAgentProps = {
  onStateChange?: (state: JarvisVoiceState) => void;
};

const VOICE_ID = "686905bc7bca40829e6ccf0971948b5f";
const VOICE_MODEL = "s2.1-pro-free";

export default function VoiceAgent({ onStateChange }: VoiceAgentProps) {
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeRef = useRef(false);
  const [active, setActive] = useState(false);
  const [muted, setMuted] = useState(false);
  const [state, setState] = useState<JarvisVoiceState>("STANDBY");
  const [transcript, setTranscript] = useState("VOICE RUNTIME READY.");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onStateChange?.(state);
  }, [onStateChange, state]);

  useEffect(() => {
    return () => {
      activeRef.current = false;
      recognitionRef.current?.stop();
      audioRef.current?.pause();
      audioRef.current?.removeAttribute("src");
    };
  }, []);

  function updateState(next: JarvisVoiceState) {
    setState(next);
    onStateChange?.(next);
  }

  function getRecognition(): SpeechRecognitionLike | null {
    const scope = window as any;
    const Recognition =
      (scope.SpeechRecognition ??
        scope.webkitSpeechRecognition) as SpeechRecognitionConstructor | undefined;

    return Recognition ? new Recognition() : null;
  }

  async function playFishStream(response: Response) {
    if (!response.body) throw new Error("Fish Audio returned no audio stream.");

    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;

    // Fish REST returns a complete MP3 response. Use a Blob URL here rather
    // than MediaSource: MSE/MP3 support is not consistent across browsers,
    // and playback should begin only after the audio element has a real source.
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    audio.src = url;

    try {
      await audio.play();
      await new Promise<void>((resolve, reject) => {
        audio.onended = () => resolve();
        audio.onerror = () => reject(new Error("Fish Audio playback failed."));
      });
    } finally {
      URL.revokeObjectURL(url);
      audio.removeAttribute("src");
      audio.load();
    }
  }

  async function speak(text: string) {
    updateState("SPEAKING");
    setTranscript("J.A.R.V.I.S. IS SPEAKING…");

    const response = await fetch("/api/jarvis/owner/voice/speak", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload?.message ?? "Fish Audio speech synthesis failed.");
    }

    await playFishStream(response);
    if (activeRef.current) {
      updateState("LISTENING");
      setTranscript("LISTENING…");
    }
  }

  async function sendToCore(text: string) {
    const message = text.trim();
    if (!message) return;

    updateState("THINKING");
    setTranscript("J.A.R.V.I.S. CORE IS THINKING…");

    try {
      const response = await fetch("/api/jarvis/ask", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.message ?? "JARVIS Core request failed.");
      }

      if (payload.requiresApproval) {
        updateState("WAITING FOR APPROVAL");
        setTranscript("OWNER APPROVAL REQUIRED.");
      } else if (Array.isArray(payload.actions) && payload.actions.length > 0) {
        updateState("ACTING");
        setTranscript("J.A.R.V.I.S. IS ACTING…");
        await new Promise((resolve) => setTimeout(resolve, 150));
        updateState("VERIFYING");
        setTranscript("VERIFYING CORE RESULT…");
      }

      await speak(payload.message ?? "J.A.R.V.I.S. completed the request.");
    } catch (cause) {
      updateState("FAULT");
      setError(cause instanceof Error ? cause.message : "JARVIS Voice Runtime failed.");
    }
  }

  function startListening() {
    if (activeRef.current) return;

    const recognition = getRecognition();
    if (!recognition) {
      setError("This browser does not provide Speech Recognition. Use a supported Chromium browser.");
      updateState("FAULT");
      return;
    }

    setError(null);
    activeRef.current = true;
    setActive(true);
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-ZA";

    recognition.onresult = (event) => {
      let finalText = "";
      let interim = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        if (result.isFinal) finalText += result[0]?.transcript ?? "";
        else interim += result[0]?.transcript ?? "";
      }

      if (interim) {
        updateState("LISTENING");
        setTranscript(interim.toUpperCase());
      }

      if (finalText.trim()) {
        setTranscript(finalText.trim().toUpperCase());
        void sendToCore(finalText);
      }
    };

    recognition.onerror = (event) => {
      if (event?.error === "aborted" && !activeRef.current) return;
      setError(event?.error ? `Voice input error: ${event.error}` : "Voice input failed.");
      updateState("FAULT");
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      if (activeRef.current && state === "LISTENING") {
        activeRef.current = false;
        setActive(false);
      }
    };

    recognitionRef.current = recognition;
    updateState("LISTENING");
    setTranscript("LISTENING…");
    recognition.start();
  }

  function stopListening() {
    activeRef.current = false;
    setActive(false);
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    updateState("STANDBY");
    setTranscript("VOICE RUNTIME STANDBY.");
  }

  function toggleMute() {
    if (!recognitionRef.current) return;
    if (muted) {
      setMuted(false);
      recognitionRef.current.start();
      updateState("LISTENING");
      setTranscript("LISTENING…");
    } else {
      setMuted(true);
      recognitionRef.current.stop();
      updateState("STANDBY");
      setTranscript("MICROPHONE MUTED.");
    }
  }

  return (
    <section className="relative overflow-hidden border border-amber-400/[0.12] bg-black/55">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.07),transparent_55%)]" />

      <div className="relative border-b border-amber-400/[0.08] px-4 py-3 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.28em] text-amber-500/55">
              <Radio className="h-3 w-3" />
              Fish Voice Runtime
            </div>
            <h2 className="mt-2 text-sm font-medium uppercase tracking-[0.22em] text-white">
              J.A.R.V.I.S. Voice-to-Core
            </h2>
            <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.16em] text-white/25">
              Fish Audio / Core reasoning / owner channel
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 border border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
            <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.9)]" : "bg-white/20"}`} />
            <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/45">
              {active ? state : "STANDBY"}
            </span>
          </div>
        </div>
      </div>

      <div className="relative grid gap-px bg-white/[0.045] sm:grid-cols-[1fr_auto]">
        <div className="bg-[#030302] px-4 py-4 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/[0.035]">
              <div className={`h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_18px_rgba(245,158,11,0.85)] ${active ? "animate-pulse" : ""}`} />
              <div className="absolute inset-1.5 rounded-full border border-amber-400/[0.08]" />
            </div>
            <div>
              <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/25">Voice Channel</div>
              <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-amber-300/70">{state}</div>
            </div>
          </div>

          <div className="mt-4 border border-white/[0.05] bg-black/35 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <Volume2 className="h-3 w-3 shrink-0 text-amber-400/55" />
              <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-white/50">{transcript}</span>
            </div>
            {error && <div className="mt-2 font-mono text-[8px] leading-4 text-red-300/70">{error}</div>}
          </div>
        </div>

        <div className="flex min-w-[180px] flex-col justify-center gap-2 bg-[#030302] px-4 py-4 sm:border-l sm:border-white/[0.045]">
          {!active ? (
            <button onClick={startListening} className="inline-flex items-center justify-center gap-2 border border-amber-400/20 bg-amber-400/[0.07] px-4 py-2.5 font-mono text-[8px] uppercase tracking-[0.16em] text-amber-200 transition hover:bg-amber-400/[0.13]">
              <Phone className="h-3 w-3" />
              START VOICE
            </button>
          ) : (
            <>
              <button onClick={toggleMute} className="inline-flex items-center justify-center gap-2 border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 font-mono text-[8px] uppercase tracking-[0.16em] text-white/55 transition hover:bg-white/[0.05]">
                {muted ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                {muted ? "UNMUTE" : "MUTE"}
              </button>
              <button onClick={stopListening} className="inline-flex items-center justify-center gap-2 border border-red-400/10 bg-red-400/[0.025] px-4 py-2.5 font-mono text-[8px] uppercase tracking-[0.16em] text-red-300/65 transition hover:bg-red-400/[0.06]">
                <PhoneOff className="h-3 w-3" />
                END VOICE
              </button>
            </>
          )}
        </div>
      </div>

      <div className="relative flex flex-wrap gap-x-5 gap-y-2 border-t border-white/[0.05] px-4 py-2.5 font-mono text-[7px] uppercase tracking-[0.14em] text-white/20 sm:px-5">
        <span>Provider: <b className="font-normal text-amber-400/45">Fish Audio</b></span>
        <span>Model: <b className="font-normal text-amber-400/45">{VOICE_MODEL}</b></span>
        <span>Voice: <b className="font-normal text-amber-400/45">{VOICE_ID.slice(0, 8)}…</b></span>
        <span>Authority: <b className="font-normal text-amber-400/45">JARVIS CORE</b></span>
      </div>
    </section>
  );
}
