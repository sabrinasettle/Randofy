"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";

function CollapsingCircles() {
  const groupRef = useRef();
  const rings = 8;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!groupRef.current) return;

    groupRef.current.children.forEach((circle, i) => {
      const scale = 0.8 + 0.15 * Math.sin(t * 2 + i);
      circle.scale.set(scale, scale, scale);
      circle.material.opacity = 0.3 + 0.5 * Math.sin(t * 2 + i * 0.5);
    });
  });

  return (
    // scale={2} makes all rings 2x larger
    <group ref={groupRef} scale={2}>
      {Array.from({ length: rings }).map((_, i) => (
        <mesh key={i}>
          <ringGeometry args={[i * 0.15 + 0.1, i * 0.15 + 0.13, 64]} />
          <meshBasicMaterial color="white" transparent opacity={0.6} side={2} />
        </mesh>
      ))}
    </group>
  );
}

export default function Loader({ isLoading }) {
  return (
    <div className="w-full flex items-center justify-center h-[80%]">
      <Canvas camera={{ position: [0, 0, 4], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <CollapsingCircles />
      </Canvas>
    </div>
  );
}
