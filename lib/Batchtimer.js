export const BATCH_HOURS = [7, 10, 13, 16, 19];

/** Returns next batch info relative to current WIB time */
export function getNextBatch() {
  const now      = new Date();
  const utcMs    = now.getTime() + now.getTimezoneOffset() * 60_000;
  const wib      = new Date(utcMs + 7 * 3_600_000); // UTC+7
  const wibH     = wib.getHours();
  const wibM     = wib.getMinutes();
  const wibS     = wib.getSeconds();
  const wibTotal = wibH * 3600 + wibM * 60 + wibS;

  for (const h of BATCH_HOURS) {
    const batchTotal = h * 3600;
    if (batchTotal > wibTotal) {
      const diff = batchTotal - wibTotal;
      return {
        hour:    h,
        label:   `${String(h).padStart(2, "0")}:00`,
        seconds: diff,
        hours:   Math.floor(diff / 3600),
        minutes: Math.floor((diff % 3600) / 60),
        secs:    diff % 60,
        urgent:  diff < 30 * 60,
      };
    }
  }
  // Next is tomorrow 07:00
  const secUntilMidnight = 86400 - wibTotal;
  const diff = secUntilMidnight + 7 * 3600;
  return {
    hour:    7,
    label:   "07:00",
    seconds: diff,
    hours:   Math.floor(diff / 3600),
    minutes: Math.floor((diff % 3600) / 60),
    secs:    diff % 60,
    urgent:  false,
  };
}

export function pad(n) {
  return String(n).padStart(2, "0");
}