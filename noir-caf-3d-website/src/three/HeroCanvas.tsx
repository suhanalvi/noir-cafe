import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, MeshReflectorMaterial } from "@react-three/drei";
import CoffeeCup from "./CoffeeCup";
import { BeanField } from "./Beans";
import { CanvasErrorBoundary, SceneFallback } from "./canvasBits";
import { isWebGLAvailable } from "../lib/hooks";
import { STREAM_VERTEX, STREAM_FRAGMENT, RAY_VERTEX, RAY_FRAGMENT } from "./shaders";

/**
 * Mutable scroll-controller object. GSAP tweens these values with a scrubbed,
 * reversible timeline; the render loop reads them every frame.
 */
export interface HeroCtrl {
  camX: number;
  camY: number;
  camZ: number;
  tarY: number;
  cupRy: number;
  beanBoost: number;
  warm: number;
  steam: number;
  pour: number;
  crema: number;
  rays: number;
  aroma: number;
  spout: number;
  liquid: number;
}

export const HERO_CTRL_DEFAULTS: HeroCtrl = {
  camX: 0,
  camY: 1.65,
  camZ: 9.2,
  tarY: 1.0,
  cupRy: 0,
  beanBoost: 1,
  warm: 0,
  steam: 0.45,
  pour: 0,
  crema: 0,
  rays: 0,
  aroma: 0,
  spout: 0,
  liquid: 0,
};

/* ------------------------------- camera rig -------------------------------- */

function CameraRig({ ctrl, reduced }: { ctrl: React.MutableRefObject<HeroCtrl>; reduced: boolean }) {
  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera, pointer }, dt) => {
    const c = ctrl.current;
    const k = Math.min(1, dt * 3.2);
    const px = reduced ? 0 : pointer.x * 0.5;
    const py = reduced ? 0 : pointer.y * 0.32;
    camera.position.x += (c.camX + px - camera.position.x) * k;
    camera.position.y += (c.camY + camYBob(reduced ? 0 : dt) + py - camera.position.y) * k;
    camera.position.z += (c.camZ - camera.position.z) * k;
    target.set(px * 0.25, c.tarY + py * 0.4, 0);
    camera.lookAt(target);
  });
  return null;
}

// gentle vertical drift accumulator (kept module-level to avoid re-renders)
let bobT = 0;
function camYBob(dt: number) {
  bobT += dt;
  return Math.sin(bobT * 0.5) * 0.05;
}

/* --------------------------------- lights ---------------------------------- */

function HeroLights({ ctrl }: { ctrl: React.MutableRefObject<HeroCtrl> }) {
  const key = useRef<THREE.DirectionalLight>(null);
  const glow = useRef<THREE.PointLight>(null);
  const keyCool = useMemo(() => new THREE.Color("#ffd9ad"), []);
  const keyHot = useMemo(() => new THREE.Color("#ff9440"), []);
  useFrame(() => {
    const w = ctrl.current.warm;
    key.current?.color.lerpColors(keyCool, keyHot, w);
    if (key.current) key.current.intensity = 2.4 + w * 1.6;
    if (glow.current) {
      glow.current.intensity = 5 + w * 12 + ctrl.current.pour * 8;
    }
  });
  return (
    <>
      <hemisphereLight args={["#2a1b10", "#050302", 0.55]} />
      <directionalLight ref={key} position={[4.5, 6.5, 2.5]} intensity={2.4} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0004} />
      <directionalLight position={[-5, 3, -4]} intensity={0.45} color="#7c8aa5" />
      <pointLight ref={glow} position={[-2.2, 1.2, 2.4]} intensity={5} distance={14} decay={2} color="#ff8c42" />
    </>
  );
}

/* -------------------------------- pour rig --------------------------------- */

