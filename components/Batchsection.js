"use client";
import { useState, useEffect } from "react";
import { getNextBatch, BATCH_HOURS, pad } from "../lib/batchTimer";

export default function BatchSection() {
  const [batch, setBatch] = useState(null);

  useEffect(() => {
    setBatch(getNextBatch());
    const id = setInterval(() => setBatch(getNextBatch()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!batch) return null;

  return (
    <section
      style={{
        borderTop: "1px solid rgba(61,28,2,0.08)",
        borderBottom: "1px solid rgba(61,28,2,0.08)",
        background: "var(--color-cream-dark)",
        padding: "36px 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        {/* Left: label */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(61,28,2,0.4)", fontWeight: 600 }}>
            Batch Panggang Berikutnya
          </span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600, color: "rgba(61,28,2,0.55)", fontStyle: "italic" }}>
            Roti paling fresh keluar jam {batch.label} WIB
          </span>
        </div>

        {/* Center: large countdown */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
          {batch.hours > 0 && (
            <>
              <CountCell value={pad(batch.hours)} label="Jam" />
              <Colon />
            </>
          )}
          <CountCell value={pad(batch.minutes)} label="Menit" />
          <Colon />
          <CountCell value={pad(batch.secs)} label="Detik" urgent={batch.urgent} />
        </div>

        {/* Right: batch pills */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {BATCH_HOURS.map((h) => {
            const isNext = h === batch.hour;
            return (
              <div
                key={h}
                style={{
                  padding: "6px 12px",
                  fontFamily: "var(--font-body)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: isNext ? "var(--color-cream)" : "rgba(61,28,2,0.35)",
                  background: isNext ? "var(--color-chocolate)" : "transparent",
                  border: `1px solid ${isNext ? "var(--color-chocolate)" : "rgba(61,28,2,0.12)"}`,
                  borderRadius: 2,
                  transition: "all 0.3s",
                }}
              >
                {String(h).padStart(2, "0")}:00
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CountCell({ value, label, urgent }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(36px, 5vw, 56px)",
        fontWeight: 900,
        letterSpacing: "-0.04em",
        lineHeight: 1,
        color: urgent ? "var(--color-caramel)" : "var(--color-chocolate)",
        transition: "color 0.5s",
      }}>
        {value}
      </div>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(61,28,2,0.3)", marginTop: 4 }}>
        {label}
      </div>
    </div>
  );
}

function Colon() {
  return (
    <span style={{
      fontFamily: "var(--font-display)",
      fontSize: "clamp(30px, 4vw, 48px)",
      fontWeight: 900,
      color: "rgba(61,28,2,0.15)",
      alignSelf: "center",
      padding: "0 4px",
      lineHeight: 1,
      marginBottom: 16,
    }}>
      :
    </span>
  );
}