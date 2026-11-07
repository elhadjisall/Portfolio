/** Projects background: a planet, faint orbits and comets that retry. */
import { random, startSky } from './common';

const TAU = Math.PI * 2;
const FLIGHT_SECONDS = 2.4;
const FAIL_CHANCE = [0.5, 0.4, 0.3];
const LOG_LINES = 3;

interface Comet {
  id: string;
  attempt: number;
  progress: number;
  failAt: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  state: 'flying' | 'fading' | 'waiting';
  fade: number;
  wakeAt: number;
  backoff: number;
}

export function startOrbit(canvas: HTMLCanvasElement) {
  const logElement = document.querySelector<HTMLElement>('[data-orbit-log]');
  const lines: string[] = [];

  const log = (line: string) => {
    lines.push(line);
    if (lines.length > LOG_LINES) lines.shift();
    if (logElement) logElement.textContent = lines.join('\n');
  };

  startSky(canvas, (ctx, options) => {
    let width = 0;
    let height = 0;
    let planet = { x: 0, y: 0, radius: 0 };
    let scrollBoost = 0;
    let serial = 0;
    let nextLaunch = 1;
    const tilt = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const comets: Comet[] = [];
    const flashes: Array<{ x: number; y: number; life: number }> = [];
    const backdrop = Array.from({ length: options.small ? 50 : 110 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: random(0.5, 1.2),
      alpha: random(0.12, 0.42),
    }));
    const satellites = Array.from({ length: options.small ? 3 : 6 }, (_, index) => ({
      orbit: index % 3,
      phase: random(0, TAU),
      speed: random(0.1, 0.22) * (index % 2 ? 1 : -1),
    }));

    if (!options.small && !options.reduced) {
      window.addEventListener(
        'pointermove',
        (event) => {
          tilt.targetX = event.clientX / window.innerWidth - 0.5;
          tilt.targetY = event.clientY / window.innerHeight - 0.5;
        },
        { passive: true },
      );
    }
    if (!options.reduced) {
      window.addEventListener('scroll', () => (scrollBoost = 1), { passive: true });
    }

    const aim = (comet: Comet) => {
      const angle = Math.PI + random(-0.55, 0.55);
      comet.startX = -30;
      comet.startY = random(height * 0.15, height * 0.85);
      comet.endX = planet.x + Math.cos(angle) * planet.radius;
      comet.endY = planet.y + Math.sin(angle) * planet.radius;
      comet.progress = 0;
      comet.state = 'flying';
      comet.fade = 1;
      const chance = FAIL_CHANCE[comet.attempt - 1] ?? 0;
      comet.failAt = Math.random() < chance ? random(0.35, 0.75) : 2;
    };

    const launch = () => {
      serial += 1;
      const comet: Comet = {
        id: `comet-${String(serial).padStart(2, '0')}`,
        attempt: 1,
        progress: 0,
        failAt: 2,
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
        state: 'flying',
        fade: 1,
        wakeAt: 0,
        backoff: 0,
      };
      aim(comet);
      comets.push(comet);
    };

    const position = (comet: Comet, progress: number) => ({
      x: comet.startX + (comet.endX - comet.startX) * progress,
      y: comet.startY + (comet.endY - comet.startY) * progress + Math.sin(progress * Math.PI) * -36,
    });

    return {
      resize(nextWidth, nextHeight) {
        width = nextWidth;
        height = nextHeight;
        const radius = Math.min(width, height) * (options.small ? 0.42 : 0.56);
        planet = { x: width + radius * 0.34, y: height * 0.46, radius };
      },

      frame(dt, time) {
        ctx.clearRect(0, 0, width, height);
        scrollBoost = Math.max(0, scrollBoost - dt * 1.5);
        const step = dt * (1 + scrollBoost * 1.6);
        tilt.x += (tilt.targetX - tilt.x) * Math.min(1, dt * 2);
        tilt.y += (tilt.targetY - tilt.y) * Math.min(1, dt * 2);

        for (const star of backdrop) {
          ctx.fillStyle = `rgba(201,214,227,${star.alpha})`;
          ctx.fillRect(star.x * width, star.y * height, star.size, star.size);
        }

        const body = ctx.createRadialGradient(
          planet.x - planet.radius * 0.45,
          planet.y - planet.radius * 0.2,
          planet.radius * 0.1,
          planet.x,
          planet.y,
          planet.radius,
        );
        body.addColorStop(0, 'rgba(38,66,84,0.62)');
        body.addColorStop(1, 'rgba(9,14,21,0.92)');
        ctx.fillStyle = body;
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.radius, 0, TAU);
        ctx.fill();
        ctx.strokeStyle = 'rgba(63,182,217,0.22)';
        ctx.lineWidth = 1;
        ctx.stroke();

        const rotation = -0.34 + tilt.x * 0.1;
        const squash = 0.34 + tilt.y * 0.12;
        const sizes = [1.32, 1.68, 2.08].map((scale) => scale * planet.radius);

        ctx.strokeStyle = 'rgba(201,214,227,0.09)';
        for (const size of sizes) {
          ctx.beginPath();
          ctx.ellipse(planet.x, planet.y, size, size * squash, rotation, 0, TAU);
          ctx.stroke();
        }

        ctx.fillStyle = 'rgba(201,214,227,0.72)';
        for (const satellite of satellites) {
          satellite.phase += satellite.speed * step;
          const size = sizes[satellite.orbit];
          const px = Math.cos(satellite.phase) * size;
          const py = Math.sin(satellite.phase) * size * squash;
          ctx.beginPath();
          ctx.arc(
            planet.x + px * Math.cos(rotation) - py * Math.sin(rotation),
            planet.y + px * Math.sin(rotation) + py * Math.cos(rotation),
            1.5,
            0,
            TAU,
          );
          ctx.fill();
        }

        if (options.reduced) return;

        // A nod to the retry and exponential backoff work on the Call of Duty
        // login flow: some attempts fail, wait 0.5s, 1s, 2s or 4s with jitter,
        // and try again until they get through.
        if (time > nextLaunch && comets.length < 4) {
          launch();
          nextLaunch = time + random(3, 5);
        }

        for (let index = comets.length - 1; index >= 0; index -= 1) {
          const comet = comets[index];

          if (comet.state === 'waiting') {
            if (time > comet.wakeAt) {
              comet.attempt += 1;
              aim(comet);
            }
            continue;
          }

          if (comet.state === 'flying') {
            comet.progress += step / FLIGHT_SECONDS;
            if (comet.progress >= comet.failAt) {
              comet.state = 'fading';
              comet.backoff = 0.5 * 2 ** (comet.attempt - 1) * random(1, 1.2);
              log(`${comet.id} · attempt ${comet.attempt} · backoff ${comet.backoff.toFixed(1)}s · retry`);
            } else if (comet.progress >= 1) {
              const { x, y } = position(comet, 1);
              flashes.push({ x, y, life: 1 });
              const waited = comet.backoff ? ` · backoff ${comet.backoff.toFixed(1)}s` : '';
              log(`${comet.id} · attempt ${comet.attempt}${waited} · ok`);
              comets.splice(index, 1);
              continue;
            }
          } else {
            comet.fade -= dt * 2.2;
            if (comet.fade <= 0) {
              comet.state = 'waiting';
              comet.wakeAt = time + comet.backoff;
              continue;
            }
          }

          const head = position(comet, comet.progress);
          const tail = position(comet, Math.max(0, comet.progress - 0.07));
          const gradient = ctx.createLinearGradient(head.x, head.y, tail.x, tail.y);
          gradient.addColorStop(0, `rgba(190,238,250,${(comet.fade * 0.85).toFixed(3)})`);
          gradient.addColorStop(1, 'rgba(63,182,217,0)');
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(head.x, head.y);
          ctx.lineTo(tail.x, tail.y);
          ctx.stroke();
        }

        for (let index = flashes.length - 1; index >= 0; index -= 1) {
          const flash = flashes[index];
          flash.life -= dt * 1.6;
          if (flash.life <= 0) {
            flashes.splice(index, 1);
            continue;
          }
          ctx.strokeStyle = `rgba(63,182,217,${(flash.life * 0.7).toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(flash.x, flash.y, (1 - flash.life) * 22 + 2, 0, TAU);
          ctx.stroke();
        }
      },
    };
  });
}
