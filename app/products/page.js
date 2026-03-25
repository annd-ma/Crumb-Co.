"use client";
import { useState, useEffect } from "react";
import { supabase }    from "../../lib/supabase";
import ProductCard     from "../../components/ProductCard";
import RevealWrapper   from "../../components/RevealWrapper";

const CATS = [
  { value: "all",    label: "Semua" },
  { value: "roti",   label: "Roti" },
  { value: "kue",    label: "Kue" },
  { value: "pastry", label: "Pastry" },
];

const SORTS = [
  { value: "default",    label: "Rekomendasi" },
  { value: "price_asc",  label: "Harga Terendah" },
  { value: "price_desc", label: "Harga Tertinggi" },
  { value: "name_asc",   label: "A – Z" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [cat,      setCat]      = useState("all");
  const [sort,     setSort]     = useState("default");
  const [search,   setSearch]   = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      let q = supabase.from("products").select("*").eq("is_active", true);
      if (cat !== "all") q = q.eq("category", cat);
      const { data } = await q;
      setProducts(data || []);
      setLoading(false);
    }
    load();
  }, [cat]);

  let displayed = [...products];
  if (search) {
    const s = search.toLowerCase();
    displayed = displayed.filter(p => p.name.toLowerCase().includes(s) || p.description?.toLowerCase().includes(s));
  }
  if (sort === "price_asc")  displayed.sort((a, b) => a.price - b.price);
  if (sort === "price_desc") displayed.sort((a, b) => b.price - a.price);
  if (sort === "name_asc")   displayed.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "default")    displayed.sort((a, b) => (b.is_best_seller ? 1 : 0) - (a.is_best_seller ? 1 : 0));

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px 120px" }}>
      {/* Header */}
      <RevealWrapper>
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--color-caramel)", fontWeight: 600, marginBottom: 12 }}>
            Katalog
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(38px, 5vw, 64px)", fontWeight: 900, color: "var(--color-chocolate)", letterSpacing: "-0.03em", lineHeight: 1 }}>
            Menu Kami
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(61,28,2,0.45)", marginTop: 12 }}>
            {products.length} produk tersedia hari ini
          </p>
        </div>
      </RevealWrapper>

      {/* Toolbar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 48, flexWrap: "wrap", alignItems: "center", borderBottom: "1px solid rgba(61,28,2,0.08)", paddingBottom: 24 }}>
        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari produk…"
          style={{
            flex: 1, minWidth: 200,
            background: "none", border: "1px solid rgba(61,28,2,0.12)",
            padding: "10px 16px", fontFamily: "var(--font-body)", fontSize: 13,
            color: "var(--color-chocolate)", outline: "none", borderRadius: 2,
          }}
        />

        {/* Category pills */}
        <div style={{ display: "flex", gap: 6 }}>
          {CATS.map(c => (
            <button
              key={c.value}
              onClick={() => setCat(c.value)}
              style={{
                padding: "9px 18px",
                fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600,
                letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer",
                border: "1px solid",
                borderColor: cat === c.value ? "var(--color-chocolate)" : "rgba(61,28,2,0.12)",
                background: cat === c.value ? "var(--color-chocolate)" : "none",
                color: cat === c.value ? "var(--color-cream)" : "rgba(61,28,2,0.5)",
                borderRadius: 2, transition: "all 0.2s",
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          style={{
            padding: "9px 14px", fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600,
            letterSpacing: "0.1em", border: "1px solid rgba(61,28,2,0.12)", background: "none",
            color: "rgba(61,28,2,0.6)", cursor: "pointer", outline: "none", borderRadius: 2,
          }}
        >
          {SORTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }} className="products-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ aspectRatio: "3/4", background: "var(--color-blush)", animation: "pulse 1.5s infinite", opacity: 0.4 }} />
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div style={{ textAlign: "center", paddingTop: 80 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontStyle: "italic", color: "rgba(61,28,2,0.3)", marginBottom: 12 }}>
            Produk tidak ditemukan
          </div>
          <button onClick={() => { setSearch(""); setCat("all"); }}
            style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 12, color: "var(--color-caramel)", textDecoration: "underline" }}>
            Reset filter
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }} className="products-grid">
          {displayed.map((p, i) => (
            <RevealWrapper key={p.id} className={`reveal-delay-${(i % 3) + 1}`}>
              <ProductCard product={p} />
            </RevealWrapper>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) { .products-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 600px) { .products-grid { grid-template-columns: 1fr !important; } }
        @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:0.2} }
      `}</style>
    </div>
  );
}