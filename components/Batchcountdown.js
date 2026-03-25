"use client";
import { useState, useEffect } from "react";
import { getNextBatch, BATCH_HOURS, pad } from "../lib/Batchtimer";

export default function BatchCountdown() {
  const [batch, setBatch] = useState(null);
  const [tick,  setTick]  = useState(0);

  useEffect(() => {
    setBatch(getNextBatch());
    const id = setInterval(() => {
      setBatch(getNextBatch());
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  if (!batch) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Label */}
      <span
        style={{
          fontSize: 9,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--color-chocolate)",
          opacity: 0.45,
          fontWeight: 600,
        }}
      >
        Batch berikutnya
      </span>

      {/* Countdown digits */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        {batch.hours > 0 && (
          <>
            <Digit value={pad(batch.hours)} label="jam" />
            <Sep />
          </>
        )}
        <Digit value={pad(batch.minutes)} label="min" />
        <Sep />
        <Digit value={pad(batch.secs)} label="det" urgent={batch.urgent} />
      </div>

      {/* Batch pills */}
      <div style={{ display: "flex", gap: 4 }}>
        {BATCH_HOURS.map((h) => {
          const isNext = h === batch.hour;
          return (
            <span
              key={h}
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.08em",
                padding: "2px 7px",
                border: `1px solid ${isNext ? "var(--color-caramel)" : "rgba(61,28,2,0.1)"}`,
                color: isNext ? "var(--color-caramel)" : "rgba(61,28,2,0.3)",
                borderRadius: 2,
                transition: "all 0.3s",
              }}
            >
              {String(h).padStart(2, "0")}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function Digit({ value, label, urgent }) {
  return (
    <div style={{ textAlign: "center", lineHeight: 1 }}>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 20,
          fontWeight: 700,
          color: urgent ? "var(--color-caramel)" : "var(--color-chocolate)",
          letterSpacing: "-0.03em",
          transition: "color 0.3s",
        }}
      >
        {value}
      </span>
      <div style={{ fontSize: 8, letterSpacing: "0.1em", color: "rgba(61,28,2,0.35)", fontWeight: 500, marginTop: 1 }}>
        {label}
      </div>
    </div>
  );
}

function Sep() {
  return (
    <span
      style={{
        fontFamily: "var(--font-display)",
        fontSize: 18,
        fontWeight: 700,
        color: "rgba(61,28,2,0.2)",
        lineHeight: 1,
        alignSelf: "center",
        marginBottom: 10,
      }}
    >
      :
    </span>
  );
}
