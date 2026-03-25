"use client";
import { useState, useEffect } from 'react';
import { getNextBatch, formatCountdown } from '../lib/Batchtimer';

export default function BatchTimerBadge() {
  const [batch, setBatch] = useState(null);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    function update() {
      const b = getNextBatch();
      setBatch(b);
      setSeconds(prev => {
        if (prev <= 0) return 59;
        return prev - 1;
      });
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!batch) return null;

  const isUrgent = batch.diffMinutes <= 30;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black tracking-wider uppercase ${
      isUrgent
        ? 'bg-caramel/10 border-caramel text-caramel animate-pulse'
        : 'bg-blush/60 border-chocolate/10 text-chocolate/60'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isUrgent ? 'bg-caramel' : 'bg-chocolate/30'}`} />
      <span>
        {isUrgent ? '🔥 ' : '⏱️ '}
        Batch {batch.label} — {formatCountdown(batch.hours, batch.minutes, seconds)}
      </span>
    </div>
  );
}
