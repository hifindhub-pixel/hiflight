"use client";

import { useEffect, useRef, useState } from "react";
import { GLOBE_COUNTRIES } from "@/lib/world-map/globeCountries";
import { VECTOR_FLAGS } from "@/lib/world-map/vectorFlags";
import { MISSING_VECTOR_FLAGS } from "@/lib/world-map/missingVectorFlags";
import { FLAG_COLORS } from "@/lib/world-map/flagColors";
import { MOROCCO_UNIFIED_GLOBE_RING, thinRing } from "@/lib/world-map/geometry";
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
      hitX: -1000,
      hitY: -1000,
      hitDepth: -1,
      touchRadius: 0,
    };
  });

function flagIsVisible(code2: string | null) {
  return Boolean(code2);
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
  const [showHint, setShowHint] = useState(false);
  const statesRef = useRef(states);
  const modeRef = useRef(mode);
  const pressRef = useRef(onCountryPress);
  const cameraRef = useRef({ longitude: 8, latitude: 16, zoom: 1 });
  const imagesRef = useRef(new Map<string, HTMLCanvasElement>());
  const hitsRef = useRef<CountryHit[]>([]);
  const drawRef = useRef<() => void>(() => undefined);

  statesRef.current = states;
  modeRef.current = mode;
  pressRef.current = onCountryPress;

  useEffect(() => {
    const storageKey = "hiflight-globe-gesture-hint-seen";
    try {
      if (window.sessionStorage.getItem(storageKey)) return;
      window.sessionStorage.setItem(storageKey, "1");
    } catch {
      // The hint still works when session storage is unavailable.
    }
    setShowHint(true);
    const timer = window.setTimeout(() => setShowHint(false), 4200);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;
    const renderingContext = canvasElement.getContext("2d", { alpha: true });
    if (!renderingContext) return;
    const canvas: HTMLCanvasElement = canvasElement;
    const context: CanvasRenderingContext2D = renderingContext;
    let cssWidth = 1;
    let cssHeight = 1;
    let frame = 0;
    let disposed = false;
    const loadingFlags = new Map<string, HTMLImageElement>();
    const failedFlags = new Set<string>();

    function scheduleDraw() {
      if (disposed) return;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        draw();
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

    function draw() {
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
        const image = active ? imagesRef.current.get(country.code) : undefined;
        const code2 = country.code2?.toLowerCase();
        if (active && !image && code2 && flagIsVisible(country.code2)
          && !loadingFlags.has(country.code) && !failedFlags.has(country.code)) {
          const vector = VECTOR_FLAGS[code2] || MISSING_VECTOR_FLAGS[code2];
          if (vector) {
            const source = new Image();
            loadingFlags.set(country.code, source);
            source.onload = () => {
              if (disposed) return;
              // Rasterize once. Drawing SVG sources for every island on every
              // frame repeatedly rasterizes complex flags during rotation.
              const texture = document.createElement("canvas");
              texture.width = 256;
              texture.height = Math.max(1, Math.min(256, Math.round(256 * source.naturalHeight / Math.max(1, source.naturalWidth))));
              const textureContext = texture.getContext("2d");
              if (textureContext) {
                textureContext.drawImage(source, 0, 0, texture.width, texture.height);
                imagesRef.current.set(country.code, texture);
              } else failedFlags.add(country.code);
              loadingFlags.delete(country.code);
              scheduleDraw();
            };
            source.onerror = () => {
              failedFlags.add(country.code);
              loadingFlags.delete(country.code);
            };
            source.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(vector)}`;
          }
        }
        const paths: Path2D[] = [];
        const countryPath = new Path2D();
        const flagPath = new Path2D();
        const flagBounds: [number, number, number, number] = [Infinity, Infinity, -Infinity, -Infinity];
        const territoryFlags: Array<{ path: Path2D; bounds: [number, number, number, number] }> = [];
        let hasFlagPath = false;
        let hasVisiblePath = false;
        let largestSpan = 0;
        let depth = -1;
        country.touchRadius = 0;
        projectCenter(country, sinCenterLat, cosCenterLat, sinCenterLon, cosCenterLon, centerX, centerY, radius);

        // Keep identical borders at rest and during a gesture: switching
        // coastlines also changed the flag bounds and made countries flash.
        const rings = country.drawRings;
        for (const ring of rings) {
          depth = Math.max(depth, projectRing(ring, sinCenterLat, cosCenterLat, sinCenterLon, cosCenterLon, centerX, centerY, radius));
          const visible = appendVisibleRing(ring);
          if (!visible) continue;
          const { path, bounds } = visible;
          hasVisiblePath = true;
          paths.push(path);
          countryPath.addPath(path);
          const width = bounds[2] - bounds[0];
          const height = bounds[3] - bounds[1];
          largestSpan = Math.max(largestSpan, width, height);
          // Subpixel islands keep their country colour; rasterizing a full
          // flag into each tiny island was the dominant draw-call overhead.
          if (image && width >= 3 && height >= 3) {
            // France includes French Guiana. A shared screen-space flag
            // stretches across the Atlantic and turns mainland France red.
            if (country.code === "FRA") {
              territoryFlags.push({ path, bounds });
              continue;
            }
            flagPath.addPath(path);
            updateBounds(flagBounds, bounds[0], bounds[1]);
            updateBounds(flagBounds, bounds[2], bounds[3]);
            hasFlagPath = true;
          }
        }
        if (hasVisiblePath) {
          context.fillStyle = active ? FLAG_COLORS[country.userCode] || "#FF6B6B" : "#5C6876";
          context.fill(countryPath, "evenodd");
          if (image && hasFlagPath) {
            context.save();
            context.clip(flagPath, "evenodd");
            context.drawImage(image, flagBounds[0], flagBounds[1], flagBounds[2] - flagBounds[0], flagBounds[3] - flagBounds[1]);
            context.restore();
          }
          if (image) for (const territory of territoryFlags) {
            const [left, top, right, bottom] = territory.bounds;
            context.save();
            context.clip(territory.path, "evenodd");
            context.drawImage(image, left, top, right - left, bottom - top);
            context.restore();
          }
          context.strokeStyle = "rgba(15,35,54,0.96)";
          context.lineWidth = 0.62;
          context.lineJoin = "round";
          context.stroke(countryPath);
        }

        if (hasVisiblePath && largestSpan < 2.6 && country.hitDepth > 0.02) {
          context.beginPath();
          context.arc(country.hitX, country.hitY, active ? 2.2 : 1.45, 0, Math.PI * 2);
          context.fillStyle = active ? FLAG_COLORS[country.userCode] || "#FF6B6B" : "#697583";
          context.fill();
          country.touchRadius = active ? 11 : 9;
        }
        if (hasVisiblePath) {
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
      hitsRef.current = nextHits.sort((a, b) => a.depth - b.depth);
    }

    drawRef.current = scheduleDraw;

    function resize() {
      const rectangle = canvas.getBoundingClientRect();
      cssWidth = Math.max(1, rectangle.width);
      cssHeight = Math.max(1, rectangle.height);
      const pixelRatioLimit = window.innerWidth < 768 ? 1.2 : 1.4;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, pixelRatioLimit);
      canvas.width = Math.max(1, Math.round(cssWidth * pixelRatio));
      canvas.height = Math.max(1, Math.round(cssHeight * pixelRatio));
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      scheduleDraw();
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
        if (!gesture.moved && Math.hypot(dx, dy) <= 3) return;
        gesture.moved = true;
        cameraRef.current.longitude = gesture.startLongitude - (dx * 0.5) / Math.max(Math.sqrt(cameraRef.current.zoom), 1);
        cameraRef.current.latitude = clamp(gesture.startLatitude + (dy * 0.44) / Math.max(Math.sqrt(cameraRef.current.zoom), 1), -82, 82);
      }
      scheduleDraw();
    }

    function finishPointer(event: PointerEvent) {
      if (!pointerPositions.has(event.pointerId)) return;
      const wasTap = event.type === "pointerup" && pointerPositions.size === 1 && gesture.kind === "pan" && !gesture.moved && Date.now() - gesture.startedAt < 350;
      const tapPoint = { x: gesture.startX, y: gesture.startY };
      pointerPositions.delete(event.pointerId);
      if (pointerPositions.size === 1) beginPan(points()[0], true);
      else if (!pointerPositions.size) {
        gesture.kind = "none";
        cameraRef.current.longitude = ((cameraRef.current.longitude + 180) % 360 + 360) % 360 - 180;
        if (wasTap) {
          // Refresh hit paths at the current camera position, even if a wheel
          // or pointer frame was still pending when this tap arrived.
          if (frame) {
            cancelAnimationFrame(frame);
            frame = 0;
            draw();
          }
          selectCountryAt(tapPoint.x, tapPoint.y);
        }
        if (!wasTap) scheduleDraw();
      }
    }

    function onWheel(event: WheelEvent) {
      event.preventDefault();
      cameraRef.current.zoom = clamp(cameraRef.current.zoom * Math.exp(-event.deltaY * 0.0013), 1, 2.8);
      scheduleDraw();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", finishPointer);
    canvas.addEventListener("pointercancel", finishPointer);
    canvas.addEventListener("lostpointercapture", finishPointer);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    resize();

    return () => {
      disposed = true;
      loadingFlags.forEach((source) => { source.onload = null; source.onerror = null; });
      loadingFlags.clear();
      drawRef.current = () => undefined;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", finishPointer);
      canvas.removeEventListener("pointercancel", finishPointer);
      canvas.removeEventListener("lostpointercapture", finishPointer);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, []);

  useEffect(() => {
    drawRef.current();
  }, [mode, states]);

  return (
    <div className={styles.globeStage}>
      <canvas ref={canvasRef} className={styles.globeCanvas} aria-label="Globe interactif HiFlight" />
      {showHint ? <p className={styles.globeHint}>Tournez dans toutes les directions · pincez ou utilisez la molette</p> : null}
    </div>
  );
}
