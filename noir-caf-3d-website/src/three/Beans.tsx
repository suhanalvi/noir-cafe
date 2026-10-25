import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { mulberry32 } from "../lib/hooks";

interface BeanDatum {
  angle0: number;
  radius: number;
  y: number;
  speed: number;
  bob: number;
  bobSpeed: number;
  scale: number;
  rx: number;
  ry: number;
  rz: number;
}

/** Procedural coffee-bean geometry: squashed sphere with a signature crease. */
function makeBeanGeometry(): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(0.1, 22, 16);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);
    // oval squash
    y *= 0.6;
    z *= 0.78;
    // crease along the top
    const groove = Math.exp(-Math.pow(z / 0.02, 2)) * 0.028 * THREE.MathUtils.smoothstep(y, 0.005, 0.055);
    y -= groove;
    // slight bean curl
    x += Math.sign(x) * Math.pow(Math.abs(y), 1.6) * 0.25;
    pos.setXYZ(i, x, y, z);
  }
  geo.computeVertexNormals();
  return geo;
}

export function BeanField({
  count = 90,
  boostRef,
  inner = 1.15,
  outer = 2.9,
  yMin = 0.15,
  yMax = 3.1,
  reducedMotion = false,
  seed = 7,
}: {
  count?: number;
  boostRef?: React.MutableRefObject<number>;
  inner?: number;
  outer?: number;
  yMin?: number;
  yMax?: number;
  reducedMotion?: boolean;
  seed?: number;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const geo = useMemo(() => makeBeanGeometry(), []);
  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#472818"),
        roughness: 0.52,
        clearcoat: 0.5,
        clearcoatRoughness: 0.45,
        envMapIntensity: 0.7,
      }),
    [],
  );

  useEffect(() => {
    return () => {
      geo.dispose();
      mat.dispose();
    };
  }, [geo, mat]);

  const beans = useMemo<BeanDatum[]>(() => {
    const rnd = mulberry32(seed);
    const arr: BeanDatum[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        angle0: rnd() * Math.PI * 2,
        radius: inner + rnd() * (outer - inner),
        y: yMin + rnd() * (yMax - yMin),
        speed: (0.12 + rnd() * 0.25) * (rnd() > 0.5 ? 1 : -1),
        bob: 0.06 + rnd() * 0.18,
        bobSpeed: 0.4 + rnd() * 0.8,
        scale: 0.55 + rnd() * 0.75,
        rx: rnd() * Math.PI,
        ry: rnd() * Math.PI,
        rz: rnd() * Math.PI,
      });
    }
    return arr;
  }, [count, inner, outer, yMin, yMax, seed]);

  const tmp = useMemo(
    () => ({
      m: new THREE.Matrix4(),
      q: new THREE.Quaternion(),
      e: new THREE.Euler(),
      v: new THREE.Vector3(),
      s: new THREE.Vector3(),
    }),
    [],
  );

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    const boost = boostRef ? boostRef.current : 1;
    for (let i = 0; i < beans.length; i++) {
      const b = beans[i];
      const ang = b.angle0 + t * b.speed * boost;
      // radius tightens slightly as boost rises (beans spiral inward while roasting)
      const r = b.radius * (1 - Math.min(0.32, Math.max(0, boost - 1) * 0.1));
      tmp.v.set(Math.cos(ang) * r, b.y + Math.sin(t * b.bobSpeed + b.angle0) * b.bob, Math.sin(ang) * r);
      tmp.e.set(b.rx + t * 0.35 * boost, b.ry + t * 0.5 * b.speed * boost, b.rz);
      tmp.q.setFromEuler(tmp.e);
      tmp.s.setScalar(b.scale);
      tmp.m.compose(tmp.v, tmp.q, tmp.s);
      mesh.setMatrixAt(i, tmp.m);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={meshRef} args={[geo, mat, count]} frustumCulled={false} />;
}
