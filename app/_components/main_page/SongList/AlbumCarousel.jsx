"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function AlbumCarousel({ songs }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // Load textures & planes
    const loader = new THREE.TextureLoader();
    const planes = [];

    const spacing = 2.8;
    const angle = -0.5;

    songs.forEach((song) => {
      const texture = loader.load(song.album_image.url);
      const geometry = new THREE.PlaneGeometry(2, 2); // square
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });
      const plane = new THREE.Mesh(geometry, material);
      scene.add(plane);
      planes.push(plane);
    });

    // Interaction
    let scrollIndex = 0;
    let targetIndex = 0;
    let isDragging = false;
    let startX = 0;
    let dragOffset = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      startX = e.clientX || e.touches?.[0].clientX;
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const x = e.clientX || e.touches?.[0].clientX;
      const delta = (x - startX) * -0.005;
      dragOffset += delta;
      startX = x;

      // Do not allow dragging beyond ends
      const proposed = targetIndex + dragOffset;
      if (proposed < 0) dragOffset = -targetIndex;
      if (proposed > songs.length - 1)
        dragOffset = songs.length - 1 - targetIndex;
    };

    const onPointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      // Snap targetIndex to nearest slot:
      targetIndex = Math.round(targetIndex + dragOffset);
      dragOffset = 0;
    };

    const onWheel = (e) => {
      e.preventDefault();
      // Use deltaX or deltaY, normalize it to steps:
      let delta = e.deltaY || e.deltaX;

      // Use threshold so tiny flicks don’t jump:
      if (delta > 10) {
        targetIndex += 1;
      } else if (delta < -10) {
        targetIndex -= 1;
      }

      // Clamp to bounds:
      targetIndex = Math.max(0, Math.min(songs.length - 1, targetIndex));
    };

    renderer.domElement.addEventListener("mousedown", onPointerDown);
    renderer.domElement.addEventListener("mousemove", onPointerMove);
    renderer.domElement.addEventListener("mouseup", onPointerUp);
    renderer.domElement.addEventListener("mouseleave", onPointerUp);

    renderer.domElement.addEventListener("touchstart", onPointerDown);
    renderer.domElement.addEventListener("touchmove", onPointerMove);
    renderer.domElement.addEventListener("touchend", onPointerUp);

    renderer.domElement.addEventListener("wheel", onWheel);

    // Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // Animate
    const speed = 1.3; // was 0.1 → slower for smoother snap

    const animate = () => {
      requestAnimationFrame(animate);

      const desiredIndex = targetIndex + dragOffset;
      scrollIndex += (desiredIndex - scrollIndex) * speed;

      planes.forEach((plane, i) => {
        const offset = i - scrollIndex;
        plane.position.x = offset * spacing;
        plane.rotation.y = offset * angle;
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
      window.removeEventListener("resize", onResize);
    };
  }, [songs]);

  return (
    <div
      ref={mountRef}
      className="w-full h-screen bg-black overflow-hidden relative"
    />
  );
}