function PourRig({ ctrl }: { ctrl: React.MutableRefObject<HeroCtrl> }) {
  const group = useRef<THREE.Group>(null);
  const stream = useRef<THREE.Mesh>(null);

  const streamGeo = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.032, 0.045, 2.2, 12, 24, true);
    g.translate(0, -1.1, 0); // origin at top — scale.y grows downward
    return g;
  }, []);
  const streamMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: STREAM_VERTEX,
        fragmentShader: STREAM_FRAGMENT,
        uniforms: { uTime: { value: 0 }, uOpacity: { value: 1 } },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [],
  );
  const metal = useMemo(
    () =>
      new THREE.MeshStandardMaterial({ color: new THREE.Color("#3b3f45"), roughness: 0.35, metalness: 0.9 }),
    [],
  );
  const dark = useMemo(
    () => new THREE.MeshStandardMaterial({ color: new THREE.Color("#17110c"), roughness: 0.6, metalness: 0.2 }),
    [],
  );
  useEffect(() => {
    return () => {
      streamGeo.dispose();
      streamMat.dispose();
      metal.dispose();
      dark.dispose();
    };
  }, [streamGeo, streamMat, metal, dark]);

  useFrame((state) => {
    const c = ctrl.current;
    if (group.current) {
      const s = c.spout;
      group.current.visible = s > 0.02;
      group.current.position.y = 3.55 - s * 0.55;
      const sc = 0.55 + s * 0.45;
      group.current.scale.setScalar(sc);
    }
    if (stream.current) {
      stream.current.visible = c.pour > 0.015 && c.spout > 0.6;
      const g = Math.max(0.0001, c.pour);
      stream.current.scale.set(1 + Math.sin(state.clock.elapsedTime * 22) * 0.05, g, 1);
      streamMat.uniforms.uTime.value = state.clock.elapsedTime;
      streamMat.uniforms.uOpacity.value = Math.min(1, c.pour * 2.2);
    }
  });

  return (
    <group ref={group} position={[0, 3.55, 0]} visible={false}>
      {/* portafilter-inspired brew head */}
      <mesh material={metal} position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.17, 0.17, 0.62, 28]} />
      </mesh>
      <mesh material={dark} position={[0, -0.16, 0]}>
        <cylinderGeometry args={[0.12, 0.1, 0.2, 24]} />
      </mesh>
      <mesh material={metal} position={[0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 16]} />
      </mesh>
      <mesh material={dark} position={[0.85, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.055, 0.28, 6, 12]} />
      </mesh>
      <mesh material={metal} position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.045, 0.06, 0.12, 16]} />
      </mesh>
      {/* extraction stream */}
      <mesh ref={stream} geometry={streamGeo} material={streamMat} position={[0, -0.34, 0]} />
    </group>
  );
}

/* ------------------------- crema ring + liquid sync ------------------------ */

function CremaRing({ ctrl, liquidLevel }: { ctrl: React.MutableRefObject<HeroCtrl>; liquidLevel: React.MutableRefObject<number> }) {
  const ref = useRef<THREE.Mesh>(null);
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#d9a05f"),
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    [],
  );
  useEffect(() => () => mat.dispose(), [mat]);
  useFrame((state) => {
    mat.opacity = ctrl.current.crema * 0.85;
    if (ref.current) {
      ref.current.position.y = liquidLevel.current + 0.012;
      ref.current.rotation.z = state.clock.elapsedTime * 0.15;
      ref.current.visible = ctrl.current.crema > 0.01;
    }
  });
  return (
    <mesh ref={ref} material={mat} position={[0, 0.56, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
      <ringGeometry args={[0.52, 0.68, 64]} />
    </mesh>
  );
}

/* -------------------------------- light rays ------------------------------- */

function LightRays({ ctrl }: { ctrl: React.MutableRefObject<HeroCtrl> }) {
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);
  const mats = useMemo(
    () =>
      [0, 1].map(
        () =>
          new THREE.ShaderMaterial({
            vertexShader: RAY_VERTEX,
            fragmentShader: RAY_FRAGMENT,
            uniforms: { uOpacity: { value: 0 } },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
          }),
      ),
    [],
  );
  const geo = useMemo(() => new THREE.ConeGeometry(1.5, 7, 24, 1, true), []);
  useEffect(() => {
    return () => {
      geo.dispose();
      mats.forEach((m) => m.dispose());
    };
  }, [geo, mats]);
  useFrame((state) => {
    mats[0].uniforms.uOpacity.value = ctrl.current.rays * 0.4;
    mats[1].uniforms.uOpacity.value = ctrl.current.rays * 0.3;
    const t = state.clock.elapsedTime;
    if (a.current) a.current.rotation.z = 0.5 + Math.sin(t * 0.12) * 0.16;
    if (b.current) b.current.rotation.z = 0.9 + Math.sin(t * 0.09 + 2) * 0.14;
  });
  return (
    <group position={[0, 1.2, 0]}>
      <mesh ref={a} geometry={geo} material={mats[0]} position={[-3.4, 4.6, -2.2]} rotation={[0.25, 0, 0.5]} />
      <mesh ref={b} geometry={geo} material={mats[1]} position={[3.6, 4.2, -3]} rotation={[0.2, 0, 0.9]} scale={[0.8, 1, 0.8]} />
    </group>
  );
}

/* ------------------------------ aroma particles ---------------------------- */

