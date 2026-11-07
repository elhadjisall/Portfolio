/** Shared canvas plumbing: one animation loop for every background on the site. */

export interface Options {
  /** prefers-reduced-motion: draw one frame and stop. */
  reduced: boolean;
  /** Phones and touch devices: fewer stars and no mouse effects. */
  small: boolean;
}

export interface Scene {
  resize(width: number, height: number): void;
  /** `dt` and `time` are in seconds. */
  frame(dt: number, time: number): void;
}

const MAX_DPR = 2;
const EIGHT_BIT_SCALE = 0.5;

/** Rendering below 1:1 is what makes the sky chunky in the 8-bit theme. */
export const renderScale = () =>
  document.documentElement.classList.contains('eight-bit')
    ? EIGHT_BIT_SCALE
    : Math.min(window.devicePixelRatio || 1, MAX_DPR);
const MAX_STEP = 0.05;
const START_DELAY_MS = 1800;

export function skyOptions(): Options {
  return {
    reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    small: window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches,
  };
}

export function startSky(
  canvas: HTMLCanvasElement,
  build: (ctx: CanvasRenderingContext2D, options: Options) => Scene,
) {
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return null;

  const options = skyOptions();
  const scene = build(ctx, options);
  let last = 0;
  let time = 0;
  let handle = 0;

  const fit = () => {
    const dpr = renderScale();
    const { innerWidth: width, innerHeight: height } = window;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    scene.resize(width, height);
  };

  const redraw = () => scene.frame(0, time);

  const tick = (now: number) => {
    const dt = last ? Math.min((now - last) / 1000, MAX_STEP) : 0;
    last = now;
    time += dt;
    scene.frame(dt, time);
    handle = requestAnimationFrame(tick);
  };

  const play = () => {
    if (options.reduced || handle) return;
    last = 0;
    handle = requestAnimationFrame(tick);
  };

  const pause = () => {
    cancelAnimationFrame(handle);
    handle = 0;
  };

  fit();
  const refit = () => {
    fit();
    if (options.reduced) redraw();
  };
  window.addEventListener('resize', refit);
  window.addEventListener('sitetheme', refit);
  document.addEventListener('visibilitychange', () => (document.hidden ? pause() : play()));

  // One still frame now, and motion a moment later, so the animation doesn't
  // compete with the page while it loads.
  redraw();
  window.setTimeout(() => {
    if (!document.hidden) play();
  }, START_DELAY_MS);
  return { options, redraw };
}

export const random = (low: number, high: number) => low + Math.random() * (high - low);
