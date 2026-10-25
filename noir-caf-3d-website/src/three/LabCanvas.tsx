import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrbitControls } from "@react-three/drei";
import CoffeeCup, { type CupFinish, type LiquidKind } from "./CoffeeCup";
import { BeanField } from "./Beans";
import { CanvasErrorBoundary, SceneFallback } from "./canvasBits";
import { isWebGLAvailable } from "../lib/hooks";

export type LabMood = "ember" | "ivory" | "midnight";

export interface LabState {
  finish: CupFinish;
  liquid: LiquidKind;
  mood: LabMood;
  beans: boolean;
}

export const LAB_DEFAULTS: LabState = { finish: "ivory", liquid: "espresso", mood: "ember", beans: true };

const MOODS: Record<
  LabMood,
  { key: string; keyI: number; fill: string; fillI: number; glow: string; glowI: number; bg: string; ring: string }
> = {
  ember: { key: "#ff9a4e", keyI: 3.2, fill: "#ffd9ad", fillI: 0.55, glow: "#ff7a2f", glowI: 10, bg: "#0a0503", ring: "#c65a2e" },
  ivory: { key: "#fff2df", keyI: 4.2, fill: "#f5ead9", fillI: 0.85, glow: "#e8c090", glowI: 6, bg: "#0e0a07", ring: "#c9b79c" },
  midnight: { key: "#91a4cf", keyI: 1.7, fill: "#46557a", fillI: 0.55, glow: "#5a6ea0", glowI: 6.5, bg: "#040507", ring: "#46557a" },
};

function MoodLights({ mood }: { mood: LabMood }) {
  const key = useRef<THREE.DirectionalLight>(null);
  const fill = useRef<THREE.DirectionalLight>(null);
  const glow = useRef<THREE.PointLight>(null);
  const target = useMemo(() => MOODS[mood], [mood]);
  const keyC = useMemo(() => new THREE.Color(target.key), [target]);
  const fillC = useMemo(() => new THREE.Color(target.fill), [target]);
  const glowC = useMemo(() => new THREE.Color(target.glow), [target]);

  // ease toward the new mood so changes feel cinematic
  useFrame((_, dt) => {
    const k = Math.min(1, dt * 4);
    if (key.current) {
      key.current.color.lerp(keyC, k);
      key.current.intensity += (target.keyI - key.current.intensity) * k;
    }
    if (fill.current) {
      fill.current.color.lerp(fillC, k);
      fill.current.intensity += (target.fillI - fill.current.intensity) * k;
    }
    if (glow.current) {
      glow.current.color.lerp(glowC, k);
      glow.current.intensity += (target.glowI - glow.current.intensity) * k;
    }
  });

  return (
    <>
      <hemisphereLight args={["#241a12", "#050302", 0.5]} />
      <directionalLight ref={key} position={[4, 5.5, 2.5]} intensity={target.keyI} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight ref={fill} position={[-4, 2.5, -3]} intensity={target.fillI} />
      <pointLight ref={glow} position={[-2, 1.3, 2.2]} intensity={target.glowI} distance={12} decay={2} />
    </>
  );
}

function LabRig({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current || reduced) return;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.12) * 0.06;
  });
  return <group ref={group} />;
}

export default function LabCanvas({
  state,
  reduced,
  isMobile,
  onOrbit,
}: {
  state: LabState;
  reduced: boolean;
  isMobile: boolean;
  onOrbit?: () => void;
}) {
  const webgl = useMemo(() => isWebGLAvailable(), []);
  const mood = MOODS[state.mood];
  const boostRef = useRef(0.6);

  if (!webgl) return <SceneFallback label="Coffee Lab" />;

  return (
    <CanvasErrorBoundary fallback={<SceneFallback label="Coffee Lab" />}>
      <Canvas
        shadows
        dpr={Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, isMobile ? 1.5 : 1.8)}
        camera={{ position: [0.4, 1.5, 4.4], fov: 40, near: 0.1, far: 50 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        aria-label="Interactive 3D coffee cup — drag to rotate, scroll to zoom"
      >
        <color attach="background" args={[mood.bg]} />
        <fog attach="fog" args={[mood.bg, 8, 18]} />
        <Suspense fallback={null}>
          <MoodLights mood={state.mood} />
          <LabRig reduced={reduced} />
          <group position={[0, 0.06, 0]}>
            <CoffeeCup
              finish={state.finish}
              liquid={state.liquid}
              steam={reduced ? 0 : 1}
              reducedMotion={reduced}
            />
          </group>
          {state.beans && (
            <BeanField count={isMobile ? 18 : 34} inner={1.35} outer={2.5} yMin={0.2} yMax={2.1} boostRef={boostRef} reducedMotion={reduced} seed={21} />
          )}
          {/* plinth */}
          <mesh position={[0, -0.06, 0]} receiveShadow>
            <cylinderGeometry args={[1.35, 1.4, 0.12, 72]} />
            <meshStandardMaterial color="#0d0a07" roughness={0.28} metalness={0.55} />
          </mesh>
          <mesh position={[0, -0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.36, 1.42, 72]} />
            <meshBasicMaterial color={mood.ring} transparent opacity={0.55} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.13, 0]}>
            <circleGeometry args={[14, 48]} />
            <meshStandardMaterial color="#060403" roughness={0.5} metalness={0.4} />
          </mesh>
          <ContactShadows position={[0, -0.11, 0]} opacity={0.7} blur={2.4} scale={9} far={3.2} color="#000000" />
          <Environment resolution={128} frames={1}>
            <Lightformer intensity={4} position={[0, 5, -9]} rotation-x={Math.PI / 2} scale={[9, 1, 1]} color="#fff3df" />
            <Lightformer intensity={2.4} position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[12, 2, 1]} color="#ffd9ad" />
            <Lightformer intensity={2} position={[6, 2, 2]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} color={mood.ring} />
          </Environment>
          <OrbitControls
            makeDefault
            enablePan={false}
            minDistance={2.4}
            maxDistance={7.5}
            minPolarAngle={Math.PI * 0.18}
            maxPolarAngle={Math.PI * 0.55}
            enableDamping
            dampingFactor={0.08}
            onStart={onOrbit}
            autoRotate={!reduced}
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </CanvasErrorBoundary>
  );
}

/** So hooks that create objects every render don't leak — trivial dispose helper for memoised materials. */
export function useDispose(...deps: (THREE.Material | THREE.BufferGeometry | null)[]) {
  useEffect(() => {
    return () => {
      deps.forEach((d) => d?.dispose());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
