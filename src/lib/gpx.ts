import fs from 'node:fs';

export interface ProfilePoint {
  km: number;
  elevation: number;
}

const POINTS_TO_KEEP = 240;

function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const a =
    Math.sin(toRadians(lat2 - lat1) / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(toRadians(lon2 - lon1) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

/** Reads a real GPX track. With no file, this returns nothing and no chart is drawn. */
export function readProfile(path: string): ProfilePoint[] {
  if (!fs.existsSync(path)) return [];

  const track = [...fs.readFileSync(path, 'utf8').matchAll(/<trkpt[^>]*lat="([-\d.]+)"[^>]*lon="([-\d.]+)"[^>]*>\s*<ele>([-\d.]+)<\/ele>/g)].map(
    ([, lat, lon, elevation]) => ({ lat: Number(lat), lon: Number(lon), elevation: Number(elevation) }),
  );
  if (track.length < 2) return [];

  let km = 0;
  const points = track.map((point, index) => {
    if (index > 0) km += distanceKm(track[index - 1].lat, track[index - 1].lon, point.lat, point.lon);
    return { km, elevation: point.elevation };
  });

  const step = Math.max(1, Math.floor(points.length / POINTS_TO_KEEP));
  return points.filter((_, index) => index % step === 0 || index === points.length - 1);
}
