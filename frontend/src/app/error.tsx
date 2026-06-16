"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    // eslint-disable-next-line no-console
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] text-slate-100 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Decorative space-themed icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-red-950/40 border border-red-800/50 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.15)]">
          <span className="text-4xl" aria-hidden="true">🛰️</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-white">
            Telemetry Signal Lost
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            VAYUSETU encountered an unexpected anomaly while processing the
            climate grid. The operations room is standing by for a retry.
          </p>
        </div>

        {error.digest && (
          <p className="text-[10px] font-mono text-slate-600 bg-slate-900 border border-slate-800 rounded px-3 py-1.5 inline-block">
            Error Digest: {error.digest}
          </p>
        )}

        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition shadow-[0_0_15px_rgba(99,102,241,0.25)] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          ⚡ Retry Connection
        </button>

        <p className="text-[10px] text-slate-600 font-mono">
          ISRO Bharatiya Antariksh Hackathon 2026 — ClimateX Labs
        </p>
      </div>
    </div>
  );
}
