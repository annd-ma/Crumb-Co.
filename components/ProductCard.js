"use client";
import { useState }  from "react";
import { useCart }   from "../lib/CartContext";

const CAT_LABEL = { roti: "Roti", kue: "Kue", pastry: "Pastry" };

export default function ProductCard({ product, layout = "portrait" }) {
  const { addItem } = useCart();
  const [state, setState] = useState("idle"); // idle | added | error

  if (!product) return null;

  const soldOut  = product.stock === 0;
  const lowStock = !soldOut && product.stock <= 5;

  const handleAdd = () => {
    if (soldOut) return;
    addItem(product);
    setState("added");
    setTimeout(() => setState("idle"), 1600);
  };

  if (layout === "landscape") {
    return <LandscapeCard product={product} soldOut={soldOut} lowStock={lowStock} onAdd={handleAdd} state={state} />;
  }

  return <PortraitCard product={product} soldOut={soldOut} lowStock={lowStock} onAdd={handleAdd} state={state} />;
}

/* ── Portrait (default grid card) ──────────────────────── */
function PortraitCard({ product, soldOut, lowStock, onAdd, state }) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        background: "var(--color-cream)",
        border: "1px solid rgba(61,28,2,0.07)",
        overflow: "hidden",
        cursor: "default",
        transition: "box-shadow 0.35s",
        boxShadow: hovered ? "0 12px 48px rgba(61,28,2,0.10)" : "none",
      }}
    >
      {/* Photo block — tall, dominant */}
      <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", background: "var(--color-blush)" }}>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            style={{
              width: "100%", height: "100%", objectFit: "cover", display: "block",
              transform: hovered ? "scale(1.04)" : "scale(1)",
              transition: "transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94)",
            }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "var(--color-blush)" }} />
        )}

        {/* Overlay badges — top left */}
        <div style={{ position: "absolute", top: 14, left: 14, display: "flex", flexDirection: "column", gap: 6 }}>
          {product.is_best_seller && <Badge text="Best Seller" dark />}
          {product.is_new        && <Badge text="Baru" />}
          {lowStock              && <Badge text={`Sisa ${product.stock}`} warm />}
        </div>

        {/* Sold-out scrim */}
        {soldOut && (
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(61,28,2,0.55)",
            backdropFilter: "blur(2px)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{
              fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.22em", textTransform: "uppercase",
              color: "var(--color-cream)", border: "1px solid rgba(253,246,236,0.5)",
              padding: "8px 18px",
            }}>
              Habis Terjual
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "20px 20px 24px", display: "flex", flexDirection: "column", gap: 0, flex: 1 }}>
        {/* Category */}
        <div style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-caramel)", fontWeight: 600, marginBottom: 7 }}>
          {product.category ? (product.category.charAt(0).toUpperCase() + product.category.slice(1)) : ""}
          {product.weight_gram ? ` — ${product.weight_gram}g` : ""}
        </div>

        {/* Name */}
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "var(--color-chocolate)", letterSpacing: "-0.01em", lineHeight: 1.2, marginBottom: 8 }}>
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "rgba(61,28,2,0.5)", lineHeight: 1.65, marginBottom: 16, flex: 1 }}
             className="line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Price row + CTA */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", gap: 10 }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 900, color: "var(--color-chocolate)", letterSpacing: "-0.02em", lineHeight: 1 }}>
              Rp {Number(product.price).toLocaleString("id-ID")}
            </div>
          </div>

          <button
            onClick={onAdd}
            disabled={soldOut}
            style={{
              background: state === "added"
                ? "var(--color-sage)"
                : soldOut
                ? "rgba(61,28,2,0.08)"
                : "var(--color-chocolate)",
              color: soldOut && state !== "added" ? "rgba(61,28,2,0.3)" : "var(--color-cream)",
              border: "none",
              padding: "10px 16px",
              cursor: soldOut ? "not-allowed" : "pointer",
              fontFamily: "var(--font-body)",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              transition: "background 0.25s, transform 0.15s",
              transform: state === "added" ? "scale(0.97)" : "scale(1)",
              whiteSpace: "nowrap",
              flexShrink: 0,
              borderRadius: 2,
            }}
          >
            {state === "added" ? "Ditambahkan" : soldOut ? "Habis" : "+ Tambah"}
          </button>
        </div>
      </div>
    </article>
  );
}

/* ── Landscape (wide featured card) ───────────────────── */
function LandscapeCard({ product, soldOut, lowStock, onAdd, state }) {
  return (
    <article style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      border: "1px solid rgba(61,28,2,0.07)",
      overflow: "hidden",
      background: "var(--color-cream)",
    }}>
      <div style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden", background: "var(--color-blush)" }}>
        {product.image_url && (
          <img src={product.image_url} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        )}
        {soldOut && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(61,28,2,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-cream)", border: "1px solid rgba(253,246,236,0.4)", padding: "7px 16px" }}>
              Habis Terjual
            </span>
          </div>
        )}
      </div>
      <div style={{ padding: "32px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          {product.is_best_seller && <Badge text="Best Seller" dark style={{ marginBottom: 14, display: "inline-flex" }} />}
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "var(--color-chocolate)", lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 10 }}>
            {product.name}
          </h3>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "rgba(61,28,2,0.5)", lineHeight: 1.7 }} className="line-clamp-3">
            {product.description}
          </p>
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 900, color: "var(--color-chocolate)", letterSpacing: "-0.03em", marginBottom: 14 }}>
            Rp {Number(product.price).toLocaleString("id-ID")}
          </div>
          <button onClick={onAdd} disabled={soldOut} style={{
            background: state === "added" ? "var(--color-sage)" : soldOut ? "rgba(61,28,2,0.08)" : "var(--color-chocolate)",
            color: soldOut && state !== "added" ? "rgba(61,28,2,0.3)" : "var(--color-cream)",
            border: "none", padding: "12px 24px", cursor: soldOut ? "not-allowed" : "pointer",
            fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em",
            textTransform: "uppercase", transition: "background 0.25s", borderRadius: 2,
          }}>
            {state === "added" ? "Ditambahkan" : soldOut ? "Habis" : "Tambah ke Keranjang"}
          </button>
        </div>
      </div>
    </article>
  );
}

/* ── Badge ──────────────────────────────────────────────── */
function Badge({ text, dark, warm, style: extraStyle }) {
  return (
    <span style={{
      display: "inline-block",
      fontFamily: "var(--font-body)",
      fontSize: 8,
      fontWeight: 700,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      padding: "4px 10px",
      background: dark ? "var(--color-chocolate)" : warm ? "var(--color-caramel)" : "var(--color-cream)",
      color: dark || warm ? "var(--color-cream)" : "var(--color-chocolate)",
      borderRadius: 2,
      ...extraStyle,
    }}>
      {text}
    </span>
  );
}