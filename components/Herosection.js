"use client";
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-cream min-h-[85vh] flex items-center">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-caramel/8 blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-blush/60 blur-2xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/4 blur-3xl" />
        {/* Decorative text */}
        <div
          className="absolute -bottom-8 right-0 text-[180px] font-serif font-black text-chocolate/4 select-none leading-none"
          aria-hidden
        >
          CRUMB
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Text */}
        <div>
          <div className="inline-flex items-center gap-2 bg-caramel/10 border border-caramel/20 rounded-full px-4 py-1.5 text-[10px] font-black tracking-[0.25em] text-caramel uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-caramel animate-pulse" />
            Artisan Bakery Jakarta
          </div>

          <h1 className="font-serif text-6xl md:text-7xl font-black text-chocolate leading-[0.9] tracking-tight mb-6">
            Rasa yang<br />
            <span className="italic text-caramel">Menghangatkan</span>
            <br />Setiap Hari
          </h1>

          <p className="text-chocolate/50 text-lg leading-relaxed mb-10 max-w-md">
            Roti artisan premium dari bahan organik lokal. Dipanggang segar setiap hari, diantar langsung ke pintu rumahmu.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/products"
              className="bg-chocolate text-cream px-8 py-4 rounded-full font-black text-sm tracking-widest uppercase hover:bg-caramel transition shadow-xl shadow-chocolate/20"
            >
              Pesan Sekarang →
            </Link>
            <Link
              href="/track"
              className="border border-chocolate/20 text-chocolate/70 px-8 py-4 rounded-full font-black text-sm tracking-widest uppercase hover:border-caramel hover:text-caramel transition"
            >
              Lacak Pesanan
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-6 mt-12 flex-wrap">
            {['🌾 Organik', '🔥 Fresh Daily', '♻️ Eco Pack', '⭐ 4.9/5'].map(b => (
              <span key={b} className="text-xs text-chocolate/40 font-semibold">{b}</span>
            ))}
          </div>
        </div>

        {/* Visual collage */}
        <div className="relative hidden lg:block">
          <div className="relative w-full aspect-square max-w-md mx-auto">
            {/* Main circle */}
            <div className="absolute inset-8 rounded-full bg-blush overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80"
                alt="Artisan bread"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating cards */}
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-caramel flex items-center justify-center text-white text-sm">🥐</div>
              <div>
                <div className="font-black text-xs text-chocolate">Fresh Croissant</div>
                <div className="text-[9px] text-caramel">Ready in 2h</div>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-chocolate text-cream rounded-2xl shadow-xl p-3">
              <div className="font-black text-sm">⭐ 4.9/5</div>
              <div className="text-[9px] text-cream/50 mt-0.5">500+ Review</div>
            </div>
            <div className="absolute top-1/2 -right-8 bg-white rounded-2xl shadow-xl p-3">
              <div className="text-lg">🌾</div>
              <div className="font-black text-[9px] text-chocolate mt-1">100% Organik</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}