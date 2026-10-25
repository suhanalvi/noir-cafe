/**
 * Shared GLSL chunks + shader programs for NOIR CAFÉ scenes.
 * Value-noise FBM keeps everything dependency-free and procedural.
 */

export const NOISE_GLSL = /* glsl */ `
  float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash21(i + vec2(0.0, 0.0)), hash21(i + vec2(1.0, 0.0)), u.x),
      mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * vnoise(p);
      p *= 2.03;
      a *= 0.5;
    }
    return v;
  }
`;

/* ---------------------------------- steam ---------------------------------- */

export const STEAM_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uPhase;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    float t = uTime + uPhase;
    float sway = sin(uv.y * 3.0 + t * 1.3) * 0.10 + sin(uv.y * 5.0 - t * 0.8) * 0.04;
    p.x += sway * uv.y;
    p.z += cos(uv.y * 2.4 + t * 1.05) * 0.07 * uv.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

export const STEAM_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform float uPhase;
  uniform float uIntensity;
  uniform vec3 uTint;
  varying vec2 vUv;
  ${NOISE_GLSL}
  void main() {
    float t = uTime + uPhase;
    float n = fbm(vec2(vUv.x * 2.4 + t * 0.05, vUv.y * 1.7 - t * 0.32));
    float n2 = fbm(vec2(vUv.x * 5.0 - t * 0.07, vUv.y * 3.2 - t * 0.5));
    float body = smoothstep(0.42, 0.85, n * 0.7 + n2 * 0.45);
    float mask = smoothstep(0.0, 0.22, vUv.y) * smoothstep(1.0, 0.5, vUv.y);
    float edge = smoothstep(0.0, 0.28, vUv.x) * smoothstep(1.0, 0.72, vUv.x);
    float alpha = body * mask * edge * uIntensity * 0.4;
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(uTint, alpha);
  }
`;

/* ------------------------------ coffee surface ----------------------------- */

export const COFFEE_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

export const COFFEE_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform vec3 uDark;
  uniform vec3 uLight;
  uniform float uCrema;
  varying vec2 vUv;
  ${NOISE_GLSL}
  void main() {
    vec2 c = vUv - 0.5;
    float r = length(c) * 2.0;
    float ang = atan(c.y, c.x) + uTime * 0.07;
    // slow espresso swirl
    float sw = fbm(vec2(ang * 1.6, r * 3.0 - uTime * 0.1));
    float micro = fbm(c * 7.0 + vec2(uTime * 0.08, -uTime * 0.05));
    vec3 col = mix(uDark, uLight, smoothstep(0.32, 0.86, sw) * 0.85);
    // crema bloom, revealed during the pour scene
    float cremaRing = smoothstep(0.55, 0.95, fbm(vec2(ang * 3.0 + 2.0, r * 4.5 - uTime * 0.06)));
    col = mix(col, uLight * 1.25, cremaRing * 0.6 * uCrema);
    col = mix(col, col * 0.72, smoothstep(0.82, 1.0, r));
    // fake specular sheen
    col += vec3(1.0, 0.85, 0.6) * pow(max(0.0, 1.0 - r), 3.0) * 0.05;
    gl_FragColor = vec4(col, 1.0);
  }
`;

/* -------------------------------- pour stream ------------------------------ */

export const STREAM_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  varying vec2 vUv;
  ${NOISE_GLSL}
  void main() {
    float flow = fbm(vec2(vUv.x * 5.0, vUv.y * 7.0 + uTime * -4.2));
    vec3 col = mix(vec3(0.16, 0.07, 0.03), vec3(0.78, 0.48, 0.22), flow);
    col = mix(col, vec3(0.95, 0.72, 0.4), smoothstep(0.62, 0.9, flow) * 0.6);
    float tipJitter = fbm(vec2(uTime * 1.5, vUv.x * 3.0)) * 0.14;
    float alpha = smoothstep(0.0, 0.10, vUv.y + tipJitter) * smoothstep(1.0, 0.96, vUv.y);
    alpha *= uOpacity;
    gl_FragColor = vec4(col, alpha);
  }
`;

export const STREAM_VERTEX = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    float wig = sin(uv.y * 14.0 - uTime * 9.0) * 0.006 * (1.0 - uv.y);
    p.x += wig;
    p.z += cos(uv.y * 11.0 - uTime * 7.0) * 0.005 * (1.0 - uv.y);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

/* --------------------------------- light rays ------------------------------ */

export const RAY_FRAGMENT = /* glsl */ `
  uniform float uOpacity;
  varying vec2 vUv;
  ${NOISE_GLSL}
  void main() {
    float streak = fbm(vec2(vUv.x * 6.0, vUv.y * 1.2));
    float a = pow(1.0 - vUv.y, 2.0) * smoothstep(0.1, 0.75, streak) * uOpacity;
    gl_FragColor = vec4(vec3(1.0, 0.72, 0.42), a);
  }
`;

export const RAY_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;
