/** Home background: a drifting starfield that reacts to the mouse. */
import { random, startSky, type Options, type Scene } from './common';

const TAU = Math.PI * 2;
const STAR_COUNT = 300;
const SMALL_DEVICE_SHARE = 0.4;
const GRAVITY_RADIUS = 160;
const LINK_DISTANCE = 110;
const STILL_SECONDS = 5;
const GRAPH_SECONDS = 3;

const LAYERS = [
  { size: 0.7, alpha: 0.34, parallax: 6, drift: 1.5 },
  { size: 1.1, alpha: 0.58, parallax: 14, drift: 3 },
  { size: 1.7, alpha: 0.85, parallax: 26, drift: 5 },
];

// A nod to the DSM project: a small directed graph, ordered left to right the
// way a topological sort would lay it out. Offsets are from the cursor.
const GRAPH_NODES = [
  [-120, -40],
  [-120, 50],
  [-40, -70],
  [-30, 10],
  [50, -40],
  [60, 60],
  [130, 0],
];
const GRAPH_EDGES = [
  [0, 2],
  [0, 3],
  [1, 3],
  [2, 4],
  [3, 4],
  [3, 5],
  [4, 6],
  [5, 6],
];

interface Star {
  x: number;
  y: number;
  layer: number;
  phase: number;
  offsetX: number;
  offsetY: number;
  speedX: number;
  speedY: number;
  screenX: number;
  screenY: number;
  node: number;
}

function arrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const tipX = x2 - Math.cos(angle) * 6;
  const tipY = y2 - Math.sin(angle) * 6;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(tipX, tipY);
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(tipX - Math.cos(angle - 0.45) * 7, tipY - Math.sin(angle - 0.45) * 7);
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(tipX - Math.cos(angle + 0.45) * 7, tipY - Math.sin(angle + 0.45) * 7);
  ctx.stroke();
}

