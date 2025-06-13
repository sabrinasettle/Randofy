"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function LoadingBall({ isLoading }) {
  const mountRef = useRef();
  const [readyToHide, setReadyToHide] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    // Central sphere
    const sphereGeom = new THREE.SphereGeometry(10, 64, 64);
    const sphereMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const sphereMesh = new THREE.Mesh(sphereGeom, sphereMat);
    scene.add(sphereMesh);

    // Particles
    const maxParticles = 100;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(maxParticles * 3);
    const sizes = new Float32Array(maxParticles);
    particleGeom.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    particleGeom.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 5,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    const attrs = Array.from({ length: maxParticles }).map(() => ({
      pos: new THREE.Vector3(),
      vel: new THREE.Vector3(),
      size: Math.random() * 5 + 3,
    }));

    let mode = "idle";
    let t = 0;
    let wasLoading = false;
    let gatherStart = null;
    const spread = 40;

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    const explode = () => {
      attrs.forEach((a) => {
        a.pos.set(0, 0, 0);
        const dir = new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5,
        ).normalize();
        const speed = Math.random() * 20 + 10;
        a.vel.copy(dir.multiplyScalar(speed));
      });
    };

    const animate = () => {
      t += 0.016;

      if (mode === "idle") {
        sphereMesh.visible = true;
        particles.visible = false;

        if (isLoading) {
          explode();
          mode = "explode";
          t = 0;
        }
      } else {
        sphereMesh.visible = false;
        particles.visible = true;

        // Switch to gather if loading is ending
        if (wasLoading && !isLoading && mode === "float") {
          mode = "gather";
          gatherStart = performance.now();
        }

        attrs.forEach((a, i) => {
          if (mode === "explode") {
            a.pos.addScaledVector(a.vel, 0.016);
            if (a.pos.length() > spread) mode = "float";
          } else if (mode === "float") {
            a.pos.add(
              new THREE.Vector3(
                Math.sin(t * 1.5 + i) * 0.2,
                Math.cos(t * 1.5 + i * 1.3) * 0.2,
                Math.sin(t * 1.2 + i * 0.7) * 0.2,
              ),
            );
          } else if (mode === "gather") {
            a.pos.lerp(new THREE.Vector3(0, 0, 0), 0.08);
          }

          positions.set([a.pos.x, a.pos.y, a.pos.z], i * 3);
          sizes[i] = a.size * (1 - Math.min(a.pos.length() / spread, 1));
        });

        particleGeom.attributes.position.needsUpdate = true;

        // Finish gather and reset to idle
        if (mode === "gather" && performance.now() - gatherStart > 1000) {
          mode = "idle";
          setReadyToHide(true);
        }
      }

      wasLoading = isLoading;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", onResize);
      if (mount && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isLoading]);

  return (
    <div
      ref={mountRef}
      style={{
        width: readyToHide && !isLoading ? 0 : "200px",
        height: readyToHide && !isLoading ? 0 : "200px",
        transition: "all 0.4s ease",
        overflow: "hidden",
        borderRadius: "100%",
        touchAction: "none",
      }}
    />
  );
}
