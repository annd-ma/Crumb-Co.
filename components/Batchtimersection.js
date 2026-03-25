"use client";
import { useState, useEffect } from 'react';
import { getNextBatch, formatCountdown, BATCH_TIMES } from '../lib/Batchtimer';

export default function BatchTimerSection() {
  const [batch, setBatch] = useState(null);
  const [sec, setSec] = useState(59);

  useEffect(() => {
    function tick() {
      setBatch(getNextBatch());
      setSec(s => (s <= 0 ? 59 : s - 1));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!batch) return null;

  return (
    <section className="bg-blush/50 border-y border-chocolate/10 py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Timer */}
          <div className="text-center md:text-left">
            <div className="text-[10px] font-black tracking-[0.3em] text-caramel uppercase mb-1">
              🔥 Batch Panggang Berikutnya
            </div>
            <div className="font-serif text-3xl font-black text-chocolate">
              {formatCountdown(batch.hours, batch.minutes, sec)}
            </div>
            <div className="text-xs text-chocolate/40 mt-1">hingga batch {batch.label}</div>
          </div>

          {/* Schedule */}
          <div className="flex gap-3 flex-wrap justify-center">
            {BATCH_TIMES.map(h => {
              const isNext = h === batch.hour;
              const label = `${String(h).padStart(2, '0')}:00`;
              return (
                <div
                  key={h}
                  className={`px-4 py-2 rounded-xl border text-center min-w-[72px] ${
                    isNext
                      ? 'bg-caramel border-caramel text-white'
                      : 'bg-white/60 border-chocolate/10 text-chocolate/40'
                  }`}
                >
                  <div className="font-black text-sm">{label}</div>
                  <div className="text-[9px] tracking-widest font-semibold mt-0.5">WIB</div>
                  {isNext && <div className="text-[8px] font-black mt-0.5 tracking-wider">NEXT ↑</div>}
                </div>
              );
            })}
          </div>

          <div className="text-center md:text-right">
            <p className="text-xs text-chocolate/40 leading-relaxed max-w-[200px]">
              Pesan sebelum countdown habis untuk batch ini
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