function AromaParticles({ ctrl, count }: { ctrl: React.MutableRefObject<HeroCtrl>; count: number }) {
  const ref = useRef<THREE.Points>(null);
  const { geo, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 0.4 + Math.random() * 2.2;
      const a = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = 0.2 + Math.random() * 3.2;
      positions[i * 3 + 2] = Math.sin(a) * r;
      speeds[i] = 0.12 + Math.random() * 0.3;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geo, speeds };
  }, [count]);
  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: new THREE.Color("#e8c9a0"),
        size: 0.05,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      }),
    [],
  );
  useEffect(() => {
    return () => {
      geo.dispose();
      mat.dispose();
    };
  }, [geo, mat]);
  useFrame((state, dt) => {
    mat.opacity = ctrl.current.aroma * 0.65;
    if (ctrl.current.aroma < 0.01 || !ref.current) return;
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      let y = pos.getY(i) + speeds[i] * dt * (0.6 + ctrl.current.aroma);
      if (y > 3.6) y = 0.2;
      pos.setY(i, y);
      pos.setX(i, pos.getX(i) + Math.sin(t * 0.6 + i) * 0.0006);
    }
    pos.needsUpdate = true;
  });
  return <points ref={ref} geometry={geo} material={mat} />;
}

/* --------------------------------- stage ----------------------------------- */

function Stage({ ctrl, isMobile, reduced }: { ctrl: React.MutableRefObject<HeroCtrl>; isMobile: boolean; reduced: boolean }) {
  const cupGroup = useRef<THREE.Group>(null);
  const steamRef = useRef(0.45);
  const boostRef = useRef(1);
  const liquidMesh = useRef<THREE.Mesh | null>(null);
  const liquidLevel = useRef(0.56);

  useFrame((state) => {
    const c = ctrl.current;
    steamRef.current = c.steam;
    boostRef.current = c.beanBoost;
    if (cupGroup.current) {
      cupGroup.current.rotation.y = (reduced ? 0.4 : state.clock.elapsedTime * 0.1) + c.cupRy;
      const floatY = reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.6) * 0.05;
      cupGroup.current.position.y = 0.05 + floatY;
    }
    // liquid fill during the pour scene
    const l = c.liquid;
    const level = 0.32 + l * 0.24;
    liquidLevel.current = level;
    if (liquidMesh.current) {
      liquidMesh.current.visible = l > 0.02;
      const s = 0.35 + l * 0.65;
      liquidMesh.current.scale.set(s, s, 1);
      liquidMesh.current.position.y = level;
    }
  });

  return (
    <>
      <group ref={cupGroup} position={[0, 0.05, 0]}>
        <CoffeeCup
          finish="ivory"
          liquid="espresso"
          steamIntensityRef={steamRef}
          liquidRef={(m) => (liquidMesh.current = m)}
          reducedMotion={reduced}
        />
        <CremaRing ctrl={ctrl} liquidLevel={liquidLevel} />
      </group>
      <PourRig ctrl={ctrl} />
      <LightRays ctrl={ctrl} />
      <AromaParticles ctrl={ctrl} count={isMobile ? 90 : 220} />
      <BeanField count={isMobile ? 34 : 90} boostRef={boostRef} reducedMotion={reduced} />
      {/* reflective obsidian floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <circleGeometry args={[18, 48]} />
        {isMobile ? (
          <meshStandardMaterial color="#080503" roughness={0.35} metalness={0.55} />
        ) : (
          <MeshReflectorMaterial
            blur={[280, 90]}
            resolution={1024}
            mixBlur={1}
            mixStrength={12}
            roughness={0.85}
            depthScale={0.9}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#070403"
            metalness={0.45}
            mirror={0.55}
          />
        )}
      </mesh>
    </>
  );
}

/* ------------------------------- canvas root ------------------------------- */

export default function HeroCanvas({
  ctrl,
  reduced,
  isMobile,
}: {
  ctrl: React.MutableRefObject<HeroCtrl>;
  reduced: boolean;
  isMobile: boolean;
}) {
  const webgl = useMemo(() => isWebGLAvailable(), []);
  if (!webgl) return <SceneFallback label="The Roast" tall />;
  return (
    <CanvasErrorBoundary fallback={<SceneFallback label="The Roast" tall />}>
      <Canvas
        shadows
        dpr={Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, isMobile ? 1.5 : 1.8)}
        camera={{ position: [0, 1.65, 9.2], fov: 42, near: 0.1, far: 60 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        aria-hidden="true"
      >
        <color attach="background" args={["#070403"]} />
        <fog attach="fog" args={["#070403", 10, 22]} />
        <Suspense fallback={null}>
          <CameraRig ctrl={ctrl} reduced={reduced} />
          <HeroLights ctrl={ctrl} />
          <Stage ctrl={ctrl} isMobile={isMobile} reduced={reduced} />
          <Environment resolution={128} frames={1}>
            <Lightformer intensity={5} position={[0, 5, -9]} rotation-x={Math.PI / 2} scale={[9, 1, 1]} color="#fff3df" />
            <Lightformer intensity={2.6} position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[12, 2, 1]} color="#ffd9ad" />
            <Lightformer intensity={2} position={[6, 2, 2]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} color="#c98246" />
          </Environment>
        </Suspense>
      </Canvas>
    </CanvasErrorBoundary>
  );
}
