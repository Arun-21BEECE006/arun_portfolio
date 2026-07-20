import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Icosahedron, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// Wireframe core: reacts to pointer position with a gentle look-at tilt.
function Core({ pointer }) {
  const meshRef = useRef();
  const innerRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        pointer.current.y * 0.4,
        0.04
      );
      meshRef.current.rotation.z = THREE.MathUtils.lerp(
        meshRef.current.rotation.z,
        pointer.current.x * 0.3,
        0.04
      );
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * 0.25;
    }
  });

  return (
    <group>
      <Icosahedron ref={meshRef} args={[1.6, 2]}>
        <meshBasicMaterial color="#4FD1C5" wireframe transparent opacity={0.55} />
      </Icosahedron>
      <Icosahedron ref={innerRef} args={[0.9, 1]}>
        <meshBasicMaterial color="#FFB454" wireframe transparent opacity={0.35} />
      </Icosahedron>
    </group>
  );
}

// Ambient particle field orbiting the core.
function ParticleField() {
  const ref = useRef();
  const count = 500;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 2.6 + Math.random() * 1.8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.03;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#7FE3D8"
        size={0.02}
        sizeAttenuation
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

function Scene() {
  const pointer = useRef({ x: 0, y: 0 });

  const handlePointer = (e) => {
    const x = ("touches" in e ? e.touches[0]?.clientX : e.clientX) ?? 0;
    const y = ("touches" in e ? e.touches[0]?.clientY : e.clientY) ?? 0;
    pointer.current = {
      x: (x / window.innerWidth) * 2 - 1,
      y: (y / window.innerHeight) * 2 - 1,
    };
  };

  return (
    <group
      onPointerMove={handlePointer}
      onTouchMove={handlePointer}
    >
      <Core pointer={pointer} />
      <ParticleField />
    </group>
  );
}

export default function AISphere({ className = "" }) {
  return (
    <div
      className={className}
      onPointerMove={() => {}}
      style={{ touchAction: "none" }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
