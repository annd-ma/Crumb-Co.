"use client";
import Link         from "next/link";
import { useCart } from "../lib/CartContext";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQty, removeItem, total } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(26,10,0,0.45)",
          zIndex: 100,
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(440px, 100vw)",
          background: "var(--color-cream)",
          zIndex: 101,
          display: "flex",
          flexDirection: "column",
          borderLeft: "1px solid rgba(61,28,2,0.08)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "28px 32px 20px",
            borderBottom: "1px solid rgba(61,28,2,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--color-chocolate)", letterSpacing: "-0.02em" }}>
              Keranjang
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "rgba(61,28,2,0.4)", letterSpacing: "0.1em", marginTop: 3 }}>
              {items.length} ITEM
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: "none",
              border: "1px solid rgba(61,28,2,0.12)",
              width: 34,
              height: 34,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-chocolate)",
              fontSize: 14,
              borderRadius: 2,
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--color-chocolate)"; e.currentTarget.style.color = "var(--color-cream)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--color-chocolate)"; }}
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: 80 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "rgba(61,28,2,0.3)", fontStyle: "italic", marginBottom: 12 }}>
                Keranjang masih kosong
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "rgba(61,28,2,0.3)", letterSpacing: "0.06em" }}>
                Temukan roti favoritmu di menu kami
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {items.map((item) => (
                <CartItem key={item.id} item={item} updateQty={updateQty} removeItem={removeItem} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: "20px 32px 32px", borderTop: "1px solid rgba(61,28,2,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(61,28,2,0.5)" }}>
                Subtotal
              </span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "var(--color-chocolate)", letterSpacing: "-0.02em" }}>
                Rp {total.toLocaleString("id-ID")}
              </span>
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "rgba(61,28,2,0.35)", marginBottom: 16, letterSpacing: "0.04em" }}>
              Ongkir & konfirmasi saat checkout
            </p>
            <Link
              href="/checkout"
              onClick={() => setIsOpen(false)}
              style={{
                display: "block",
                background: "var(--color-chocolate)",
                color: "var(--color-cream)",
                textAlign: "center",
                padding: "15px 0",
                fontFamily: "var(--font-body)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--color-caramel)")}
              onMouseLeave={e => (e.currentTarget.style.background = "var(--color-chocolate)")}
            >
              Lanjut ke Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

function CartItem({ item, updateQty, removeItem }) {
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
      <div style={{ width: 64, height: 64, flexShrink: 0, overflow: "hidden", background: "var(--color-blush)" }}>
        {item.image_url && (
          <img src={item.image_url} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: "var(--color-chocolate)", marginBottom: 3 }}>
          {item.name}
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--color-caramel)", fontWeight: 500 }}>
          Rp {Number(item.price).toLocaleString("id-ID")}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
          {[-1, null, 1].map((delta, i) =>
            delta === null ? (
              <span key="qty" style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--color-chocolate)", minWidth: 18, textAlign: "center" }}>
                {item.quantity}
              </span>
            ) : (
              <button
                key={delta}
                onClick={() => updateQty(item.id, item.quantity + delta)}
                style={{
                  width: 26,
                  height: 26,
                  border: "1px solid rgba(61,28,2,0.15)",
                  background: "none",
                  cursor: "pointer",
                  fontSize: 14,
                  color: "var(--color-chocolate)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 2,
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--color-chocolate)"; e.currentTarget.style.color = "var(--color-cream)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--color-chocolate)"; }}
              >
                {delta < 0 ? "−" : "+"}
              </button>
            )
          )}
          <button
            onClick={() => removeItem(item.id)}
            style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "rgba(61,28,2,0.3)", fontFamily: "var(--font-body)", letterSpacing: "0.08em", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#c0392b")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(61,28,2,0.3)")}
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}