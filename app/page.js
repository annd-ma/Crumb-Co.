import Link          from "next/link";
import { supabase }  from "../lib/supabase";
import ProductCard   from "../components/ProductCard";
import RevealWrapper from "../components/RevealWrapper";
import BatchSection  from "../components/BatchSection";

export const revalidate = 60;

async function getFeatured() {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("is_best_seller", { ascending: false })
    .limit(5);
  return data || [];
}

export default async function HomePage() {
  const products = await getFeatured();
  const [hero, ...rest] = products;

  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "90vh",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          overflow: "hidden",
        }}
        className="hero-grid"
      >
        {/* Left: typography column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "80px 64px 80px 48px",
            position: "relative",
          }}
        >
          {/* Decorative vertical rule */}
          <div style={{ position: "absolute", left: 0, top: "15%", bottom: "15%", width: 1, background: "rgba(61,28,2,0.08)" }} />

          <div style={{ fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--color-caramel)", fontWeight: 600, marginBottom: 28 }}>
            Artisan Bakery — Jakarta
          </div>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(52px, 7vw, 88px)",
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            color: "var(--color-chocolate)",
            marginBottom: 32,
          }}>
            Rasa yang<br />
            <em style={{ fontStyle: "italic", color: "var(--color-caramel)" }}>Menghangatkan</em>
            <br />Setiap Hari
          </h1>

          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: 15,
            color: "rgba(61,28,2,0.55)",
            lineHeight: 1.75,
            maxWidth: 380,
            marginBottom: 44,
          }}>
            Dipanggang segar dari bahan organik lokal. Setiap loyang
            adalah hasil tangan dan waktu — bukan mesin.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link href="/products" style={{
              background: "var(--color-chocolate)", color: "var(--color-cream)",
              padding: "14px 34px", fontFamily: "var(--font-body)", fontSize: 11,
              fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase",
              textDecoration: "none", borderRadius: 2, transition: "background 0.2s",
            }}>
              Pesan Sekarang
            </Link>
            <Link href="/track" style={{
              background: "none", color: "var(--color-chocolate)",
              padding: "14px 34px", fontFamily: "var(--font-body)", fontSize: 11,
              fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase",
              textDecoration: "none", border: "1px solid rgba(61,28,2,0.2)", borderRadius: 2,
            }}>
              Lacak Pesanan
            </Link>
          </div>

          {/* Trust strip */}
          <div style={{ display: "flex", gap: 32, marginTop: 56, borderTop: "1px solid rgba(61,28,2,0.08)", paddingTop: 24, flexWrap: "wrap" }}>
            {["100% Organik", "Fresh 5× Sehari", "Eco Packaging", "Rating 4.9/5"].map((t) => (
              <div key={t}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(61,28,2,0.35)" }}>
                  {t}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: hero image */}
        <div style={{ position: "relative", overflow: "hidden", background: "var(--color-blush)" }}>
          <img
            src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=85"
            alt="Artisan bread"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          {/* Minimal overlay info card */}
          <div style={{
            position: "absolute", bottom: 36, left: 36,
            background: "rgba(253,246,236,0.92)", backdropFilter: "blur(8px)",
            padding: "18px 22px", maxWidth: 220,
          }}>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-caramel)", fontWeight: 700, marginBottom: 6 }}>
              Batch Berikutnya
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--color-chocolate)" }}>
              Panggang 5× sehari
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "rgba(61,28,2,0.5)", marginTop: 3 }}>
              07:00 · 10:00 · 13:00 · 16:00 · 19:00 WIB
            </div>
          </div>
        </div>
      </section>

      {/* ─── BATCH TIMER SECTION ──────────────────────────── */}
      <BatchSection />

      {/* ─── FEATURED PRODUCTS — Asymmetric Bento ─────────── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 24px" }}>
        <RevealWrapper>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 56 }}>
            <div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--color-caramel)", fontWeight: 600, marginBottom: 12 }}>
                Pilihan Hari Ini
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 900, color: "var(--color-chocolate)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                Freshly Baked,<br />
                <em style={{ fontStyle: "italic" }}>Just For You</em>
              </h2>
            </div>
            <Link href="/products" style={{
              fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600,
              letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(61,28,2,0.45)",
              textDecoration: "none", borderBottom: "1px solid rgba(61,28,2,0.15)",
              paddingBottom: 2,
            }}>
              Lihat Semua
            </Link>
          </div>
        </RevealWrapper>

        {/* Bento grid: first item wide, rest in 3-col */}
        {hero && (
          <RevealWrapper className="reveal-delay-1" style={{ marginBottom: 20 }}>
            <ProductCard product={hero} layout="landscape" />
          </RevealWrapper>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }} className="products-grid">
          {rest.map((p, i) => (
            <RevealWrapper key={p.id} className={`reveal-delay-${i + 1}`}>
              <ProductCard product={p} />
            </RevealWrapper>
          ))}
        </div>
      </section>

      {/* ─── MANIFESTO STRIP ──────────────────────────────── */}
      <RevealWrapper>
        <section style={{ background: "var(--color-chocolate)", padding: "80px 24px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 900, fontStyle: "italic", color: "var(--color-cream)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 24 }}>
              "Hal-hal kecil yang dibuat dengan penuh perhatian bisa menciptakan pengalaman besar."
            </h2>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-caramel)", fontWeight: 600 }}>
              — Filosofi Crumb & Co.
            </div>
          </div>
        </section>
      </RevealWrapper>

      {/* ─── WHY US — 4 columns ───────────────────────────── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 24px" }}>
        <RevealWrapper>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--color-caramel)", fontWeight: 600, marginBottom: 48 }}>
            Kenapa Kami
          </div>
        </RevealWrapper>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, border: "1px solid rgba(61,28,2,0.08)" }} className="why-grid">
          {[
            { n: "01", title: "100% Organik", body: "Bahan dari petani lokal tersertifikasi. Setiap bahan bisa ditelusuri asalnya." },
            { n: "02", title: "5 Kali Panggang", body: "Batch fresh sepanjang hari. Tidak ada produk yang tersimpan dari hari kemarin." },
            { n: "03", title: "Eco Packaging", body: "Kemasan 100% kompostabel. Nol plastik sekali pakai mulai 2025." },
            { n: "04", title: "Bakery Points", body: "Setiap Rp 10.000 = 1 poin. Tukar dengan produk gratis di tier Bronze–Platinum." },
          ].map((item, i) => (
            <RevealWrapper key={item.n} className={`reveal-delay-${i + 1}`}>
              <div style={{ padding: "40px 32px", borderRight: i < 3 ? "1px solid rgba(61,28,2,0.08)" : "none", height: "100%" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 11, fontStyle: "italic", color: "rgba(61,28,2,0.2)", marginBottom: 20 }}>
                  {item.n}
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "var(--color-chocolate)", marginBottom: 12, letterSpacing: "-0.01em" }}>
                  {item.title}
                </h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(61,28,2,0.5)", lineHeight: 1.7 }}>
                  {item.body}
                </p>
              </div>
            </RevealWrapper>
          ))}
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────── */}
      <RevealWrapper>
        <section style={{ maxWidth: 1200, margin: "0 auto 100px", padding: "0 24px" }}>
          <div style={{ background: "var(--color-blush)", padding: "64px 56px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 32 }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 900, color: "var(--color-chocolate)", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 10 }}>
                Pesan sebelum 12.00 WIB,<br />
                <em style={{ fontStyle: "italic" }}>terima hari ini.</em>
              </h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(61,28,2,0.5)" }}>
                Gratis ongkir area Jakarta untuk pesanan di atas Rp 200.000
              </p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/products" style={{ background: "var(--color-chocolate)", color: "var(--color-cream)", padding: "14px 32px", fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", textDecoration: "none", borderRadius: 2 }}>
                Pesan Sekarang
              </Link>
              <a href="https://wa.me/6289540108751" target="_blank" rel="noopener noreferrer" style={{ background: "none", color: "var(--color-chocolate)", padding: "14px 32px", fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", textDecoration: "none", border: "1px solid rgba(61,28,2,0.2)", borderRadius: 2 }}>
                Tanya via WhatsApp
              </a>
            </div>
          </div>
        </section>
      </RevealWrapper>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-grid > div:last-child { min-height: 50vw; }
          .products-grid { grid-template-columns: 1fr 1fr !important; }
          .why-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .products-grid { grid-template-columns: 1fr !important; }
          .why-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}