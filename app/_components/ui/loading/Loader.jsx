"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function EnhancedCollapsingCircles() {
  const groupRef = useRef();
  const rings = 20;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!groupRef.current) return;

    // Global wave that affects all rings together for cohesion
    const globalPulse = Math.sin(t * 1.5);
    const globalBreath = Math.sin(t * 0.8);
    const globalIntensity = 0.7 + 0.3 * Math.sin(t * 0.6);

    groupRef.current.children.forEach((circle, i) => {
      // Cohesive scaling - all rings pulse together with slight phase offsets
      const ringPhase = i * 0.3; // Small phase difference between rings
      const cohesiveScale =
        0.8 + 0.4 * globalPulse * Math.sin(t * 2 + ringPhase);
      const breathScale = 1 + 0.15 * globalBreath;
      const finalScale = cohesiveScale * breathScale;

      circle.scale.set(finalScale, finalScale, finalScale);

      // Synchronized opacity waves
      const ringOpacity =
        0.2 + 0.6 * globalIntensity * Math.abs(Math.sin(t * 1.8 + ringPhase));
      circle.material.opacity = Math.max(0.05, ringOpacity);

      // Unified rotation - all rings rotate together
      circle.rotation.z = t * 0.4 + ringPhase;

      // Subtle cohesive Z movement
      circle.position.z = Math.sin(t * 1.2 + ringPhase) * 0.1 * globalPulse;
    });

    // Smooth, unified group rotation
    groupRef.current.rotation.z = t * 0.2;

    // Gentle breathing motion for the entire group
    const groupScale = 1 + 0.1 * globalBreath;
    groupRef.current.scale.set(
      groupScale * 2.5,
      groupScale * 2.5,
      groupScale * 2.5,
    );
  });

  return (
    <group ref={groupRef} scale={2.5}>
      {Array.from({ length: rings }).map((_, i) => (
        <mesh key={i}>
          <ringGeometry args={[i * 0.08 + 0.06, i * 0.08 + 0.08, 64]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

function ParticleField() {
  const particlesRef = useRef();
  const particleCount = 100;

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 8 + 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 2;

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!particlesRef.current) return;

    // Global particle motion that's more cohesive
    const globalWave = Math.sin(t * 0.8);

    const positions = particlesRef.current.geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const originalX = positions[i3];
      const originalY = positions[i3 + 1];
      const originalZ = positions[i3 + 2];

      // Synchronized particle movement
      positions[i3] =
        originalX + Math.sin(t * 1.2 + i * 0.1) * 0.15 * globalWave;
      positions[i3 + 1] =
        originalY + Math.cos(t * 1.0 + i * 0.1) * 0.15 * globalWave;
      positions[i3 + 2] =
        originalZ + Math.sin(t * 0.6 + i * 0.1) * 0.2 * globalWave;
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#ffffff"
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function Loader({ isLoading }) {
  return (
    <div className="w-full flex items-center justify-center h-[80%]">
      <Canvas
        camera={{ position: [0, 0, 14], fov: 50 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={0.5} />

        <EnhancedCollapsingCircles />
        <ParticleField />
      </Canvas>
    </div>
  );
}
