"use client";

import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer style={{ background: "var(--color-chocolate)", color: "var(--color-cream)", padding: "72px 24px 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 48, marginBottom: 56 }}>
          
          {/* Brand */}
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 4 }}>
              Crumb & Co.
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--color-caramel)", fontWeight: 600, marginBottom: 20 }}>
              Tugasin Bakery
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(253,246,236,0.45)", lineHeight: 1.75, maxWidth: 300 }}>
              Artisan bakery berbahan organik lokal. Dipanggang segar setiap hari untuk meja makan Anda.
            </p>
          </div>

          {/* Info */}
          <div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--color-caramel)", fontWeight: 600, marginBottom: 18 }}>
              Operasional
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                ["Jam Buka", "Setiap hari 07.00 – 20.00 WIB"],
                ["WhatsApp", "+62 895-401-087-518"],
                ["Instagram", "@crumbandco.id"],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 9, color: "rgba(253,246,236,0.25)" }}>{k}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "rgba(253,246,236,0.55)" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--color-caramel)", fontWeight: 600, marginBottom: 18 }}>
              Tautan
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[["Menu", "/products"], ["Lacak Pesanan", "/track"], ["Checkout", "/checkout"], ["Admin", "/admin"]].map(([label, href]) => (
                <Link key={href} href={href} className="footer-link">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(253,246,236,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(253,246,236,0.2)" }}>
          <span>© 2026 Crumb & Co. by Tugasin Digital</span>
          <span>Bandung, Indonesia</span>
        </div>
      </div>

      <style jsx>{`
        .footer-link {
          font-family: var(--font-body);
          font-size: 12px;
          color: rgba(253,246,236,0.45);
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-link:hover {
          color: var(--color-caramel) !important;
        }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 500px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}