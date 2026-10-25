import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  STEAM_VERTEX,
  STEAM_FRAGMENT,
  COFFEE_VERTEX as COFFEE_VERTEX_SHARED,
  COFFEE_FRAGMENT as COFFEE_FRAGMENT_SHARED,
} from "./shaders";

export type CupFinish = "ivory" | "noir" | "cream";
export type LiquidKind = "espresso" | "latte" | "cappuccino" | "coldbrew" | "none";

const FINISHES: Record<CupFinish, { color: string; roughness: number; clearcoat: number; metalness: number }> = {
  ivory: { color: "#f3e9d8", roughness: 0.26, clearcoat: 1, metalness: 0.02 },
  noir: { color: "#151210", roughness: 0.62, clearcoat: 0.35, metalness: 0.06 },
  cream: { color: "#efdfc2", roughness: 0.32, clearcoat: 0.9, metalness: 0.02 },
};

const LIQUIDS: Record<Exclude<LiquidKind, "none">, { dark: string; light: string; y: number; crema: number }> = {
  espresso: { dark: "#241108", light: "#a5642f", y: 0.56, crema: 0.7 },
  latte: { dark: "#5c3218", light: "#d9a86c", y: 0.62, crema: 0.9 },
  cappuccino: { dark: "#4a2a14", light: "#e6cfa4", y: 0.6, crema: 1 },
  coldbrew: { dark: "#120805", light: "#6d3d1d", y: 0.68, crema: 0.15 },
};

function cupProfile(): THREE.Vector2[] {
  return [
    new THREE.Vector2(0.001, 0.0),
    new THREE.Vector2(0.34, 0.0),
    new THREE.Vector2(0.52, 0.015),
    new THREE.Vector2(0.62, 0.06),
    new THREE.Vector2(0.72, 0.18),
    new THREE.Vector2(0.78, 0.42),
    new THREE.Vector2(0.8, 0.68),
    new THREE.Vector2(0.815, 0.8),
    new THREE.Vector2(0.82, 0.855),
    new THREE.Vector2(0.79, 0.875),
    new THREE.Vector2(0.755, 0.85),
    new THREE.Vector2(0.735, 0.78),
    new THREE.Vector2(0.71, 0.5),
    new THREE.Vector2(0.66, 0.3),
    new THREE.Vector2(0.5, 0.235),
    new THREE.Vector2(0.2, 0.215),
    new THREE.Vector2(0.001, 0.21),
  ];
}

function saucerProfile(): THREE.Vector2[] {
  return [
    new THREE.Vector2(0.001, 0.0),
    new THREE.Vector2(0.5, 0.005),
    new THREE.Vector2(0.9, 0.045),
    new THREE.Vector2(1.12, 0.115),
    new THREE.Vector2(1.18, 0.155),
    new THREE.Vector2(1.14, 0.17),
    new THREE.Vector2(0.98, 0.13),
    new THREE.Vector2(0.62, 0.075),
    new THREE.Vector2(0.3, 0.062),
    new THREE.Vector2(0.001, 0.06),
  ];
}

/** Animated steam wisps — intensity can be driven externally via a ref. */
export function SteamWisps({
  intensityRef,
  intensity = 0.8,
  count = 3,
  baseY = 0.88,
  refresh = true,
}: {
  intensityRef?: React.MutableRefObject<number>;
  intensity?: number;
  count?: number;
  baseY?: number;
  refresh?: boolean;
}) {
  const wisps = useMemo(() => {
    const arr: { geo: THREE.CylinderGeometry; mat: THREE.ShaderMaterial; x: number; z: number; s: number }[] = [];
    for (let i = 0; i < count; i++) {
      const h = 1.5 + i * 0.22;
      const geo = new THREE.CylinderGeometry(0.3 + i * 0.05, 0.1, h, 20, 12, true);
      geo.translate(0, h / 2, 0);
      const mat = new THREE.ShaderMaterial({
        vertexShader: STEAM_VERTEX,
        fragmentShader: STEAM_FRAGMENT,
        uniforms: {
          uTime: { value: 0 },
          uPhase: { value: i * 3.7 },
          uIntensity: { value: intensity },
          uTint: { value: new THREE.Color("#f2e2cd") },
        },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });
      arr.push({ geo, mat, x: (i - (count - 1) / 2) * 0.09, z: (i % 2 === 0 ? 1 : -1) * 0.05, s: 0.8 + i * 0.16 });
    }
    return arr;
  }, [count, intensity]);

  useEffect(() => {
    return () => {
      wisps.forEach((w) => {
        w.geo.dispose();
        w.mat.dispose();
      });
    };
  }, [wisps]);

  useFrame((state) => {
    if (!refresh) return;
    const t = state.clock.elapsedTime;
    const value = intensityRef ? intensityRef.current : intensity;
    wisps.forEach((w) => {
      w.mat.uniforms.uTime.value = t;
      w.mat.uniforms.uIntensity.value = value;
    });
  });

  return (
    <group position={[0, baseY, 0]}>
      {wisps.map((w, i) => (
        <mesh key={i} geometry={w.geo} material={w.mat} position={[w.x, 0, w.z]} scale={[w.s, 1, w.s]} />
      ))}
    </group>
  );
}

