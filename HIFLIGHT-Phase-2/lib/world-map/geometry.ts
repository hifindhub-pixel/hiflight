export const MOROCCO_UNIFIED_GLOBE_RING: Array<[number, number]> = [
  [-17.092, 20.878], [-16.964, 21.33], [-13.016, 21.333], [-13.153, 22.821],
  [-12.616, 23.275], [-12.023, 23.469], [-12.016, 25.994], [-8.683, 25.995],
  [-8.684, 27.655], [-8.746, 27.656], [-8.748, 27.679], [-8.654, 28.723],
  [-7.16, 29.612], [-6.636, 29.57], [-6.473, 29.822], [-5.45, 29.957],
  [-4.965, 30.469], [-3.672, 30.96], [-3.625, 31.065], [-3.83, 31.197],
  [-3.761, 31.693], [-3.025, 31.831], [-2.858, 32.077], [-1.229, 32.109],
  [-1.238, 32.338], [-1.065, 32.47], [-1.451, 32.786], [-1.681, 33.32],
  [-1.794, 34.749], [-2.217, 35.103], [-2.426, 35.125], [-2.837, 35.128],
  [-2.971, 35.406], [-3.389, 35.214], [-4.628, 35.206], [-5.253, 35.614],
  [-5.28, 35.903], [-5.924, 35.786], [-6.355, 34.771], [-6.898, 33.969],
  [-8.509, 33.254], [-9.247, 32.573], [-9.346, 32.086], [-9.81, 31.417],
  [-9.878, 30.717], [-9.655, 30.45], [-9.669, 30.108], [-10.193, 29.39],
  [-11.547, 28.314], [-12.946, 27.916], [-13.178, 27.655], [-13.574, 26.741],
  [-14.413, 26.253], [-14.796, 25.403], [-14.905, 24.721], [-15.9, 23.846],
  [-15.98, 23.673], [-15.787, 23.792], [-16.212, 23.092], [-16.361, 22.594],
  [-16.927, 21.904], [-17.092, 20.878],
];

function pointDistanceSquared(
  point: [number, number],
  start: [number, number],
  end: [number, number],
) {
  let x = start[0];
  let y = start[1];
  let dx = end[0] - x;
  let dy = end[1] - y;
  if (dx || dy) {
    const amount = Math.max(0, Math.min(1, ((point[0] - x) * dx + (point[1] - y) * dy) / (dx * dx + dy * dy)));
    x += dx * amount;
    y += dy * amount;
  }
  dx = point[0] - x;
  dy = point[1] - y;
  return dx * dx + dy * dy;
}

export function thinRing(ring: Array<[number, number]>, toleranceScale = 3) {
  if (ring.length <= 10) return ring;
  const source = ring.slice(0, -1);
  const xs = source.map((point) => point[0]);
  const ys = source.map((point) => point[1]);
  const span = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
  const tolerance = (span < 2 ? 0.004 : span < 7 ? 0.025 : span < 18 ? 0.075 : 0.16) * toleranceScale;
  const threshold = tolerance * tolerance;
  const keep = new Uint8Array(source.length);
  keep[0] = 1;
  keep[source.length - 1] = 1;
  const stack: Array<[number, number]> = [[0, source.length - 1]];
  while (stack.length) {
    const [first, last] = stack.pop()!;
    let maximum = threshold;
    let selected = -1;
    for (let index = first + 1; index < last; index += 1) {
      const distance = pointDistanceSquared(source[index], source[first], source[last]);
      if (distance > maximum) {
        maximum = distance;
        selected = index;
      }
    }
    if (selected > 0) {
      keep[selected] = 1;
      stack.push([first, selected], [selected, last]);
    }
  }
  const simplified = source.filter((_, index) => keep[index]);
  if (simplified.length < 3) return ring;
  simplified.push(simplified[0]);
  return simplified;
}

