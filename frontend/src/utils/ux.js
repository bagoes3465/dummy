// Small UX helpers: click sound and ripple effect
export function playClickSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = 880; // high-pitched click
    g.gain.value = 0.0001;
    o.connect(g);
    g.connect(ctx.destination);
    const now = ctx.currentTime;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.08, now + 0.001);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    o.start(now);
    o.stop(now + 0.09);
    // close context after short delay to release resources
    setTimeout(() => {
      try { ctx.close(); } catch (e) {}
    }, 200);
  } catch (e) {
    // ignore audio errors
  }
}

export function createRipple(event) {
  const el = event.currentTarget || event.target;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const ripple = document.createElement('span');
  const size = Math.max(rect.width, rect.height) * 1.2;
  ripple.className = 'pb-ripple';
  ripple.style.width = ripple.style.height = `${size}px`;
  const left = event.clientX - rect.left - size / 2;
  const top = event.clientY - rect.top - size / 2;
  ripple.style.left = `${left}px`;
  ripple.style.top = `${top}px`;
  el.appendChild(ripple);
  setTimeout(() => {
    ripple.remove();
  }, 650);
}
