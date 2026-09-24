"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Phone, PhoneOff, Radio, Volume2 } from "lucide-react";

type LiveEvent = {
  type?: string;
  delegation?: { id?: string; target?: string };
  delta?: string;
  error?: { message?: string };
};

type TranscriptLine = { role: "user" | "assistant"; text: string };

const LIVE_MODEL = "gpt-live-1";

export default function VoiceAgent() {
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<RTCDataChannel | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userTurnRef = useRef("");
  const transcriptRef = useRef<TranscriptLine[]>([]);
  const [connected, setConnected] = useState(false);
  const [muted, setMuted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [transcript, setTranscript] = useState("READY FOR VOICE INPUT.");
  const [backendStatus, setBackendStatus] = useState("CORE STANDBY");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => disconnect();
  }, []);

  function appendTranscript(role: TranscriptLine["role"], delta: string) {
    if (!delta) return;
    const lines = transcriptRef.current;
    const last = lines.at(-1);
    if (last?.role === role) last.text += delta;
    else lines.push({ role, text: delta });
    transcriptRef.current = lines.slice(-12);
  }

  async function delegateToCore(delegationId: string) {
    const context = transcriptRef.current
      .map((line) => `${line.role}: ${line.text}`)
      .join("\n");
    const request = userTurnRef.current.trim() || context.trim();
    if (!request) return;

    setBackendStatus("CORE WORKING");
    setTranscript("J.A.R.V.I.S. CORE IS WORKING…");

    try {
      const response = await fetch("/api/jarvis/owner/live/delegate", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delegationId, transcript: request }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.message ?? "JARVIS Core delegation failed.");

      const channel = channelRef.current;
      if (channel?.readyState === "open") {
        channel.send(JSON.stringify({
          type: "session.commentary.append",
          delegation_id: delegationId,
          content: JSON.stringify(payload.result),
        }));
      }
      setBackendStatus("CORE READY");
      setTranscript("CORE RESULT RETURNED.");
      userTurnRef.current = "";
    } catch (cause) {
      setBackendStatus("CORE ERROR");
      setError(cause instanceof Error ? cause.message : "JARVIS Core delegation failed.");
    }
  }

  function handleEvent(event: LiveEvent) {
    switch (event.type) {
      case "session.started":
        setTranscript("ONLINE. SPEAK NATURALLY.");
        setBackendStatus("CORE READY");
        break;
      case "session.input_transcript.delta":
        userTurnRef.current += event.delta ?? "";
        appendTranscript("user", event.delta ?? "");
        setTranscript("LISTENING…");
        break;
      case "session.output_transcript.delta":
        appendTranscript("assistant", event.delta ?? "");
        setTranscript("J.A.R.V.I.S. IS RESPONDING…");
        break;
      case "session.delegation.created":
        if (event.delegation?.id) void delegateToCore(event.delegation.id);
        break;
      case "error":
        setError(event.error?.message ?? "GPT-Live session error.");
        setBackendStatus("LIVE ERROR");
        break;
      default:
        break;
    }
  }
  async function connect() {
    if (peerRef.current || busy) return;
    setBusy(true);
    setError(null);
    setBackendStatus("CONNECTING");

    try {
      const peer = new RTCPeerConnection();
      peerRef.current = peer;

      peer.ontrack = (event) => {
        const stream = event.streams[0];
        if (!audioRef.current) audioRef.current = new Audio();
        audioRef.current.srcObject = stream;
        void audioRef.current.play().catch(() => undefined);
      };

      const microphone = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = microphone;
      microphone.getTracks().forEach((track) => peer.addTrack(track, microphone));

      const channel = peer.createDataChannel("oai-events");
      channelRef.current = channel;
      channel.onmessage = (event) => {
        try {
          handleEvent(JSON.parse(event.data) as LiveEvent);
        } catch {
          setError("Received an invalid GPT-Live event.");
        }
      };
      channel.onopen = () => setBackendStatus("LIVE / CORE READY");

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      if (!peer.localDescription?.sdp) {
        throw new Error("WebRTC SDP offer was not created.");
      }

      const response = await fetch("/api/jarvis/owner/live/session", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sdp: peer.localDescription.sdp }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok || typeof payload?.transport?.sdp !== "string") {
        throw new Error(payload?.message ?? "Unable to create the GPT-Live session.");
      }

      await peer.setRemoteDescription({
        type: "answer",
        sdp: payload.transport.sdp,
      });

      setConnected(true);
      setTranscript("CONNECTING TO J.A.R.V.I.S. CORE…");
    } catch (cause) {
      disconnect();
      setError(cause instanceof Error ? cause.message : "Unable to connect GPT-Live.");
    } finally {
      setBusy(false);
    }
  }

  function disconnect() {
    channelRef.current?.close();
    channelRef.current = null;
    peerRef.current?.close();
    peerRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.srcObject = null;
    }
    setConnected(false);
    setMuted(false);
    setBackendStatus("CORE STANDBY");
  }

  function toggleMute() {
    const stream = streamRef.current;
    if (!stream) return;
    const next = !muted;
    stream.getAudioTracks().forEach((track) => { track.enabled = !next; });
    setMuted(next);
  }
  return (
    <section className="relative overflow-hidden border border-amber-400/[0.12] bg-black/55">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.07),transparent_55%)]" />

      <div className="relative border-b border-amber-400/[0.08] px-4 py-3 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.28em] text-amber-500/55">
              <Radio className="h-3 w-3" />
              GPT-Live Interface
            </div>
            <h2 className="mt-2 text-sm font-medium uppercase tracking-[0.22em] text-white">
              J.A.R.V.I.S. Voice-to-Core
            </h2>
            <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.16em] text-white/25">
              Full-duplex conversation / client delegation / owner channel
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 border border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
            <span className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.9)]" : "bg-white/20"}`} />
            <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/45">
              {connected ? "LIVE / WEBRTC" : busy ? "CONNECTING" : "STANDBY"}
            </span>
          </div>
        </div>
      </div>

      <div className="relative grid gap-px bg-white/[0.045] sm:grid-cols-[1fr_auto]">
        <div className="bg-[#030302] px-4 py-4 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/[0.035]">
              <div className={`h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_18px_rgba(245,158,11,0.85)] ${connected ? "animate-pulse" : ""}`} />
              <div className="absolute inset-1.5 rounded-full border border-amber-400/[0.08]" />
            </div>
            <div>
              <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/25">Core Channel</div>
              <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-amber-300/70">{backendStatus}</div>
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
          {!connected ? (
            <button onClick={() => void connect()} disabled={busy} className="inline-flex items-center justify-center gap-2 border border-amber-400/20 bg-amber-400/[0.07] px-4 py-2.5 font-mono text-[8px] uppercase tracking-[0.16em] text-amber-200 transition hover:bg-amber-400/[0.13] disabled:opacity-40">
              <Phone className="h-3 w-3" />
              {busy ? "CONNECTING…" : "START LIVE"}
            </button>
          ) : (
            <>
              <button onClick={toggleMute} className="inline-flex items-center justify-center gap-2 border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 font-mono text-[8px] uppercase tracking-[0.16em] text-white/55 transition hover:bg-white/[0.05]">
                {muted ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                {muted ? "UNMUTE" : "MUTE"}
              </button>
              <button onClick={disconnect} className="inline-flex items-center justify-center gap-2 border border-red-400/10 bg-red-400/[0.025] px-4 py-2.5 font-mono text-[8px] uppercase tracking-[0.16em] text-red-300/65 transition hover:bg-red-400/[0.06]">
                <PhoneOff className="h-3 w-3" />
                END LIVE
              </button>
            </>
          )}
        </div>
      </div>

      <div className="relative flex flex-wrap gap-x-5 gap-y-2 border-t border-white/[0.05] px-4 py-2.5 font-mono text-[7px] uppercase tracking-[0.14em] text-white/20 sm:px-5">
        <span>Transport: <b className="font-normal text-amber-400/45">WebRTC</b></span>
        <span>Voice: <b className="font-normal text-amber-400/45">{LIVE_MODEL}</b></span>
        <span>Backend: <b className="font-normal text-amber-400/45">JARVIS CORE</b></span>
        <span>Delegation: <b className="font-normal text-amber-400/45">CLIENT</b></span>
      </div>
    </section>
  );
}
