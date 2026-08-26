"use client";

import { useEffect, useRef } from "react";
import { GLOBE_COUNTRIES } from "@/lib/world-map/globeCountries";
import { VECTOR_FLAGS } from "@/lib/world-map/vectorFlags";
import { FLAG_COLORS } from "@/lib/world-map/flagColors";
import styles from "./WorldMapExperience.module.css";

export type GlobeMode = "visited" | "wishlist";
export type GlobeStateMap = Record<string, { visited?: boolean; wishlist?: boolean }>;

type Props = {
  states: GlobeStateMap;
  mode: GlobeMode;
  onCountryPress: (code: string) => void;
};

type PreparedRing = {
  count: number;
  points: Array<[number, number, number, number]>;
  screen: Float32Array;
};

type PreparedCountry = {
  code: string;
  userCode: string;
  code2: string | null;
  centerPoint: [number, number, number, number];
  drawRings: PreparedRing[];
  fastRings: PreparedRing[];
  hitX: number;
  hitY: number;
  hitDepth: number;
  touchRadius: number;
};

type CountryHit = {
  code: string;
  depth: number;
  paths: Path2D[];
  hitX: number;
  hitY: number;
  hitDepth: number;
  touchRadius: number;
};

const RAD = Math.PI / 180;
const HIDDEN_FLAG_CODE2 = new Set(["IL"]);
const MOROCCO_UNIFIED_GLOBE_RING: Array<[number, number]> = [
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

function thinRing(ring: Array<[number, number]>, toleranceScale = 3) {
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

function makePoint(point: [number, number]): [number, number, number, number] {
  const longitude = point[0] * RAD;
  const latitude = point[1] * RAD;
  return [Math.sin(latitude), Math.cos(latitude), Math.sin(longitude), Math.cos(longitude)];
}

const PREPARED_COUNTRIES: PreparedCountry[] = GLOBE_COUNTRIES
  .filter((country) => country.code !== "ESH")
  .map((country) => {
    const sourceRings = country.code === "MAR" ? [MOROCCO_UNIFIED_GLOBE_RING] : country.rings;
    const prepareRings = (toleranceScale: number) => sourceRings.map((ring) => thinRing(ring, toleranceScale)).map((ring) => {
      const count = Math.max(0, ring.length - 1);
      return { count, points: ring.slice(0, count).map(makePoint), screen: new Float32Array(count * 3) };
    });
    return {
      code: country.code,
      userCode: country.code,
      code2: country.code2,
      centerPoint: makePoint(country.center),
      drawRings: prepareRings(3),
      fastRings: prepareRings(8),
      hitX: -1000,
      hitY: -1000,
      hitDepth: -1,
      touchRadius: 0,
    };
  });

function flagIsVisible(code2: string | null) {
  return Boolean(code2 && !HIDDEN_FLAG_CODE2.has(code2.toUpperCase()));
}

function updateBounds(bounds: [number, number, number, number], x: number, y: number) {
  if (x < bounds[0]) bounds[0] = x;
  if (y < bounds[1]) bounds[1] = y;
  if (x > bounds[2]) bounds[2] = x;
  if (y > bounds[3]) bounds[3] = y;
}

function appendVisibleRing(ring: PreparedRing) {
  const path = new Path2D();
  const bounds: [number, number, number, number] = [Infinity, Infinity, -Infinity, -Infinity];
  const { count, screen } = ring;
  if (count < 3) return null;
  let frontCount = 0;
  let firstBehind = -1;
  for (let index = 0; index < count; index += 1) {
    if (screen[index * 3 + 2] >= 0) frontCount += 1;
    else if (firstBehind < 0) firstBehind = index;
  }
  if (!frontCount) return null;
  if (frontCount === count) {
    path.moveTo(screen[0], screen[1]);
    updateBounds(bounds, screen[0], screen[1]);
    for (let index = 1; index < count; index += 1) {
      const offset = index * 3;
      path.lineTo(screen[offset], screen[offset + 1]);
      updateBounds(bounds, screen[offset], screen[offset + 1]);
    }
    path.closePath();
    return { path, bounds };
  }
  let open = false;
  let drew = false;
  for (let step = 0; step < count; step += 1) {
    const currentIndex = (firstBehind + step) % count;
    const nextIndex = (currentIndex + 1) % count;
    const currentOffset = currentIndex * 3;
    const nextOffset = nextIndex * 3;
    const x1 = screen[currentOffset];
    const y1 = screen[currentOffset + 1];
    const depth1 = screen[currentOffset + 2];
    const x2 = screen[nextOffset];
    const y2 = screen[nextOffset + 1];
    const depth2 = screen[nextOffset + 2];
    const currentFront = depth1 >= 0;
    const nextFront = depth2 >= 0;
    const horizon = () => {
      const amount = depth1 / (depth1 - depth2 || 1);
      return [x1 + (x2 - x1) * amount, y1 + (y2 - y1) * amount] as const;
    };
    if (!currentFront && nextFront) {
      const entry = horizon();
      path.moveTo(entry[0], entry[1]);
      path.lineTo(x2, y2);
      updateBounds(bounds, entry[0], entry[1]);
      updateBounds(bounds, x2, y2);
      open = true;
      drew = true;
    } else if (currentFront && nextFront) {
      if (!open) {
        path.moveTo(x1, y1);
        updateBounds(bounds, x1, y1);
        open = true;
      }
      path.lineTo(x2, y2);
      updateBounds(bounds, x2, y2);
      drew = true;
    } else if (currentFront && !nextFront) {
      const exit = horizon();
      if (!open) {
        path.moveTo(x1, y1);
        updateBounds(bounds, x1, y1);
      }
      path.lineTo(exit[0], exit[1]);
      updateBounds(bounds, exit[0], exit[1]);
      path.closePath();
      open = false;
      drew = true;
    }
  }
  if (open) path.closePath();
  return drew ? { path, bounds } : null;
}

export default function HiflightGlobe({ states, mode, onCountryPress }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const statesRef = useRef(states);
  const modeRef = useRef(mode);
  const pressRef = useRef(onCountryPress);
  const cameraRef = useRef({ longitude: 8, latitude: 16, zoom: 1 });
  const imagesRef = useRef(new Map<string, HTMLImageElement>());
  const hitsRef = useRef<CountryHit[]>([]);
  const drawRef = useRef<() => void>(() => undefined);

  statesRef.current = states;
  modeRef.current = mode;
  pressRef.current = onCountryPress;

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;
    const renderingContext = canvasElement.getContext("2d", { alpha: true, desynchronized: true });
    if (!renderingContext) return;
    const canvas: HTMLCanvasElement = canvasElement;
    const context: CanvasRenderingContext2D = renderingContext;
    let cssWidth = 1;
    let cssHeight = 1;
    let frame = 0;
    let fullDrawPending = false;
    let settleTimer: ReturnType<typeof setTimeout> | null = null;

    function scheduleDraw(fullQuality = true) {
      fullDrawPending = fullDrawPending || fullQuality;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const useFullQuality = fullDrawPending;
        fullDrawPending = false;
        draw(useFullQuality);
      });
    }

    function projectRing(
      ring: PreparedRing,
      sinCenterLat: number,
      cosCenterLat: number,
      sinCenterLon: number,
      cosCenterLon: number,
      centerX: number,
      centerY: number,
      radius: number,
    ) {
      let maximumDepth = -1;
      for (let index = 0; index < ring.count; index += 1) {
        const point = ring.points[index];
        const sinDelta = point[2] * cosCenterLon - point[3] * sinCenterLon;
        const cosDelta = point[3] * cosCenterLon + point[2] * sinCenterLon;
        const horizontal = point[1] * sinDelta;
        const vertical = cosCenterLat * point[0] - sinCenterLat * point[1] * cosDelta;
        const depth = sinCenterLat * point[0] + cosCenterLat * point[1] * cosDelta;
        const offset = index * 3;
        ring.screen[offset] = centerX + radius * horizontal;
        ring.screen[offset + 1] = centerY - radius * vertical;
        ring.screen[offset + 2] = depth;
        if (depth > maximumDepth) maximumDepth = depth;
      }
      return maximumDepth;
    }

    function projectCenter(
      country: PreparedCountry,
      sinCenterLat: number,
      cosCenterLat: number,
      sinCenterLon: number,
      cosCenterLon: number,
      centerX: number,
      centerY: number,
      radius: number,
    ) {
      const point = country.centerPoint;
      const sinDelta = point[2] * cosCenterLon - point[3] * sinCenterLon;
      const cosDelta = point[3] * cosCenterLon + point[2] * sinCenterLon;
      country.hitX = centerX + radius * point[1] * sinDelta;
      country.hitY = centerY - radius * (cosCenterLat * point[0] - sinCenterLat * point[1] * cosDelta);
      country.hitDepth = sinCenterLat * point[0] + cosCenterLat * point[1] * cosDelta;
    }

    function draw(fullQuality: boolean) {
      if (cssWidth <= 1 || cssHeight <= 1) return;
      const { longitude, latitude, zoom } = cameraRef.current;
      const centerLongitude = longitude * RAD;
      const centerLatitude = latitude * RAD;
      const sinCenterLon = Math.sin(centerLongitude);
      const cosCenterLon = Math.cos(centerLongitude);
      const sinCenterLat = Math.sin(centerLatitude);
      const cosCenterLat = Math.cos(centerLatitude);
      const radius = Math.min(cssWidth, cssHeight) * 0.468 * zoom;
      const centerX = cssWidth / 2;
      const centerY = cssHeight / 2;
      context.clearRect(0, 0, cssWidth, cssHeight);

      const ocean = context.createRadialGradient(centerX - radius * 0.31, centerY - radius * 0.28, radius * 0.04, centerX, centerY, radius * 1.08);
      ocean.addColorStop(0, "#1B5276");
      ocean.addColorStop(0.48, "#0A2D49");
      ocean.addColorStop(0.82, "#04182C");
      ocean.addColorStop(1, "#010713");
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2);
      context.fillStyle = ocean;
      context.fill();
      context.save();
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2);
      context.clip();

      const nextHits: CountryHit[] = [];
      for (const country of PREPARED_COUNTRIES) {
        const state = statesRef.current[country.userCode];
        const active = modeRef.current === "visited" ? state?.visited : state?.wishlist;
        let image = active ? imagesRef.current.get(country.code) : undefined;
        const code2 = country.code2?.toLowerCase();
        if (active && !image && code2 && flagIsVisible(country.code2)) {
          const vector = VECTOR_FLAGS[code2];
          if (vector) {
            image = new Image();
            image.onload = () => scheduleDraw(true);
            image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(vector)}`;
            imagesRef.current.set(country.code, image);
          }
        }
        const paths: Path2D[] = [];
        let largestSpan = 0;
        let depth = -1;
        country.touchRadius = 0;
        projectCenter(country, sinCenterLat, cosCenterLat, sinCenterLon, cosCenterLon, centerX, centerY, radius);

        const rings = fullQuality ? country.drawRings : country.fastRings;
        for (const ring of rings) {
          depth = Math.max(depth, projectRing(ring, sinCenterLat, cosCenterLat, sinCenterLon, cosCenterLon, centerX, centerY, radius));
          const visible = appendVisibleRing(ring);
          if (!visible) continue;
          const { path, bounds } = visible;
          paths.push(path);
          context.fillStyle = active ? FLAG_COLORS[country.userCode] || "#FF6B6B" : "#5C6876";
          context.fill(path, "evenodd");
          const width = bounds[2] - bounds[0];
          const height = bounds[3] - bounds[1];
          largestSpan = Math.max(largestSpan, width, height);
          if (image?.complete && image.naturalWidth && width > 0 && height > 0) {
            context.save();
            context.clip(path, "evenodd");
            context.drawImage(image, bounds[0], bounds[1], width, height);
            context.restore();
          }
          context.strokeStyle = "rgba(15,35,54,0.96)";
          context.lineWidth = 0.62;
          context.lineJoin = "round";
          context.stroke(path);
        }

        if (paths.length && largestSpan < 2.6 && country.hitDepth > 0.02) {
          context.beginPath();
          context.arc(country.hitX, country.hitY, active ? 2.2 : 1.45, 0, Math.PI * 2);
          context.fillStyle = active ? FLAG_COLORS[country.userCode] || "#FF6B6B" : "#697583";
          context.fill();
          country.touchRadius = active ? 11 : 9;
        }
        if (fullQuality && paths.length) {
          nextHits.push({
            code: country.userCode,
            depth,
            paths,
            hitX: country.hitX,
            hitY: country.hitY,
            hitDepth: country.hitDepth,
            touchRadius: country.touchRadius,
          });
        }
      }

      const light = context.createRadialGradient(centerX - radius * 0.34, centerY - radius * 0.31, radius * 0.03, centerX, centerY, radius * 1.15);
      light.addColorStop(0, "rgba(225,248,255,0.15)");
      light.addColorStop(0.43, "rgba(125,218,255,0.015)");
      light.addColorStop(0.79, "rgba(0,12,28,0.09)");
      light.addColorStop(1, "rgba(0,2,10,0.62)");
      context.fillStyle = light;
      context.fillRect(0, 0, cssWidth, cssHeight);
      context.restore();
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2);
      context.strokeStyle = "rgba(112,201,239,0.76)";
      context.lineWidth = 1.35;
      context.stroke();
      if (fullQuality) hitsRef.current = nextHits.sort((a, b) => a.depth - b.depth);
    }

    drawRef.current = scheduleDraw;

    function resize() {
      const rectangle = canvas.getBoundingClientRect();
      cssWidth = Math.max(1, rectangle.width);
      cssHeight = Math.max(1, rectangle.height);
      const pixelRatioLimit = window.innerWidth < 768 ? 1.35 : 1.6;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, pixelRatioLimit);
      canvas.width = Math.max(1, Math.round(cssWidth * pixelRatio));
      canvas.height = Math.max(1, Math.round(cssHeight * pixelRatio));
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      scheduleDraw(true);
    }

    const pointerPositions = new Map<number, { x: number; y: number }>();
    const gesture = {
      kind: "none" as "none" | "pan" | "pinch",
      startX: 0,
      startY: 0,
      startLongitude: 8,
      startLatitude: 16,
      startZoom: 1,
      startDistance: 1,
      startMiddleX: 0,
      startMiddleY: 0,
      moved: false,
      startedAt: 0,
    };

    const pointerPoint = (event: PointerEvent) => {
      const rectangle = canvas.getBoundingClientRect();
      return { x: event.clientX - rectangle.left, y: event.clientY - rectangle.top };
    };
    const points = () => [...pointerPositions.values()];
    const distance = (first: { x: number; y: number }, second: { x: number; y: number }) => Math.max(1, Math.hypot(first.x - second.x, first.y - second.y));
    const middle = (first: { x: number; y: number }, second: { x: number; y: number }) => ({ x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 });
    const clamp = (value: number, minimum: number, maximum: number) => Math.max(minimum, Math.min(maximum, value));

    function beginPan(point: { x: number; y: number }, preserveMoved = false) {
      gesture.kind = "pan";
      gesture.startX = point.x;
      gesture.startY = point.y;
      gesture.startLongitude = cameraRef.current.longitude;
      gesture.startLatitude = cameraRef.current.latitude;
      gesture.moved = preserveMoved;
      gesture.startedAt = Date.now();
    }

    function beginPinch(first: { x: number; y: number }, second: { x: number; y: number }) {
      const midpoint = middle(first, second);
      gesture.kind = "pinch";
      gesture.startDistance = distance(first, second);
      gesture.startZoom = cameraRef.current.zoom;
      gesture.startLongitude = cameraRef.current.longitude;
      gesture.startLatitude = cameraRef.current.latitude;
      gesture.startMiddleX = midpoint.x;
      gesture.startMiddleY = midpoint.y;
      gesture.moved = true;
    }

    function selectCountryAt(x: number, y: number) {
      const { zoom } = cameraRef.current;
      const radius = Math.min(cssWidth, cssHeight) * 0.468 * zoom;
      const centerX = cssWidth / 2;
      const centerY = cssHeight / 2;
      const horizontal = (x - centerX) / radius;
      const vertical = (centerY - y) / radius;
      if (horizontal * horizontal + vertical * vertical > 1) return;
      context.save();
      context.setTransform(1, 0, 0, 1, 0, 0);
      let selected: CountryHit | undefined;
      for (let countryIndex = hitsRef.current.length - 1; countryIndex >= 0 && !selected; countryIndex -= 1) {
        const country = hitsRef.current[countryIndex];
        if (country.paths.some((path) => context.isPointInPath(path, x, y, "evenodd"))) selected = country;
      }
      context.restore();
      if (!selected) {
        let nearest = Infinity;
        hitsRef.current.forEach((country) => {
          if (!country.touchRadius || country.hitDepth <= 0.02) return;
          const value = Math.hypot(x - country.hitX, y - country.hitY);
          if (value <= country.touchRadius && value < nearest) {
            nearest = value;
            selected = country;
          }
        });
      }
      if (selected) pressRef.current(selected.code);
    }

    function onPointerDown(event: PointerEvent) {
      const point = pointerPoint(event);
      canvas.setPointerCapture(event.pointerId);
      pointerPositions.set(event.pointerId, point);
      const activePoints = points();
      if (activePoints.length >= 2) beginPinch(activePoints[0], activePoints[1]);
      else beginPan(point);
    }

    function onPointerMove(event: PointerEvent) {
      if (!pointerPositions.has(event.pointerId)) return;
      pointerPositions.set(event.pointerId, pointerPoint(event));
      const activePoints = points();
      if (activePoints.length >= 2) {
        if (gesture.kind !== "pinch") beginPinch(activePoints[0], activePoints[1]);
        const midpoint = middle(activePoints[0], activePoints[1]);
        const distanceRatio = distance(activePoints[0], activePoints[1]) / gesture.startDistance;
        cameraRef.current.zoom = clamp(gesture.startZoom * Math.pow(distanceRatio, 0.72), 1, 2.8);
        cameraRef.current.longitude = gesture.startLongitude - ((midpoint.x - gesture.startMiddleX) * 0.43) / Math.max(gesture.startZoom, 1);
        cameraRef.current.latitude = clamp(gesture.startLatitude + ((midpoint.y - gesture.startMiddleY) * 0.38) / Math.max(gesture.startZoom, 1), -82, 82);
      } else if (activePoints.length === 1) {
        if (gesture.kind !== "pan") beginPan(activePoints[0], true);
        const dx = activePoints[0].x - gesture.startX;
        const dy = activePoints[0].y - gesture.startY;
        if (Math.hypot(dx, dy) > 3) gesture.moved = true;
        cameraRef.current.longitude = gesture.startLongitude - (dx * 0.5) / Math.max(Math.sqrt(cameraRef.current.zoom), 1);
        cameraRef.current.latitude = clamp(gesture.startLatitude + (dy * 0.44) / Math.max(Math.sqrt(cameraRef.current.zoom), 1), -82, 82);
      }
      scheduleDraw(false);
    }

    function finishPointer(event: PointerEvent) {
      const wasTap = pointerPositions.size === 1 && gesture.kind === "pan" && !gesture.moved && Date.now() - gesture.startedAt < 350;
      const tapPoint = { x: gesture.startX, y: gesture.startY };
      pointerPositions.delete(event.pointerId);
      if (pointerPositions.size === 1) beginPan(points()[0], true);
      else if (!pointerPositions.size) {
        gesture.kind = "none";
        cameraRef.current.longitude = ((cameraRef.current.longitude + 180) % 360 + 360) % 360 - 180;
        if (wasTap) selectCountryAt(tapPoint.x, tapPoint.y);
        scheduleDraw(true);
      }
    }

    function onWheel(event: WheelEvent) {
      event.preventDefault();
      cameraRef.current.zoom = clamp(cameraRef.current.zoom * Math.exp(-event.deltaY * 0.0013), 1, 2.8);
      scheduleDraw(false);
      if (settleTimer) clearTimeout(settleTimer);
      settleTimer = setTimeout(() => scheduleDraw(true), 90);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", finishPointer);
    canvas.addEventListener("pointercancel", finishPointer);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    resize();

    return () => {
      cancelAnimationFrame(frame);
      if (settleTimer) clearTimeout(settleTimer);
      resizeObserver.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", finishPointer);
      canvas.removeEventListener("pointercancel", finishPointer);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, []);

  useEffect(() => {
    drawRef.current();
  }, [mode, states]);

  return (
    <div className={styles.globeStage}>
      <canvas ref={canvasRef} className={styles.globeCanvas} aria-label="Globe interactif HiFlight" />
      <p className={styles.globeHint}>Tournez dans toutes les directions · pincez ou utilisez la molette</p>
    </div>
  );
}
