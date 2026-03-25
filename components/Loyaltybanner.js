export default function LoyaltyBanner() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <div className="bg-gradient-to-r from-chocolate to-chocolate-light rounded-3xl overflow-hidden relative">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-caramel/20 blur-2xl" />
          <div className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full bg-gold/10 blur-xl" />
        </div>

        <div className="relative px-8 py-10 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="text-caramel text-[10px] font-black tracking-[0.3em] uppercase mb-2">
              ⭐ Bakery Points Program
            </div>
            <h3 className="font-serif text-3xl font-black text-cream mb-3">
              Belanja, Kumpulkan,<br />Dapatkan Gratis!
            </h3>
            <div className="flex flex-wrap gap-4 text-sm text-cream/60">
              <span>🛒 Rp 10.000 = 1 poin</span>
              <span>🥐 50 poin = Croissant gratis</span>
              <span>🍞 100 poin = Sourdough gratis</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-center flex-shrink-0">
            <div className="bg-caramel text-white px-8 py-3 rounded-full font-black text-xs tracking-widest uppercase hover:bg-gold hover:text-chocolate transition cursor-pointer">
              Daftar Sekarang →
            </div>
            <div className="text-cream/30 text-[10px]">Gratis • Tidak ada biaya</div>
          </div>
        </div>
      </div>
    </section>
  );
}