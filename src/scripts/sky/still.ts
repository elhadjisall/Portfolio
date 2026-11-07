/** Case studies and the 404 page: one dim frame of stars, with no animation. */
import { renderScale } from './common';

export function drawStill(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // The same stars on every redraw, so resizing doesn't reshuffle them.
  const stars = Array.from({ length: 140 }, (_, index) => ({
    x: ((index * 7919) % 1000) / 1000,
    y: ((index * 6271) % 1000) / 1000,
    size: 0.5 + (index % 3) * 0.3,
    alpha: 0.1 + (index % 5) * 0.05,
  }));

  const draw = () => {
    const dpr = renderScale();
    const { innerWidth: width, innerHeight: height } = window;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (const star of stars) {
      ctx.fillStyle = `rgba(201,214,227,${star.alpha})`;
      ctx.beginPath();
      ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  draw();
  window.addEventListener('resize', draw);
  window.addEventListener('sitetheme', draw);
}
