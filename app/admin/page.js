"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../../lib/supabase";

const ADMIN_PW   = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "crumbadmin2025";
const ADMIN_WA   = "6289540108751";
const BUCKET     = "product-images";
const STATUS_OPT = ["pending","confirmed","baking","ready","delivering","done","cancelled"];

/* ══════════════════════════════════════════════
   LOGIN SCREEN
══════════════════════════════════════════════ */
function LoginScreen({ onLogin }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const handle = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PW) { sessionStorage.setItem("crumbco_admin", "1"); onLogin(); }
    else setErr("Password salah.");
  };
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-cream)", padding: 24 }}>
      <form onSubmit={handle} style={{ width: "100%", maxWidth: 360, border: "1px solid rgba(61,28,2,0.08)", padding: "48px 36px", background: "var(--color-cream)" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 900, color: "var(--color-chocolate)", letterSpacing: "-0.02em" }}>
            Crumb & Co.
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--color-caramel)", fontWeight: 600, marginTop: 4 }}>
            Admin Panel
          </div>
        </div>
        <label style={{ fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(61,28,2,0.4)", fontWeight: 600, display: "block", marginBottom: 8 }}>
          Password
        </label>
        <input
          type="password" value={pw} onChange={e => setPw(e.target.value)}
          placeholder="••••••••"
          style={{ width: "100%", padding: "12px 14px", border: "1px solid rgba(61,28,2,0.12)", background: "none", fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-chocolate)", outline: "none", marginBottom: err ? 8 : 20, borderRadius: 2 }}
        />
        {err && <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#c0392b", marginBottom: 16 }}>{err}</p>}
        <button type="submit" style={{ width: "100%", background: "var(--color-chocolate)", color: "var(--color-cream)", border: "none", padding: "13px 0", fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer", borderRadius: 2 }}>
          Masuk
        </button>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════
   IMAGE UPLOADER — Supabase Storage
══════════════════════════════════════════════ */
function ImageUploader({ currentUrl, onUploaded }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [preview,   setPreview]   = useState(currentUrl || "");
  const [error,     setError]     = useState("");

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("File harus berupa gambar."); return; }
    if (file.size > 5 * 1024 * 1024)    { setError("Ukuran file maks 5MB."); return; }

    setError(""); setUploading(true);

    // Preview lokal
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload ke Supabase Storage
    const ext  = file.name.split(".").pop();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const path = `products/${name}`;

    const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

    if (upErr) {
      setError("Upload gagal: " + upErr.message);
      setUploading(false);
      return;
    }

    // Dapatkan public URL
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    onUploaded(data.publicUrl);
    setUploading(false);
  };

  return (
    <div>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(61,28,2,0.4)", fontWeight: 600, marginBottom: 8 }}>
        Foto Produk
      </div>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
        style={{
          border: "1.5px dashed rgba(61,28,2,0.18)", padding: "20px",
          cursor: uploading ? "not-allowed" : "pointer", textAlign: "center",
          background: "rgba(61,28,2,0.01)", transition: "border-color 0.2s", borderRadius: 2,
          position: "relative", overflow: "hidden",
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--color-caramel)")}
        onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(61,28,2,0.18)")}
      >
        {preview ? (
          <div style={{ position: "relative" }}>
            <img src={preview} alt="preview" style={{ maxHeight: 160, maxWidth: "100%", objectFit: "cover", display: "block", margin: "0 auto" }} />
            <div style={{ position: "absolute", inset: 0, background: "rgba(61,28,2,0.35)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = 1)}
              onMouseLeave={e => (e.currentTarget.style.opacity = 0)}>
              <span style={{ color: "#fff", fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Ganti Foto
              </span>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(61,28,2,0.4)", marginBottom: 4 }}>
              {uploading ? "Mengupload…" : "Klik atau drag & drop foto"}
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "rgba(61,28,2,0.25)" }}>
              JPG, PNG, WebP — maks 5MB
            </div>
          </div>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }}
        onChange={e => handleFile(e.target.files[0])} />

      {uploading && (
        <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--color-caramel)", marginTop: 6 }}>
          Mengupload foto…
        </div>
      )}
      {error && (
        <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#c0392b", marginTop: 6 }}>
          {error}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   PRODUCT FORM
══════════════════════════════════════════════ */
const EMPTY = { name:"", description:"", price:"", category:"roti", stock:0, image_url:"", is_best_seller:false, is_new:false, is_active:true, allergens:"", weight_gram:"" };

function ProductForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY);
  const [busy, setBusy] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock), weight_gram: form.weight_gram ? Number(form.weight_gram) : null };
    let err;
    if (form.id) ({ error: err } = await supabase.from("products").update(payload).eq("id", form.id));
    else         ({ error: err } = await supabase.from("products").insert(payload));
    setBusy(false);
    if (!err) onSave();
    else alert("Error: " + err.message);
  };

  const inputStyle = {
    width: "100%", background: "none", border: "1px solid rgba(61,28,2,0.12)",
    padding: "10px 13px", fontFamily: "var(--font-body)", fontSize: 13,
    color: "var(--color-chocolate)", outline: "none", borderRadius: 2,
  };
  const labelStyle = {
    display: "block", fontFamily: "var(--font-body)", fontSize: 9,
    letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(61,28,2,0.4)",
    fontWeight: 600, marginBottom: 6,
  };

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Image upload */}
      <ImageUploader
        currentUrl={form.image_url}
        onUploaded={url => set("image_url", url)}
      />

      {/* If an image_url exists but not uploaded via Storage, also allow manual URL */}
      <div>
        <label style={labelStyle}>URL Foto (opsional — override upload)</label>
        <input type="text" value={form.image_url} onChange={e => set("image_url", e.target.value)}
          placeholder="https://... (kosongkan jika pakai upload di atas)"
          style={inputStyle} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {[
          { k:"name",        l:"Nama Produk",       t:"text"   },
          { k:"price",       l:"Harga (Rp)",        t:"number" },
          { k:"stock",       l:"Stok",              t:"number" },
          { k:"weight_gram", l:"Berat (gram)",      t:"number" },
          { k:"allergens",   l:"Alergen (koma)",    t:"text"   },
        ].map(f => (
          <div key={f.k}>
            <label style={labelStyle}>{f.l}</label>
            <input type={f.t} value={form[f.k]} onChange={e => set(f.k, e.target.value)} style={inputStyle} />
          </div>
        ))}

        <div>
          <label style={labelStyle}>Kategori</label>
          <select value={form.category} onChange={e => set("category", e.target.value)}
            style={{ ...inputStyle, cursor: "pointer" }}>
            {["roti","kue","pastry"].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label style={labelStyle}>Deskripsi</label>
        <textarea value={form.description} onChange={e => set("description", e.target.value)}
          rows={3} style={{ ...inputStyle, resize: "vertical" }} />
      </div>

      {/* Toggles */}
      <div style={{ display: "flex", gap: 24 }}>
        {[["is_best_seller","Best Seller"],["is_new","Baru"],["is_active","Aktif"]].map(([k,l]) => (
          <label key={k} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontFamily:"var(--font-body)", fontSize:12, color:"rgba(61,28,2,0.6)" }}>
            <input type="checkbox" checked={form[k]} onChange={e => set(k, e.target.checked)}
              style={{ width:14, height:14, accentColor:"var(--color-caramel)", cursor:"pointer" }} />
            {l}
          </label>
        ))}
      </div>

      <div style={{ display:"flex", gap:10, paddingTop:4 }}>
        <button type="submit" disabled={busy} style={{
          background: busy ? "rgba(61,28,2,0.3)" : "var(--color-chocolate)",
          color: "var(--color-cream)", border: "none", padding: "11px 26px", cursor: busy ? "not-allowed" : "pointer",
          fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
          letterSpacing: "0.16em", textTransform: "uppercase", borderRadius: 2,
        }}>
          {busy ? "Menyimpan…" : form.id ? "Simpan Perubahan" : "Tambah Produk"}
        </button>
        <button type="button" onClick={onCancel} style={{
          background:"none", border:"1px solid rgba(61,28,2,0.12)", color:"rgba(61,28,2,0.5)",
          padding:"11px 20px", cursor:"pointer", fontFamily:"var(--font-body)", fontSize:10,
          fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", borderRadius:2,
        }}>
          Batal
        </button>
      </div>
    </form>
  );
}

/* ══════════════════════════════════════════════
   MAIN ADMIN
══════════════════════════════════════════════ */
export default function AdminPage() {
  const [auth,         setAuth]         = useState(false);
  const [tab,          setTab]          = useState("dashboard");
  const [orders,       setOrders]       = useState([]);
  const [products,     setProducts]     = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [editProduct,  setEditProduct]  = useState(null);
  const [showForm,     setShowForm]     = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (sessionStorage.getItem("crumbco_admin") === "1") setAuth(true);
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders(data || []);
    setLoading(false);
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("id");
    setProducts(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!auth) return;
    fetchOrders();
    fetchProducts();
  }, [auth, fetchOrders, fetchProducts]);

  const updateStatus = async (id, status) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const deleteProduct = async (id) => {
    if (!confirm("Hapus produk ini?")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  if (!auth) return <LoginScreen onLogin={() => setAuth(true)} />;

  // Stats
  const today   = new Date().toDateString();
  const todayO  = orders.filter(o => new Date(o.created_at).toDateString() === today);
  const todayRev = todayO.reduce((s, o) => s + Number(o.total_amount), 0);

  // Best selling item
  const itemCounts = {};
  orders.forEach(o => (o.items || []).forEach(i => {
    itemCounts[i.name] = (itemCounts[i.name] || 0) + i.qty;
  }));
  const bestSelling = Object.entries(itemCounts).sort((a, b) => b[1] - a[1])[0];

  const filteredOrders = filterStatus === "all" ? orders : orders.filter(o => o.status === filterStatus);

  const STATUS_STYLE = {
    pending:    { bg:"rgba(212,168,67,0.1)",   color:"#8B6914" },
    confirmed:  { bg:"rgba(122,140,114,0.1)",  color:"var(--color-sage)" },
    baking:     { bg:"rgba(196,135,58,0.12)",  color:"var(--color-caramel)" },
    ready:      { bg:"rgba(122,140,114,0.15)", color:"var(--color-sage)" },
    delivering: { bg:"rgba(61,28,2,0.07)",     color:"var(--color-chocolate-mid)" },
    done:       { bg:"rgba(122,140,114,0.18)", color:"var(--color-sage)" },
    cancelled:  { bg:"rgba(192,57,43,0.08)",   color:"#c0392b" },
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F9F3EA" }}>
      {/* ── Top bar ── */}
      <div style={{ background: "var(--color-chocolate)", padding: "0 28px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 900, color: "var(--color-cream)", letterSpacing: "-0.02em" }}>
            Crumb & Co.
          </span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(253,246,236,0.35)", fontWeight: 600 }}>
            Admin
          </span>
        </div>
        <button onClick={() => { sessionStorage.removeItem("crumbco_admin"); setAuth(false); }}
          style={{ background:"none", border:"none", cursor:"pointer", fontFamily:"var(--font-body)", fontSize:10, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(253,246,236,0.35)", transition:"color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--color-caramel)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(253,246,236,0.35)")}>
          Keluar
        </button>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 24px 100px" }}>

        {/* ── STATS WIDGETS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 40 }} className="stats-grid">
          {[
            { label: "Order Hari Ini",   value: todayO.length,                          sub: "pesanan" },
            { label: "Revenue Hari Ini", value: `Rp ${todayRev.toLocaleString("id-ID")}`, sub: "total hari ini" },
            { label: "Best Seller",      value: bestSelling?.[0] || "—",               sub: bestSelling ? `${bestSelling[1]} terjual` : "belum ada data" },
            { label: "Stok Habis",       value: products.filter(p => p.stock === 0).length, sub: "produk" },
          ].map(w => (
            <div key={w.label} style={{ background: "var(--color-cream)", border: "1px solid rgba(61,28,2,0.07)", padding: "22px 20px" }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(61,28,2,0.35)", fontWeight: 600, marginBottom: 10 }}>
                {w.label}
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "var(--color-chocolate)", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 4 }}>
                {w.value}
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "rgba(61,28,2,0.35)" }}>
                {w.sub}
              </div>
            </div>
          ))}
        </div>

        {/* ── TABS ── */}
        <div style={{ display: "flex", gap: 2, marginBottom: 28, borderBottom: "1px solid rgba(61,28,2,0.08)", paddingBottom: 0 }}>
          {[["dashboard","Ringkasan"],["orders","Pesanan"],["products","Produk"]].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "10px 20px",
              fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: tab === k ? "var(--color-chocolate)" : "rgba(61,28,2,0.35)",
              borderBottom: `2px solid ${tab === k ? "var(--color-chocolate)" : "transparent"}`,
              transition: "all 0.2s", marginBottom: -1,
            }}>
              {l}
            </button>
          ))}
        </div>

        {/* ── DASHBOARD TAB ── */}
        {tab === "dashboard" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="dash-grid">
            {/* Recent orders */}
            <div style={{ background: "var(--color-cream)", border: "1px solid rgba(61,28,2,0.07)", padding: "24px 22px" }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(61,28,2,0.35)", fontWeight: 600, marginBottom: 18 }}>
                5 Pesanan Terbaru
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {orders.slice(0, 5).map(o => (
                  <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <div>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, color: "var(--color-chocolate)" }}>{o.customer_name}</div>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "rgba(61,28,2,0.35)" }}>{o.order_id}</div>
                    </div>
                    <span style={{
                      fontFamily: "var(--font-body)", fontSize: 8, fontWeight: 700,
                      letterSpacing: "0.16em", textTransform: "uppercase", padding: "4px 10px",
                      background: STATUS_STYLE[o.status]?.bg || "rgba(61,28,2,0.06)",
                      color: STATUS_STYLE[o.status]?.color || "rgba(61,28,2,0.5)",
                      borderRadius: 2,
                    }}>
                      {o.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Low stock */}
            <div style={{ background: "var(--color-cream)", border: "1px solid rgba(61,28,2,0.07)", padding: "24px 22px" }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(61,28,2,0.35)", fontWeight: 600, marginBottom: 18 }}>
                Stok Rendah / Habis
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {products.filter(p => p.stock <= 5).slice(0, 6).map(p => (
                  <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 500, color: "var(--color-chocolate)" }}>{p.name}</span>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 800, color: p.stock === 0 ? "#c0392b" : "var(--color-caramel)" }}>
                      {p.stock === 0 ? "Habis" : `${p.stock} sisa`}
                    </span>
                  </div>
                ))}
                {products.filter(p => p.stock <= 5).length === 0 && (
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "rgba(61,28,2,0.3)", fontStyle: "italic" }}>
                    Semua stok aman
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── ORDERS TAB ── */}
        {tab === "orders" && (
          <div>
            {/* Filter pills */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              {["all", ...STATUS_OPT].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)} style={{
                  padding: "7px 14px", border: "1px solid",
                  borderColor: filterStatus === s ? "var(--color-chocolate)" : "rgba(61,28,2,0.1)",
                  background: filterStatus === s ? "var(--color-chocolate)" : "none",
                  color: filterStatus === s ? "var(--color-cream)" : "rgba(61,28,2,0.4)",
                  fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 700,
                  letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer", borderRadius: 2,
                }}>
                  {s === "all" ? "Semua" : s}
                </button>
              ))}
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "60px 0", fontFamily: "var(--font-display)", fontSize: 15, fontStyle: "italic", color: "rgba(61,28,2,0.3)" }}>
                Memuat…
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filteredOrders.map(o => (
                  <div key={o.id} style={{ background: "var(--color-cream)", border: "1px solid rgba(61,28,2,0.07)", padding: "18px 20px", display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 5 }}>
                        <span style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, color: "var(--color-chocolate)", letterSpacing: "0.04em" }}>
                          {o.order_id}
                        </span>
                        <span style={{
                          fontFamily: "var(--font-body)", fontSize: 8, fontWeight: 700, letterSpacing: "0.16em",
                          textTransform: "uppercase", padding: "3px 8px", borderRadius: 2,
                          background: STATUS_STYLE[o.status]?.bg, color: STATUS_STYLE[o.status]?.color,
                        }}>
                          {o.status}
                        </span>
                      </div>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: "var(--color-chocolate)", marginBottom: 2 }}>
                        {o.customer_name}
                      </div>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "rgba(61,28,2,0.4)" }}>
                        {o.customer_phone} &nbsp;·&nbsp; {o.delivery_method === "delivery" ? (o.delivery_address || "").substring(0, 45) + "…" : "Pick Up"}
                      </div>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "rgba(61,28,2,0.3)", marginTop: 4 }}>
                        {new Date(o.created_at).toLocaleString("id-ID")} &nbsp;·&nbsp;
                        <strong style={{ color: "var(--color-chocolate)" }}>Rp {Number(o.total_amount).toLocaleString("id-ID")}</strong>
                      </div>
                    </div>
                    {/* Controls */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <select
                        value={o.status}
                        onChange={e => updateStatus(o.id, e.target.value)}
                        style={{
                          background: "none", border: "1px solid rgba(61,28,2,0.12)",
                          padding: "8px 12px", fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 600,
                          color: "var(--color-chocolate)", cursor: "pointer", outline: "none", borderRadius: 2,
                        }}
                      >
                        {STATUS_OPT.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <a
                        href={`https://wa.me/${(o.customer_phone || "").replace(/\D/g, "")}?text=${encodeURIComponent(`Halo ${o.customer_name}, pesanan ${o.order_id} Anda sedang kami proses. Terima kasih! — Crumb & Co.`)}`}
                        target="_blank" rel="noopener noreferrer"
                        style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-sage)", textDecoration: "none", border: "1px solid var(--color-sage)", padding: "8px 12px", borderRadius: 2, whiteSpace: "nowrap", transition: "all 0.2s" }}
                      >
                        WA
                      </a>
                    </div>
                  </div>
                ))}
                {filteredOrders.length === 0 && (
                  <div style={{ textAlign: "center", padding: "48px 0", fontFamily: "var(--font-display)", fontSize: 16, fontStyle: "italic", color: "rgba(61,28,2,0.25)" }}>
                    Tidak ada pesanan
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── PRODUCTS TAB ── */}
        {tab === "products" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "rgba(61,28,2,0.4)" }}>
                {products.length} produk
              </span>
              <button onClick={() => { setEditProduct(null); setShowForm(true); window.scrollTo(0,0); }}
                style={{ background:"var(--color-chocolate)", color:"var(--color-cream)", border:"none", padding:"10px 22px", cursor:"pointer", fontFamily:"var(--font-body)", fontSize:10, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", borderRadius:2 }}>
                + Produk Baru
              </button>
            </div>

            {showForm && (
              <div style={{ background: "var(--color-cream)", border: "1px solid rgba(196,135,58,0.25)", padding: "28px 24px", marginBottom: 20 }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(61,28,2,0.4)", fontWeight: 600, marginBottom: 20 }}>
                  {editProduct ? "Edit Produk" : "Produk Baru"}
                </div>
                <ProductForm
                  initial={editProduct}
                  onSave={() => { setShowForm(false); setEditProduct(null); fetchProducts(); }}
                  onCancel={() => { setShowForm(false); setEditProduct(null); }}
                />
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }} className="prod-grid">
              {products.map(p => (
                <div key={p.id} style={{ background:"var(--color-cream)", border:"1px solid rgba(61,28,2,0.07)", padding:"16px 18px", display:"flex", gap:14, alignItems:"flex-start" }}>
                  <div style={{ width:52, height:52, flexShrink:0, overflow:"hidden", background:"var(--color-blush)" }}>
                    {p.image_url && <img src={p.image_url} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
                      <div style={{ fontFamily:"var(--font-body)", fontSize:13, fontWeight:600, color:"var(--color-chocolate)", marginBottom:3 }}>{p.name}</div>
                      <span style={{ fontFamily:"var(--font-body)", fontSize:8, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", padding:"3px 8px", borderRadius:2, flexShrink:0,
                        background: p.is_active ? "rgba(122,140,114,0.12)" : "rgba(192,57,43,0.08)",
                        color:      p.is_active ? "var(--color-sage)"        : "#c0392b" }}>
                        {p.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                    <div style={{ fontFamily:"var(--font-body)", fontSize:11, color:"var(--color-caramel)", fontWeight:600, marginBottom:3 }}>
                      Rp {Number(p.price).toLocaleString("id-ID")}
                    </div>
                    <div style={{ fontFamily:"var(--font-body)", fontSize:10, color:"rgba(61,28,2,0.35)" }}>
                      Stok: <strong style={{ color: p.stock === 0 ? "#c0392b" : "var(--color-chocolate)" }}>{p.stock}</strong>
                      {p.is_best_seller && " · Best Seller"}
                      {p.is_new        && " · Baru"}
                    </div>
                    <div style={{ display:"flex", gap:12, marginTop:10 }}>
                      {[["Edit", () => { setEditProduct(p); setShowForm(true); window.scrollTo(0,0); }], ["Hapus", () => deleteProduct(p.id)]].map(([l, fn]) => (
                        <button key={l} onClick={fn} style={{ background:"none", border:"none", cursor:"pointer", fontFamily:"var(--font-body)", fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(61,28,2,0.35)", padding:0, transition:"color 0.2s" }}
                          onMouseEnter={e => (e.currentTarget.style.color = l === "Hapus" ? "#c0392b" : "var(--color-caramel)")}
                          onMouseLeave={e => (e.currentTarget.style.color = "rgba(61,28,2,0.35)")}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .dash-grid  { grid-template-columns: 1fr !important; }
          .prod-grid  { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 500px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}