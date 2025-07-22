"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function LoadingBall({ isLoading }) {
  const mountRef = useRef();
  const [readyToHide, setReadyToHide] = useState(false);

  function createCircleTexture() {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );
    gradient.addColorStop(0, "white");
    gradient.addColorStop(1, "transparent");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 150;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    // Central sphere
    const sphereGeom = new THREE.SphereGeometry(15, 64, 64);
    const sphereMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const sphereMesh = new THREE.Mesh(sphereGeom, sphereMat);
    scene.add(sphereMesh);

    // Particles
    const maxParticles = 120;
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
      size: 6,
      sizeAttenuation: true,
      transparent: true,
      alphaTest: 0.1,
      map: createCircleTexture(),
      depthWrite: false,
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
    let regroupTimer = 0;
    const spread = 60;

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
        const speed = Math.random() * 25 + 15;
        a.vel.copy(dir.multiplyScalar(speed));
      });
    };

    const animate = () => {
      t += 0.016;
      regroupTimer += 0.016;

      if (mode === "idle") {
        sphereMesh.visible = true;
        particles.visible = false;

        if (isLoading) {
          explode();
          mode = "explode";
          t = 0;
          regroupTimer = 0;
        }
      } else {
        sphereMesh.visible = false;
        particles.visible = true;

        if (wasLoading && !isLoading && mode === "float") {
          mode = "gather";
          gatherStart = performance.now();
        }

        if (mode === "float" && regroupTimer > 4) {
          mode = "gather";
          gatherStart = performance.now();
          regroupTimer = 0;
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

        if (mode === "gather" && performance.now() - gatherStart > 1000) {
          mode = isLoading ? "float" : "idle";
          if (!isLoading) setReadyToHide(true);
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
        width: readyToHide && !isLoading ? 0 : "300px",
        height: readyToHide && !isLoading ? 0 : "300px",
        transition: "all 0.4s ease",
        overflow: "hidden",
        borderRadius: "100%",
        touchAction: "none",
      }}
    />
  );
}
