"use client";
import { useState }      from "react";
import { useCart }       from "../../lib/CartContext";
import { supabase }      from "../../lib/supabase";
import { useRouter }     from "next/navigation";
import Link              from "next/link";

const ADMIN_WA = "6289540108751";

function genOrderId() {
  const a = Math.random().toString(36).substring(2, 7).toUpperCase();
  const b = Date.now().toString(36).slice(-4).toUpperCase();
  return `CRB-${a}-${b}`;
}

function buildWAText(orderId, items, total, form) {
  const lines = items
    .map(i => `  ${i.name} ×${i.quantity}   Rp ${(i.price * i.quantity).toLocaleString("id-ID")}`)
    .join("\n");
  return (
    `*ORDER — Crumb & Co.*\n` +
    `─────────────────────\n` +
    `Order ID : ${orderId}\n` +
    `Nama     : ${form.name}\n` +
    `WA       : ${form.phone}\n` +
    `Metode   : ${form.delivery === "delivery" ? "Delivery" : "Pick Up"}\n` +
    (form.delivery === "delivery" ? `Alamat   : ${form.address}\n` : "") +
    (form.notes ? `Catatan  : ${form.notes}\n` : "") +
    `─────────────────────\n` +
    `${lines}\n` +
    `─────────────────────\n` +
    `*Total   : Rp ${total.toLocaleString("id-ID")}*\n` +
    (form.delivery === "delivery" ? `_(+ongkir dikonfirmasi admin)_\n` : "") +
    `\nTerima kasih telah memesan di Crumb & Co.`
  );
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "", delivery: "delivery" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!items.length) return;
    setError(""); setLoading(true);

    const orderId = genOrderId();
    try {
      // 1. Insert order
      const { error: dbErr } = await supabase.from("orders").insert({
        order_id:         orderId,
        customer_name:    form.name,
        customer_phone:   form.phone,
        delivery_address: form.delivery === "delivery" ? form.address : "PICK UP",
        delivery_method:  form.delivery,
        notes:            form.notes,
        items:            items.map(i => ({ id: i.id, name: i.name, qty: i.quantity, price: i.price })),
        total_amount:     total,
        status:           "pending",
      });
      if (dbErr) throw dbErr;

      // 2. Decrement stock
      for (const item of items) {
        await supabase.rpc("decrement_stock", { product_id: item.id, qty: item.quantity });
      }

      // 3. Clear cart
      clearCart();

      // 4. Store WA text in sessionStorage so /track can read it
      const waText = buildWAText(orderId, items, total, form);
      sessionStorage.setItem("crumbco_wa_" + orderId, encodeURIComponent(waText));

      // 5. Redirect to track page with new=1 flag
      router.push(`/track?order=${orderId}&new=1`);
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan. Silakan coba lagi atau hubungi admin via WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  if (!items.length && !loading) {
    return (
      <div style={{ maxWidth: 480, margin: "120px auto", padding: "0 24px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, fontStyle: "italic", color: "rgba(61,28,2,0.3)", marginBottom: 16 }}>
          Keranjang masih kosong
        </h1>
        <Link href="/products" style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-chocolate)", textDecoration: "none", borderBottom: "1px solid var(--color-chocolate)", paddingBottom: 2 }}>
          Lihat Menu
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px 120px" }}>
      {/* Header */}
      <div style={{ marginBottom: 56 }}>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--color-caramel)", fontWeight: 600, marginBottom: 12 }}>
          Checkout
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 900, color: "var(--color-chocolate)", letterSpacing: "-0.03em" }}>
          Detail Pesanan
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 48, alignItems: "start" }} className="checkout-grid">
        {/* ── LEFT: FORM ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>

          {/* Section: Info */}
          <FormSection title="Informasi Pemesan">
            <Field label="Nama Lengkap" type="text" value={form.name} onChange={v => set("name", v)} placeholder="Nama kamu" required />
            <Field label="Nomor WhatsApp" type="tel" value={form.phone} onChange={v => set("phone", v)} placeholder="08xxxxxxxxxx" required />
          </FormSection>

          {/* Section: Delivery */}
          <FormSection title="Metode Pengiriman">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { v: "delivery", label: "Delivery",   sub: "Antar ke alamat" },
                { v: "pickup",   label: "Pick Up",    sub: "Ambil di toko" },
              ].map(opt => (
                <label
                  key={opt.v}
                  style={{
                    display: "flex", flexDirection: "column", gap: 4, padding: "16px 18px",
                    border: `1.5px solid ${form.delivery === opt.v ? "var(--color-chocolate)" : "rgba(61,28,2,0.1)"}`,
                    cursor: "pointer", transition: "border-color 0.2s", borderRadius: 2,
                    background: form.delivery === opt.v ? "rgba(61,28,2,0.03)" : "none",
                  }}
                >
                  <input type="radio" name="delivery" value={opt.v}
                    checked={form.delivery === opt.v} onChange={e => set("delivery", e.target.value)}
                    style={{ display: "none" }}
                  />
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, color: "var(--color-chocolate)", letterSpacing: "0.06em" }}>{opt.label}</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "rgba(61,28,2,0.4)" }}>{opt.sub}</span>
                </label>
              ))}
            </div>

            {form.delivery === "delivery" && (
              <Field label="Alamat Lengkap" type="textarea" value={form.address} onChange={v => set("address", v)}
                placeholder="Jl. Contoh No. 1, Kelurahan, Kecamatan, Jakarta…" required />
            )}
          </FormSection>

          {/* Section: Notes */}
          <FormSection title="Catatan (Opsional)">
            <Field label="" type="text" value={form.notes} onChange={v => set("notes", v)} placeholder="Tanpa gula, tambah topping, dll…" />
          </FormSection>

          {error && (
            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#c0392b", background: "rgba(192,57,43,0.06)", padding: "12px 16px", borderLeft: "2px solid #c0392b", marginTop: 8 }}>
              {error}
            </div>
          )}
        </div>

        {/* ── RIGHT: SUMMARY ── */}
        <div style={{ position: "sticky", top: 100 }}>
          <div style={{ border: "1px solid rgba(61,28,2,0.08)", padding: "28px 28px 32px" }}>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(61,28,2,0.4)", marginBottom: 20 }}>
              Ringkasan Pesanan
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
              {items.map(i => (
                <div key={i.id} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500, color: "var(--color-chocolate)" }}>
                      {i.name}
                    </div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "rgba(61,28,2,0.4)" }}>
                      ×{i.quantity}
                    </div>
                  </div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: "var(--color-chocolate)", flexShrink: 0 }}>
                    Rp {(i.price * i.quantity).toLocaleString("id-ID")}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid rgba(61,28,2,0.08)", paddingTop: 16, marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(61,28,2,0.4)" }}>Total</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 900, color: "var(--color-chocolate)", letterSpacing: "-0.02em" }}>
                Rp {total.toLocaleString("id-ID")}
              </span>
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "rgba(61,28,2,0.3)", marginBottom: 20 }}>
              Ongkir akan dikonfirmasi oleh admin
            </p>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", background: loading ? "rgba(61,28,2,0.3)" : "var(--color-chocolate)",
                color: "var(--color-cream)", border: "none", padding: "15px 0",
                fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700,
                letterSpacing: "0.18em", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s", borderRadius: 2,
              }}
            >
              {loading ? "Memproses…" : "Konfirmasi & Lanjut"}
            </button>

            <p style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "rgba(61,28,2,0.3)", textAlign: "center", marginTop: 12, lineHeight: 1.6 }}>
              Pesanan tersimpan ke sistem. Kamu akan diarahkan ke WhatsApp untuk konfirmasi pembayaran.
            </p>
          </div>
        </div>
      </form>

      <style>{`
        @media (max-width: 768px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

/* ── Form helpers ──────────────────────────────── */
function FormSection({ title, children }) {
  return (
    <div style={{ borderBottom: "1px solid rgba(61,28,2,0.07)", paddingBottom: 28, marginBottom: 28 }}>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(61,28,2,0.4)", fontWeight: 600, marginBottom: 18 }}>
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, type, value, onChange, placeholder, required }) {
  const shared = {
    fontFamily: "var(--font-body)", fontSize: 13, color: "var(--color-chocolate)",
    background: "none", border: "1px solid rgba(61,28,2,0.12)", padding: "11px 14px",
    outline: "none", width: "100%", borderRadius: 2,
    transition: "border-color 0.2s",
  };
  return (
    <div>
      {label && (
        <div style={{ fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(61,28,2,0.4)", fontWeight: 600, marginBottom: 7 }}>
          {label}
        </div>
      )}
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          rows={3}
          style={{ ...shared, resize: "vertical" }}
          onFocus={e => (e.target.style.borderColor = "var(--color-caramel)")}
          onBlur={e => (e.target.style.borderColor = "rgba(61,28,2,0.12)")}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          style={shared}
          onFocus={e => (e.target.style.borderColor = "var(--color-caramel)")}
          onBlur={e => (e.target.style.borderColor = "rgba(61,28,2,0.12)")}
        />
      )}
    </div>
  );
}