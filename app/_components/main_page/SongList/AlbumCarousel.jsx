"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useSongViewContext } from "../../../context/song-view-context";

export default function AlbumCarousel({ songs }) {
  const mountRef = useRef(null);
  const { songViewContext } = useSongViewContext();
  const isMobile = songViewContext.isMobile;

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

    scene.add(new THREE.AmbientLight(0xffffff, 1));

    const loader = new THREE.TextureLoader();
    const planes = [];

    const baseSpacing = 0.9; // tight stack
    const extraGap = isMobile ? 0.8 : 1.4;
    const halfGap = extraGap / 2;
    const maxAngle = 1.5;
    const planeSize = isMobile ? 1.3 : 2;

    songs.forEach((song) => {
      const texture = loader.load(song.album_image.url);
      const geometry = new THREE.PlaneGeometry(planeSize, planeSize);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
      });
      const plane = new THREE.Mesh(geometry, material);
      scene.add(plane);
      planes.push(plane);
    });

    let scrollIndex = 0;
    let targetIndex = 0;
    let isDragging = false;
    let startX = 0;
    let dragOffset = 0;

    let wheelAccum = 0;
    const wheelThreshold = 18;

    const onWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY + e.deltaX * 0.4;
      wheelAccum += delta;

      if (wheelAccum > wheelThreshold) {
        targetIndex += 1;
        wheelAccum = 0;
      } else if (wheelAccum < -wheelThreshold) {
        targetIndex -= 1;
        wheelAccum = 0;
      }

      targetIndex = Math.max(0, Math.min(songs.length - 1, targetIndex));
    };

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

      const proposed = targetIndex + dragOffset;
      if (proposed < 0) dragOffset = -targetIndex;
      if (proposed > songs.length - 1)
        dragOffset = songs.length - 1 - targetIndex;
    };

    const onPointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      targetIndex = Math.round(targetIndex + dragOffset);
      dragOffset = 0;
    };

    // === Raycaster for click ===
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planes);

      if (intersects.length > 0) {
        const clickedPlane = intersects[0].object;
        const clickedIndex = planes.indexOf(clickedPlane);
        if (clickedIndex !== -1) {
          targetIndex = clickedIndex;
        }
      }
    };

    // === Events ===
    renderer.domElement.addEventListener("mousedown", onPointerDown);
    renderer.domElement.addEventListener("mousemove", onPointerMove);
    renderer.domElement.addEventListener("mouseup", onPointerUp);
    renderer.domElement.addEventListener("mouseleave", onPointerUp);

    renderer.domElement.addEventListener("touchstart", onPointerDown);
    renderer.domElement.addEventListener("touchmove", onPointerMove);
    renderer.domElement.addEventListener("touchend", onPointerUp);

    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });
    renderer.domElement.addEventListener("click", onClick);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    const speed = 0.07;

    const animate = () => {
      requestAnimationFrame(animate);

      const desiredIndex = targetIndex + dragOffset;
      scrollIndex += (desiredIndex - scrollIndex) * speed;

      const floorIndex = Math.floor(scrollIndex);
      const blend = scrollIndex - floorIndex;

      planes.forEach((plane, i) => {
        let pos = i * baseSpacing;

        if (i < floorIndex) {
          pos -= halfGap;
        } else if (i > floorIndex + 1) {
          pos += halfGap;
        }

        if (i === floorIndex) {
          pos -= halfGap * blend;
        } else if (i === floorIndex + 1) {
          pos += halfGap * (1 - blend);
        }

        plane.position.x = pos - scrollIndex * baseSpacing;

        const offset = i - scrollIndex;
        const sign = offset < 0 ? 1 : -1;
        const t = THREE.MathUtils.clamp(Math.abs(offset), 0, 1);
        plane.rotation.y = THREE.MathUtils.lerp(0, sign * maxAngle, t);

        if (Math.abs(offset) < 0.01) {
          plane.rotation.y = 0;
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (
        mountRef.current &&
        renderer.domElement.parentNode === mountRef.current
      ) {
        mountRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener("resize", onResize);
    };
  }, [songs, isMobile]);

  return (
    <div
      ref={mountRef}
      className="w-full h-screen bg-transparent overflow-hidden relative"
    />
  );
}
