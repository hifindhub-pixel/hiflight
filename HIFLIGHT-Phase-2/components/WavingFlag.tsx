"use client";

import { useEffect, useRef } from "react";
import styles from "./CountryFlagModal.module.css";

type WavingFlagProps = {
  src: string;
};

const VERTEX_SHADER = `
  precision highp float;
  attribute vec2 a_uv;
  uniform float u_time;
  uniform float u_motion;
  varying vec2 v_uv;
  varying float v_light;
  void main() {
    float x = a_uv.x;
    float y = a_uv.y;
    float anchored = smoothstep(0.015, 0.22, x);
    float freedom = pow(x, 1.38);
    float gust = 0.86 + 0.10 * sin(u_time * 0.48) + 0.04 * sin(u_time * 0.17 + 1.6);
    float phase1 = u_time * 2.05 - x * 7.8 + y * 1.10;
    float phase2 = u_time * 3.35 - x * 13.8 - y * 2.30;
    float phase3 = u_time * 1.18 - x * 4.1 + y * 4.40;
    float depth = anchored * u_motion * gust * (0.155 * sin(phase1) + 0.052 * sin(phase2) + 0.024 * sin(phase3));
    float flutter = anchored * u_motion * (0.016 + 0.105 * freedom) * (sin(phase1 + 0.65) + 0.28 * sin(phase2));
    float drift = anchored * u_motion * (0.010 * sin(phase1 - 0.4) + 0.027 * freedom * sin(phase2 + 1.2));
    vec2 position = vec2(-1.075 + x * 2.105, 1.11 - y * 2.22);
    position.x += drift + depth * 0.065;
    position.y += flutter - 0.045 * freedom;
    float perspective = 1.0 - depth * 0.10;
    gl_Position = vec4(position.x, position.y, depth * 0.10, perspective);
    float slope = 0.76 * cos(phase1) + 0.20 * cos(phase2) + 0.08 * cos(phase3);
    v_light = clamp(0.86 + slope * anchored * u_motion * 0.19 + depth * 0.22, 0.62, 1.14);
    v_uv = a_uv;
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  uniform sampler2D u_texture;
  varying vec2 v_uv;
  varying float v_light;
  void main() {
    vec4 color = texture2D(u_texture, v_uv);
    float edgeShade = 1.0 - 0.055 * pow(abs(v_uv.y - 0.5) * 2.0, 1.35);
    float sheen = max(v_light - 1.0, 0.0);
    vec3 lit = color.rgb * v_light * edgeShade + vec3(sheen * 0.075);
    gl_FragColor = vec4(lit, color.a);
  }
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function WavingFlag({ src }: WavingFlagProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const fallback = fallbackRef.current;
    if (!canvas || !fallback) return;

    canvas.style.opacity = "0";
    fallback.style.opacity = "1";
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertex || !fragment) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const columns = 72;
    const rows = 44;
    const vertices = new Float32Array((columns + 1) * (rows + 1) * 2);
    let vertexOffset = 0;
    for (let row = 0; row <= rows; row += 1) {
      for (let column = 0; column <= columns; column += 1) {
        vertices[vertexOffset++] = column / columns;
        vertices[vertexOffset++] = row / rows;
      }
    }

    const indices = new Uint16Array(columns * rows * 6);
    let indexOffset = 0;
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const topLeft = row * (columns + 1) + column;
        const bottomLeft = topLeft + columns + 1;
        indices[indexOffset++] = topLeft;
        indices[indexOffset++] = bottomLeft;
        indices[indexOffset++] = topLeft + 1;
        indices[indexOffset++] = topLeft + 1;
        indices[indexOffset++] = bottomLeft;
        indices[indexOffset++] = bottomLeft + 1;
      }
    }

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const uvLocation = gl.getAttribLocation(program, "a_uv");
    gl.enableVertexAttribArray(uvLocation);
    gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    const timeLocation = gl.getUniformLocation(program, "u_time");
    const motionLocation = gl.getUniformLocation(program, "u_motion");
    const textureLocation = gl.getUniformLocation(program, "u_texture");
    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.uniform1i(textureLocation, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let startedAt = 0;
    let disposed = false;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(canvas.clientWidth * ratio));
      const height = Math.max(1, Math.round(canvas.clientHeight * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
    };

    const draw = (now: number) => {
      if (disposed) return;
      resize();
      gl.clear(gl.COLOR_BUFFER_BIT);
      const elapsed = reducedMotion ? 1.35 : (now - startedAt) / 1000;
      gl.uniform1f(timeLocation, elapsed);
      gl.uniform1f(motionLocation, reducedMotion ? 0.24 : 1);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
      if (!reducedMotion) frame = requestAnimationFrame(draw);
    };

    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      if (disposed) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      startedAt = performance.now();
      draw(startedAt);
      canvas.style.opacity = "1";
      fallback.style.opacity = "0";
    };
    image.src = src;

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      gl.deleteTexture(texture);
      gl.deleteBuffer(vertexBuffer);
      gl.deleteBuffer(indexBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, [src]);

  return (
    <div className={styles.waveSurface} aria-hidden="true">
      <img ref={fallbackRef} className={styles.waveFallback} src={src} alt="" />
      <canvas ref={canvasRef} className={styles.waveCanvas} />
    </div>
  );
}
