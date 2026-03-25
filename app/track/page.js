"use client";
import { useState, useEffect, Suspense } from "react";
import { supabase }                       from "../../lib/supabase";
import { useSearchParams }                from "next/navigation";

const ADMIN_WA = "6289540108751";

const STEPS = [
  { key: "pending",    label: "Pesanan Masuk",    desc: "Menunggu konfirmasi admin" },
  { key: "confirmed",  label: "Dikonfirmasi",      desc: "Admin telah mengkonfirmasi" },
  { key: "baking",     label: "Sedang Dipanggang", desc: "Rotimu sedang dalam oven" },
  { key: "ready",      label: "Siap",              desc: "Pesanan siap diambil / dikirim" },
  { key: "delivering", label: "Dalam Pengiriman",  desc: "Kurir sedang menuju kamu" },
  { key: "done",       label: "Selesai",            desc: "Pesanan berhasil diterima" },
];

function stepIndex(status) {
  return STEPS.findIndex(s => s.key === status);
}

function TrackInner() {
  const params     = useSearchParams();
  const initId     = params.get("order") || "";
  const isNew      = params.get("new") === "1";

  const [query,    setQuery]   = useState(initId);
  const [order,    setOrder]   = useState(null);
  const [loading,  setLoading] = useState(!!initId);
  const [notFound, setNF]      = useState(false);
  const [waUrl,    setWaUrl]   = useState("");

  useEffect(() => {
    if (initId) fetch(initId);
  }, [initId]);

  // Retrieve WA text from sessionStorage when order is new
  useEffect(() => {
    if (isNew && initId) {
      const stored = sessionStorage.getItem("crumbco_wa_" + initId);
      if (stored) {
        setWaUrl(`https://wa.me/${ADMIN_WA}?text=${stored}`);
      }
    }
  }, [isNew, initId]);

  async function fetch(id) {
    setLoading(true); setNF(false);
    const { data } = await supabase
      .from("orders").select("*")
      .eq("order_id", id.trim().toUpperCase()).single();
    setOrder(data || null);
    if (!data) setNF(true);
    setLoading(false);
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) fetch(query.trim());
  };

  const curIdx = order ? stepIndex(order.status) : -1;

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "80px 24px 120px" }}>
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--color-caramel)", fontWeight: 600, marginBottom: 12 }}>
          Tracking
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, color: "var(--color-chocolate)", letterSpacing: "-0.03em" }}>
          Lacak Pesanan
        </h1>
      </div>

      {/* ── NEW ORDER — Prominent WA CTA ── */}
      {isNew && order && waUrl && (
        <div style={{
          background: "var(--color-chocolate)", padding: "32px 28px", marginBottom: 40,
          border: "none",
        }}>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--color-caramel)", fontWeight: 700, marginBottom: 10 }}>
            Pesanan Berhasil Dibuat
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "var(--color-cream)", letterSpacing: "-0.02em", marginBottom: 8 }}>
            Satu langkah lagi —<br />
            <em style={{ fontStyle: "italic" }}>konfirmasi via WhatsApp.</em>
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "rgba(253,246,236,0.55)", lineHeight: 1.6, marginBottom: 24 }}>
            Pesananmu (<strong style={{ color: "var(--color-blush)" }}>{order.order_id}</strong>) sudah masuk ke sistem kami.
            Tekan tombol di bawah untuk mengirim detail pesanan ke admin dan menyelesaikan konfirmasi pembayaran.
          </p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background: "var(--color-caramel)", color: "var(--color-cream)",
              padding: "15px 32px", fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none",
              borderRadius: 2, transition: "background 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--color-gold)")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--color-caramel)")}
          >
            Konfirmasi Pesanan via WhatsApp
          </a>
        </div>
      )}

      {/* Search */}
      <form onSubmit={handleSearch} style={{ display: "flex", gap: 10, marginBottom: 40 }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Masukkan Order ID — contoh: CRB-ABC12-XY34"
          style={{
            flex: 1, background: "none", border: "1px solid rgba(61,28,2,0.12)",
            padding: "12px 16px", fontFamily: "var(--font-body)", fontSize: 13,
            color: "var(--color-chocolate)", outline: "none", borderRadius: 2,
          }}
        />
        <button
          type="submit"
          style={{
            background: "var(--color-chocolate)", color: "var(--color-cream)",
            border: "none", padding: "12px 24px", cursor: "pointer",
            fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700,
            letterSpacing: "0.14em", textTransform: "uppercase", borderRadius: 2,
          }}
        >
          Cari
        </button>
      </form>

      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontStyle: "italic", color: "rgba(61,28,2,0.3)" }}>
            Mencari pesanan…
          </div>
        </div>
      )}

      {notFound && (
        <div style={{ border: "1px solid rgba(61,28,2,0.08)", padding: "48px 32px", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontStyle: "italic", color: "rgba(61,28,2,0.3)", marginBottom: 8 }}>
            Pesanan tidak ditemukan
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "rgba(61,28,2,0.3)" }}>
            Pastikan Order ID sudah benar — format: CRB-XXXXX-YYYY
          </p>
        </div>
      )}

      {order && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Order meta */}
          <div style={{ border: "1px solid rgba(61,28,2,0.08)", padding: "24px 28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(61,28,2,0.35)", marginBottom: 6 }}>
                  Order ID
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, color: "var(--color-chocolate)", letterSpacing: "-0.01em" }}>
                  {order.order_id}
                </div>
              </div>
              <StatusPill status={order.status} />
            </div>
            <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 5 }}>
              {[
                ["Pemesan",   order.customer_name],
                ["Kontak",    order.customer_phone],
                ["Pengiriman", order.delivery_method === "delivery" ? order.delivery_address : "Pick Up di Toko"],
                ["Tanggal",   new Date(order.created_at).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: 16 }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "rgba(61,28,2,0.35)", width: 80, flexShrink: 0, letterSpacing: "0.06em" }}>{k}</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--color-chocolate)", fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stepper */}
          <div style={{ border: "1px solid rgba(61,28,2,0.08)", padding: "24px 28px" }}>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(61,28,2,0.35)", marginBottom: 24 }}>
              Status Pesanan
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {STEPS.map((step, i) => {
                const done    = i <= curIdx;
                const current = i === curIdx;
                return (
                  <div key={step.key} style={{ display: "flex", gap: 16, alignItems: "stretch" }}>
                    {/* Line + dot */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 20, flexShrink: 0 }}>
                      <div style={{
                        width: 10, height: 10, borderRadius: "50%", flexShrink: 0, marginTop: 4,
                        background: current ? "var(--color-caramel)" : done ? "var(--color-chocolate)" : "rgba(61,28,2,0.1)",
                        boxShadow: current ? "0 0 0 3px rgba(196,135,58,0.2)" : "none",
                        transition: "all 0.3s",
                      }} />
                      {i < STEPS.length - 1 && (
                        <div style={{ flex: 1, width: 1, background: done ? "rgba(61,28,2,0.2)" : "rgba(61,28,2,0.06)", minHeight: 28, marginTop: 3 }} />
                      )}
                    </div>
                    {/* Text */}
                    <div style={{ paddingBottom: i < STEPS.length - 1 ? 20 : 0 }}>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: current ? 700 : 500, color: current ? "var(--color-caramel)" : done ? "var(--color-chocolate)" : "rgba(61,28,2,0.25)", letterSpacing: "-0.01em" }}>
                        {step.label}
                      </div>
                      {current && (
                        <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "rgba(61,28,2,0.4)", marginTop: 2 }}>
                          {step.desc}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items */}
          <div style={{ border: "1px solid rgba(61,28,2,0.08)", padding: "24px 28px" }}>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(61,28,2,0.35)", marginBottom: 18 }}>
              Item Pesanan
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {(order.items || []).map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-chocolate)" }}>
                    {item.name} <span style={{ color: "rgba(61,28,2,0.35)" }}>×{item.qty}</span>
                  </span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: "var(--color-chocolate)" }}>
                    Rp {(item.price * item.qty).toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
              <div style={{ borderTop: "1px solid rgba(61,28,2,0.08)", paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(61,28,2,0.4)" }}>Total</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 900, color: "var(--color-chocolate)", letterSpacing: "-0.02em" }}>
                  Rp {Number(order.total_amount).toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>

          {/* Contact admin */}
          <a
            href={`https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(`Halo, saya ingin menanyakan pesanan ${order.order_id}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block", textAlign: "center", padding: "13px 0",
              fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600,
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: "rgba(61,28,2,0.4)", textDecoration: "none",
              border: "1px solid rgba(61,28,2,0.1)", borderRadius: 2,
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--color-caramel)"; e.currentTarget.style.color = "var(--color-caramel)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(61,28,2,0.1)"; e.currentTarget.style.color = "rgba(61,28,2,0.4)"; }}
          >
            Hubungi Admin
          </a>
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    pending:    { bg: "rgba(212,168,67,0.1)",  color: "#8B6914" },
    confirmed:  { bg: "rgba(122,140,114,0.1)", color: "var(--color-sage)" },
    baking:     { bg: "rgba(196,135,58,0.12)", color: "var(--color-caramel)" },
    ready:      { bg: "rgba(122,140,114,0.15)", color: "var(--color-sage)" },
    delivering: { bg: "rgba(61,28,2,0.07)",    color: "var(--color-chocolate-mid)" },
    done:       { bg: "rgba(122,140,114,0.18)", color: "var(--color-sage)" },
    cancelled:  { bg: "rgba(192,57,43,0.08)",  color: "#c0392b" },
  };
  const s = map[status] || { bg: "rgba(61,28,2,0.06)", color: "rgba(61,28,2,0.5)" };
  return (
    <span style={{
      fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 700,
      letterSpacing: "0.18em", textTransform: "uppercase",
      padding: "6px 14px", background: s.bg, color: s.color, borderRadius: 2,
    }}>
      {status}
    </span>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div style={{ padding: 80, textAlign: "center", fontFamily: "var(--font-display)", fontStyle: "italic", color: "rgba(61,28,2,0.3)" }}>Memuat…</div>}>
      <TrackInner />
    </Suspense>
  );
}