interface CoffeeCupProps {
  finish?: CupFinish;
  liquid?: LiquidKind;
  saucer?: boolean;
  steam?: number;
  steamIntensityRef?: React.MutableRefObject<number>;
  liquidRef?: (mesh: THREE.Mesh | null) => void;
  castShadow?: boolean;
  reducedMotion?: boolean;
}

export default function CoffeeCup({
  finish = "ivory",
  liquid = "espresso",
  saucer = true,
  steam = 0.9,
  steamIntensityRef,
  liquidRef,
  castShadow = true,
  reducedMotion = false,
}: CoffeeCupProps) {
  const cupGeo = useMemo(() => new THREE.LatheGeometry(cupProfile(), 72), []);
  const saucerGeo = useMemo(() => new THREE.LatheGeometry(saucerProfile(), 72), []);
  const handleGeo = useMemo(() => {
    const g = new THREE.TorusGeometry(0.33, 0.062, 20, 48, Math.PI);
    return g;
  }, []);
  const liquidGeo = useMemo(() => new THREE.CircleGeometry(0.695, 64), []);
  const foamGeo = useMemo(() => new THREE.SphereGeometry(0.64, 40, 20), []);

  useEffect(() => {
    return () => {
      cupGeo.dispose();
      saucerGeo.dispose();
      handleGeo.dispose();
      liquidGeo.dispose();
      foamGeo.dispose();
    };
  }, [cupGeo, saucerGeo, handleGeo, liquidGeo, foamGeo]);

  const cupMat = useMemo(() => {
    const f = FINISHES[finish];
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(f.color),
      roughness: f.roughness,
      clearcoat: f.clearcoat,
      clearcoatRoughness: 0.18,
      metalness: f.metalness,
      envMapIntensity: 0.9,
    });
  }, [finish]);
  useEffect(() => () => cupMat.dispose(), [cupMat]);

  const liq = liquid !== "none" ? LIQUIDS[liquid] : null;
  const liquidMat = useMemo(() => {
    if (!liq) return null;
    return new THREE.ShaderMaterial({
      vertexShader: COFFEE_VERTEX_SHARED,
      fragmentShader: COFFEE_FRAGMENT_SHARED,
      uniforms: {
        uTime: { value: 0 },
        uDark: { value: new THREE.Color(liq.dark) },
        uLight: { value: new THREE.Color(liq.light) },
        uCrema: { value: liq.crema },
      },
    });
  }, [liq]);
  useEffect(() => () => liquidMat?.dispose(), [liquidMat]);

  const foamMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#e8d7bd"),
        roughness: 0.95,
        metalness: 0,
      }),
    [],
  );
  useEffect(() => () => foamMat.dispose(), [foamMat]);

  useFrame((state) => {
    if (liquidMat && !reducedMotion) liquidMat.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <group>
      {/* cup body */}
      <mesh geometry={cupGeo} material={cupMat} castShadow={castShadow} receiveShadow />
      {/* handle */}
      <mesh
        geometry={handleGeo}
        material={cupMat}
        position={[0.86, 0.46, 0]}
        rotation={[0, 0, Math.PI / 2]}
        scale={[1, 1.12, 1]}
        castShadow={castShadow}
      />
      {/* saucer */}
      {saucer && <mesh geometry={saucerGeo} material={cupMat} position={[0, -0.02, 0]} castShadow={castShadow} receiveShadow />}
      {/* liquid surface */}
      {liq && liquidMat && liquid !== "cappuccino" && (
        <mesh
          ref={liquidRef}
          geometry={liquidGeo}
          material={liquidMat}
          position={[0, liq.y, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      )}
      {liquid === "cappuccino" && (
        <mesh geometry={foamGeo} material={foamMat} position={[0, 0.34, 0]} scale={[1.06, 0.5, 1.06]} />
      )}
      {steam > 0 || steamIntensityRef ? (
        <SteamWisps
          intensity={steam}
          intensityRef={steamIntensityRef}
          refresh={!reducedMotion}
        />
      ) : null}
    </group>
  );
}
