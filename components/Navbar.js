"use client";
import Link              from "next/link";
import { useCart }       from "../lib/CartContext";
import { useState, useEffect } from "react";
import BatchCountdown    from "./Batchcountdown";

export default function Navbar() {
  const { count, setIsOpen } = useCart();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      {/* Slim announcement bar */}
      <div
        style={{
          background: "var(--color-chocolate)",
          color: "var(--color-blush)",
          fontSize: "11px",
          letterSpacing: "0.14em",
          textAlign: "center",
          padding: "9px 24px",
          fontFamily: "var(--font-body)",
          fontWeight: 500,
        }}
      >
        Bahan 100% Organik &nbsp;·&nbsp; Gratis Ongkir Jakarta &gt; Rp 200K &nbsp;·&nbsp; Pesan sebelum 12.00 → Kirim hari ini
      </div>

      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: scrolled ? "rgba(253,246,236,0.96)" : "var(--color-cream)",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: "1px solid rgba(61,28,2,0.08)",
          transition: "background 0.3s, box-shadow 0.3s",
          boxShadow: scrolled ? "0 1px 20px rgba(61,28,2,0.06)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            height: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Wordmark */}
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 22, color: "var(--color-chocolate)", letterSpacing: "-0.02em", lineHeight: 1 }}>
              Crumb & Co.
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.22em", color: "var(--color-caramel)", fontWeight: 600, textTransform: "uppercase", marginTop: 2 }}>
              Tugasin Bakery
            </div>
          </Link>

          {/* Center — batch countdown (desktop) */}
          <div style={{ display: "none" }} className="batch-center">
            <BatchCountdown />
          </div>

          {/* Desktop links */}
          <div style={{ display: "flex", alignItems: "center", gap: 36 }} className="nav-links">
            {[["Menu", "/products"], ["Lacak Pesanan", "/track"]].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--color-chocolate)",
                  textDecoration: "none",
                  opacity: 0.65,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = 1)}
                onMouseLeave={e => (e.currentTarget.style.opacity = 0.65)}
              >
                {label}
              </Link>
            ))}

            {/* Cart button */}
            <button
              onClick={() => setIsOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "var(--color-chocolate)",
                color: "var(--color-cream)",
                border: "none",
                padding: "10px 22px",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                borderRadius: "var(--radius-btn)",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--color-caramel)")}
              onMouseLeave={e => (e.currentTarget.style.background = "var(--color-chocolate)")}
            >
              Keranjang
              {count > 0 && (
                <span
                  style={{
                    background: "var(--color-caramel)",
                    color: "#fff",
                    fontSize: 9,
                    fontWeight: 800,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-menu-btn"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "none",
              flexDirection: "column",
              gap: 5,
              padding: 4,
            }}
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  width: 22,
                  height: 1.5,
                  background: "var(--color-chocolate)",
                  transition: "all 0.25s",
                }}
              />
            ))}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            style={{
              background: "var(--color-cream)",
              borderTop: "1px solid rgba(61,28,2,0.08)",
              padding: "20px 24px 28px",
            }}
          >
            <BatchCountdown />
            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 18 }}>
              {[["Menu", "/products"], ["Lacak Pesanan", "/track"]].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--color-chocolate)",
                    textDecoration: "none",
                    opacity: 0.7,
                  }}
                >
                  {label}
                </Link>
              ))}
              <button
                onClick={() => { setIsOpen(true); setMenuOpen(false); }}
                style={{
                  background: "var(--color-chocolate)",
                  color: "var(--color-cream)",
                  border: "none",
                  padding: "13px 0",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  marginTop: 8,
                }}
              >
                Keranjang {count > 0 ? `(${count})` : ""}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .nav-links    { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .batch-center { display: none !important; }
        }
        @media (min-width: 769px) {
          .batch-center { display: block !important; }
        }
      `}</style>
    </>
  );
}
