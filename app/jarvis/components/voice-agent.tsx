"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Phone, PhoneOff, Volume2 } from "lucide-react";
import { RealtimeAgent, RealtimeSession, tool } from "@openai/agents/realtime";
import { z } from "zod";

const askJarvis = tool({
  name: "ask_jarvis",
  description:
    "Send a spoken request to the authenticated private JARVIS backend. Use this for Stackaura operational questions and governed actions. Never claim a mutation happened unless the backend response confirms it.",
  parameters: z.object({ request: z.string().min(1) }),
  async execute({ request }) {
    const response = await fetch("/api/jarvis/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ message: request }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload?.message ?? "JARVIS backend request failed.");
    }

    return JSON.stringify(payload);
  },
});

export default function VoiceAgent() {
  const sessionRef = useRef<RealtimeSession | null>(null);
  const [connected, setConnected] = useState(false);
  const [muted, setMuted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [transcript, setTranscript] = useState("Ready for voice input.");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      sessionRef.current?.close();
    };
  }, []);

  async function connect() {
    if (sessionRef.current || busy) return;

    setBusy(true);
    setError(null);

    try {
      const tokenResponse = await fetch("/api/jarvis/owner/realtime/session", {
        method: "POST",
        credentials: "include",
      });
      const token = await tokenResponse.json();

      if (!tokenResponse.ok || typeof token.value !== "string") {
        throw new Error(
          token?.message ?? "Unable to create the secure Realtime session.",
        );
      }

      const agent = new RealtimeAgent({
        name: "J.A.R.V.I.S. Voice",
        voice: "marin",
        instructions:
          "You are J.A.R.V.I.S., the private Stackaura owner operations voice agent. " +
          "Speak naturally, briefly, and confidently. You are connected to the owner's authenticated JARVIS cockpit. " +
          "Use ask_jarvis for Stackaura operational requests. The backend remains authoritative for tools, approvals, mutations, verification, and audit. " +
          "Never invent a completed action. For destructive or governed operations, explain the approval state and let the existing JARVIS governance workflow decide execution. " +
          "Distinguish observed facts from recommendations.",
        tools: [askJarvis],
      });

      const session = new RealtimeSession(agent, {
        model: "gpt-realtime-2.1",
        config: {
          outputModalities: ["audio"],
          audio: {
            input: {
              turnDetection: {
                type: "semantic_vad",
                eagerness: "medium",
                createResponse: true,
                interruptResponse: true,
              },
            },
          },
        },
      });

      session.on("history_updated", (history) => {
        const latest = history.at(-1) as
          | { role?: string }
          | undefined;

        if (latest?.role === "user") {
          setTranscript("Listening…");
        } else if (latest?.role === "assistant") {
          setTranscript("J.A.R.V.I.S. is responding…");
        }
      });

      session.on("error", (event) => {
        setError(
          event instanceof Error
            ? event.message
            : "Realtime voice session error.",
        );
      });

      await session.connect({ apiKey: token.value });

      sessionRef.current = session;
      setConnected(true);
      setTranscript("Online. Speak naturally.");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to connect voice agent.",
      );
      sessionRef.current?.close();
      sessionRef.current = null;
    } finally {
      setBusy(false);
    }
  }

  function disconnect() {
    sessionRef.current?.close();
    sessionRef.current = null;
    setConnected(false);
    setMuted(false);
    setTranscript("Voice session ended.");
  }

  function toggleMute() {
    const session = sessionRef.current;
    if (!session) return;

    const next = !muted;
    session.mute(next);
    setMuted(next);
  }

  return (
    <section className="border border-amber-400/[0.10] bg-black/45 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[8px] uppercase tracking-[0.28em] text-amber-500/55">
            Realtime Interface
          </p>
          <h2 className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-white/80">
            J.A.R.V.I.S. Voice
          </h2>
        </div>

        <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.14em]">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              connected
                ? "bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                : "bg-white/20"
            }`}
          />
          {connected ? "LIVE / WEBRTC" : "OFFLINE"}
        </div>
      </div>

      <div className="mt-4 grid gap-px border border-white/[0.05] bg-white/[0.05] sm:grid-cols-3">
        <div className="bg-[#030302] p-3">
          <div className="font-mono text-[7px] uppercase tracking-[0.12em] text-white/20">
            Transport
          </div>
          <div className="mt-1 font-mono text-[9px] text-amber-400/70">
            WebRTC
          </div>
        </div>

        <div className="bg-[#030302] p-3">
          <div className="font-mono text-[7px] uppercase tracking-[0.12em] text-white/20">
            Model
          </div>
          <div className="mt-1 font-mono text-[9px] text-amber-400/70">
            GPT-REALTIME-2.1
          </div>
        </div>

        <div className="bg-[#030302] p-3">
          <div className="font-mono text-[7px] uppercase tracking-[0.12em] text-white/20">
            Audio
          </div>
          <div className="mt-1 font-mono text-[9px] text-amber-400/70">
            SPEECH → SPEECH
          </div>
        </div>
      </div>

      <div className="mt-3 border border-white/[0.05] bg-[#030302] p-3">
        <div className="flex items-center gap-2">
          <Volume2 className="h-3 w-3 text-amber-400/55" />
          <span className="font-mono text-[9px] leading-5 text-white/55">
            {transcript}
          </span>
        </div>

        {error && (
          <div className="mt-2 font-mono text-[8px] leading-4 text-red-300/70">
            {error}
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {!connected ? (
          <button
            onClick={() => void connect()}
            disabled={busy}
            className="inline-flex items-center gap-2 border border-amber-400/20 bg-amber-400/[0.06] px-3 py-2 font-mono text-[8px] uppercase tracking-[0.14em] text-amber-300 transition hover:bg-amber-400/[0.12] disabled:opacity-40"
          >
            <Phone className="h-3 w-3" />
            {busy ? "CONNECTING…" : "START VOICE"}
          </button>
        ) : (
          <>
            <button
              onClick={toggleMute}
              className="inline-flex items-center gap-2 border border-white/[0.08] bg-white/[0.025] px-3 py-2 font-mono text-[8px] uppercase tracking-[0.14em] text-white/55"
            >
              {muted ? (
                <MicOff className="h-3 w-3" />
              ) : (
                <Mic className="h-3 w-3" />
              )}
              {muted ? "UNMUTE" : "MUTE"}
            </button>

            <button
              onClick={disconnect}
              className="inline-flex items-center gap-2 border border-red-400/10 bg-red-400/[0.025] px-3 py-2 font-mono text-[8px] uppercase tracking-[0.14em] text-red-300/65"
            >
              <PhoneOff className="h-3 w-3" />
              END VOICE
            </button>
          </>
        )}
      </div>
    </section>
  );
}
