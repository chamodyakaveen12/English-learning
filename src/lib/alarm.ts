/**
 * Browser-only alarm sound. Generated with the Web Audio API so no audio
 * asset is needed. Call startAlarm() from an event handler or effect only.
 */

type AudioCtor = typeof AudioContext;

let ctx: AudioContext | null = null;
let timer: ReturnType<typeof setInterval> | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor: AudioCtor | undefined =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioCtor }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  return ctx;
}

function beep(at: number, freq: number, duration: number) {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(freq, at);
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(0.25, at + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
  osc.connect(gain).connect(c.destination);
  osc.start(at);
  osc.stop(at + duration + 0.05);
}

/** Two-tone ring, repeated until stopAlarm() is called. */
export function startAlarm() {
  const c = getCtx();
  if (!c) return;
  void c.resume();
  stopAlarm();
  const ring = () => {
    const t = c.currentTime;
    for (let i = 0; i < 3; i++) {
      beep(t + i * 0.36, 880, 0.16);
      beep(t + i * 0.36 + 0.18, 660, 0.16);
    }
  };
  ring();
  timer = setInterval(ring, 1600);
}

export function stopAlarm() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

/** Fires a desktop notification if the user has granted permission. */
export function notify(title: string, body: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission === "granted") {
    try {
      new Notification(title, { body });
    } catch {
      /* ignore */
    }
  }
}

export function requestNotifyPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission === "default") void Notification.requestPermission();
}