export function startConstellations(canvas: HTMLCanvasElement) {
  const build = (ctx: CanvasRenderingContext2D, options: Options): Scene => {
    let width = 0;
    let height = 0;
    const count = Math.round(STAR_COUNT * (options.small ? SMALL_DEVICE_SHARE : 1));

    const stars: Star[] = Array.from({ length: count }, (_, index) => ({
      x: Math.random(),
      y: Math.random(),
      layer: index % LAYERS.length,
      phase: random(0, TAU),
      offsetX: 0,
      offsetY: 0,
      speedX: 0,
      speedY: 0,
      screenX: 0,
      screenY: 0,
      node: -1,
    }));

    const interactive = !options.small && !options.reduced;
    const mouse = { x: -9999, y: -9999, seen: false, movedAt: 0 };
    const shift = { x: 0, y: 0 };
    const near: Star[] = [];
    const pulses: Array<{ x: number; y: number; radius: number; hit: Set<Star> }> = [];
    let shot: { x: number; y: number; vx: number; vy: number; life: number } | null = null;
    let nextShot = random(25, 45);
    let clock = 0;
    let graphStart = -1;
    let graphUsed = false;
    try {
      graphUsed = sessionStorage.getItem('graph-seen') === '1';
    } catch {
      /* Without storage the graph can simply show again. */
    }

    if (interactive) {
      window.addEventListener(
        'pointermove',
        (event) => {
          mouse.x = event.clientX;
          mouse.y = event.clientY;
          mouse.seen = true;
          mouse.movedAt = clock;
        },
        { passive: true },
      );
      window.addEventListener('pointerdown', (event) => {
        if ((event.target as Element).closest?.('a, button, summary')) return;
        pulses.push({ x: event.clientX, y: event.clientY, radius: 0, hit: new Set() });
      });
    }

    const startGraph = (time: number) => {
      graphUsed = true;
      graphStart = time;
      try {
        sessionStorage.setItem('graph-seen', '1');
      } catch {
        /* See above. */
      }
      const closest = [...stars]
        .sort(
          (a, b) =>
            Math.hypot(a.screenX - mouse.x, a.screenY - mouse.y) -
            Math.hypot(b.screenX - mouse.x, b.screenY - mouse.y),
        )
        .slice(0, GRAPH_NODES.length);
      closest.forEach((star, index) => (star.node = index));
    };

    const endGraph = () => {
      graphStart = -1;
      stars.forEach((star) => (star.node = -1));
    };

    const drawStars = (dt: number, time: number) => {
      near.length = 0;
      const anchorX = Math.min(Math.max(mouse.x, 170), width - 170);
      const anchorY = Math.min(Math.max(mouse.y, 110), height - 110);

      for (const star of stars) {
        const layer = LAYERS[star.layer];
        star.x += (layer.drift * dt) / width;
        if (star.x > 1.03) star.x = -0.03;

        const baseX = star.x * width - shift.x * layer.parallax;
        const baseY = star.y * height - shift.y * layer.parallax;
        let targetX = 0;
        let targetY = 0;
        let glow = 0;

        if (star.node >= 0) {
          targetX = anchorX + GRAPH_NODES[star.node][0] - baseX;
          targetY = anchorY + GRAPH_NODES[star.node][1] - baseY;
          glow = 0.8;
        } else if (mouse.seen) {
          const dx = mouse.x - (baseX + star.offsetX);
          const dy = mouse.y - (baseY + star.offsetY);
          const distance = Math.hypot(dx, dy);
          if (distance < GRAVITY_RADIUS && distance > 0) {
            const pull = 1 - distance / GRAVITY_RADIUS;
            targetX = (dx / distance) * pull * 24;
            targetY = (dy / distance) * pull * 24;
            glow = pull;
            near.push(star);
          }
        }

        const stiffness = star.node >= 0 ? 7 : 3;
        star.speedX += (targetX - star.offsetX) * stiffness * dt;
        star.speedY += (targetY - star.offsetY) * stiffness * dt;
        const damping = Math.exp(-5 * dt);
        star.speedX *= damping;
        star.speedY *= damping;
        star.offsetX += star.speedX * dt * 10;
        star.offsetY += star.speedY * dt * 10;

        star.screenX = baseX + star.offsetX;
        star.screenY = baseY + star.offsetY;

        const twinkle = options.reduced ? 1 : 0.88 + Math.sin(time * 1.3 + star.phase) * 0.12;
        const alpha = Math.min(1, layer.alpha * twinkle + glow * 0.5);
        ctx.fillStyle = `rgba(201,214,227,${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(star.screenX, star.screenY, layer.size + glow * 0.7, 0, TAU);
        ctx.fill();
      }
    };

    const drawLinks = () => {
      ctx.lineWidth = 0.6;
      for (let a = 0; a < near.length; a += 1) {
        for (let b = a + 1; b < near.length; b += 1) {
          const distance = Math.hypot(
            near[a].screenX - near[b].screenX,
            near[a].screenY - near[b].screenY,
          );
          if (distance > LINK_DISTANCE) continue;
          const alpha = (1 - distance / LINK_DISTANCE) * 0.42;
          ctx.strokeStyle = `rgba(63,182,217,${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(near[a].screenX, near[a].screenY);
          ctx.lineTo(near[b].screenX, near[b].screenY);
          ctx.stroke();
        }
      }
    };

    const drawGraph = (time: number) => {
      const age = time - graphStart;
      if (age > GRAPH_SECONDS) {
        endGraph();
        return;
      }
      const envelope = Math.min(age / 0.7, 1, (GRAPH_SECONDS - age) / 0.5);
      const nodes: Star[] = [];
      for (const star of stars) if (star.node >= 0) nodes[star.node] = star;
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = `rgba(63,182,217,${(envelope * 0.6).toFixed(3)})`;
      for (const [from, to] of GRAPH_EDGES) {
        arrow(ctx, nodes[from].screenX, nodes[from].screenY, nodes[to].screenX, nodes[to].screenY);
      }
    };

    const drawPulses = (dt: number) => {
      for (let index = pulses.length - 1; index >= 0; index -= 1) {
        const pulse = pulses[index];
        pulse.radius += 460 * dt;
        const strength = 1 - pulse.radius / 380;
        if (strength <= 0) {
          pulses.splice(index, 1);
          continue;
        }
        for (const star of stars) {
          if (pulse.hit.has(star)) continue;
          const dx = star.screenX - pulse.x;
          const dy = star.screenY - pulse.y;
          const distance = Math.hypot(dx, dy);
          if (distance < pulse.radius && distance > 0) {
            pulse.hit.add(star);
            star.speedX += (dx / distance) * 14 * strength;
            star.speedY += (dy / distance) * 14 * strength;
          }
        }
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(63,182,217,${(strength * 0.35).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, pulse.radius, 0, TAU);
        ctx.stroke();
      }
    };

    const drawShot = (dt: number, time: number) => {
      if (!shot && time > nextShot) {
        const fromLeft = Math.random() > 0.5;
        const speed = random(620, 820);
        shot = {
          x: fromLeft ? random(-40, width * 0.3) : random(width * 0.7, width + 40),
          y: random(-20, height * 0.35),
          vx: (fromLeft ? 1 : -1) * speed * 0.86,
          vy: speed * 0.5,
          life: 1,
        };
      }
      if (!shot) return;
      shot.x += shot.vx * dt;
      shot.y += shot.vy * dt;
      shot.life -= dt * 0.9;
      if (shot.life <= 0) {
        shot = null;
        nextShot = time + random(25, 45);
        return;
      }
      const tail = ctx.createLinearGradient(shot.x, shot.y, shot.x - shot.vx * 0.16, shot.y - shot.vy * 0.16);
      tail.addColorStop(0, `rgba(190,238,250,${(shot.life * 0.9).toFixed(3)})`);
      tail.addColorStop(1, 'rgba(63,182,217,0)');
      ctx.strokeStyle = tail;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(shot.x, shot.y);
      ctx.lineTo(shot.x - shot.vx * 0.16, shot.y - shot.vy * 0.16);
      ctx.stroke();
    };

    return {
      resize(nextWidth, nextHeight) {
        width = nextWidth;
        height = nextHeight;
      },

      frame(dt, time) {
        clock = time;
        ctx.clearRect(0, 0, width, height);

        if (mouse.seen) {
          const targetX = mouse.x / width - 0.5;
          const targetY = mouse.y / height - 0.5;
          shift.x += (targetX - shift.x) * Math.min(1, dt * 2.5);
          shift.y += (targetY - shift.y) * Math.min(1, dt * 2.5);
        }

        drawStars(dt, time);
        drawLinks();
        if (graphStart >= 0) drawGraph(time);
        drawPulses(dt);
        if (!options.reduced && !options.small) drawShot(dt, time);

        const still = mouse.seen && time - mouse.movedAt > STILL_SECONDS;
        if (still && interactive && !graphUsed && graphStart < 0) startGraph(time);
      },
    };
  };

  startSky(canvas, build);
}
