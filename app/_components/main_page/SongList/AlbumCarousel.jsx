"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useSongViewContext } from "../../../context/song-view-context";

export default function AlbumCarousel({ songs, onIndexChange }) {
  const mountRef = useRef(null);
  const { songViewContext } = useSongViewContext();
  const isMobile = songViewContext.isMobile;
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Prevent running setup on the first Strict Mode cycle
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted || !mountRef.current) return;

    let isMounted = true;

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

    // ✅ Prevent duplicate canvas
    if (!mountRef.current.contains(renderer.domElement)) {
      mountRef.current.appendChild(renderer.domElement);
    }

    scene.add(new THREE.AmbientLight(0xffffff, 1));

    const loader = new THREE.TextureLoader();
    const planes = [];
    const planeScales = [];

    const planeSize = isMobile ? 2.3 : 2.8;
    const unActivePlaneSize = isMobile ? 2 : 2.4;
    const baseSpacing = planeSize * 0.3;
    const extraGap = isMobile ? 1.8 : 2;
    const halfGap = extraGap / 2;
    const maxAngle = 1.5;

    songs.forEach((song, index) => {
      const start = performance.now();
      setIsLoading(true);

      loader.load(
        song.album_image.url,
        (texture) => {
          const end = performance.now();
          setIsLoading(false);
          console.log(`Image ${index} loaded in ${Math.round(end - start)}ms`);

          const geometry = new THREE.PlaneGeometry(planeSize, planeSize);
          const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true,
          });

          const plane = new THREE.Mesh(geometry, material);
          scene.add(plane);
          planes[index] = plane;
          planeScales[index] = 1;
        },
        undefined,
        (err) => {
          console.warn(`Texture load error for index ${index}:`, err);
        },
      );
      // loader.load(
      //   song.album_image.url,
      //   (texture) => {
      //     // if (!isMounted) return;

      //     const geometry = new THREE.PlaneGeometry(planeSize, planeSize);
      //     const material = new THREE.MeshBasicMaterial({
      //       map: texture,
      //       side: THREE.DoubleSide,
      //       transparent: true,
      //     });

      //     const plane = new THREE.Mesh(geometry, material);
      //     scene.add(plane);
      //     planes[index] = plane;
      //     planeScales[index] = 1;
      //   },
      //   undefined,
      //   (err) => console.warn("Texture load error:", err),
      // );
    });

    let scrollIndex = 0;
    let targetIndex = 0;
    let isDragging = false;
    let startX = 0;
    let dragOffset = 0;
    let wheelAccum = 0;
    const wheelThreshold = 18;

    const clampIndex = (index) =>
      Math.max(0, Math.min(songs.length - 1, index));

    const onKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        targetIndex = clampIndex(targetIndex - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        targetIndex = clampIndex(targetIndex + 1);
      }
    };
    window.addEventListener("keydown", onKeyDown);

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

      targetIndex = clampIndex(targetIndex);
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

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    const onPointerMoveCursor = (e) => {
      if (isDragging) {
        renderer.domElement.style.cursor = "grabbing";
        return;
      }

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planes);

      renderer.domElement.style.cursor =
        intersects.length > 0 &&
        planes.indexOf(intersects[0].object) !== Math.round(scrollIndex)
          ? "pointer"
          : "default";
    };

    renderer.domElement.addEventListener("mousedown", onPointerDown);
    renderer.domElement.addEventListener("mousemove", onPointerMove);
    renderer.domElement.addEventListener("mouseup", onPointerUp);
    renderer.domElement.addEventListener("mouseleave", onPointerUp);
    renderer.domElement.addEventListener("touchstart", onPointerDown);
    renderer.domElement.addEventListener("touchmove", onPointerMove);
    renderer.domElement.addEventListener("touchend", onPointerUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });
    renderer.domElement.addEventListener("click", onClick);
    renderer.domElement.addEventListener("mousemove", onPointerMoveCursor);

    const speed = 0.07;
    let lastReportedIndex = -1;

    const animate = () => {
      // if (!isMounted) return;
      requestAnimationFrame(animate);

      const desiredIndex = targetIndex + dragOffset;
      scrollIndex += (desiredIndex - scrollIndex) * speed;

      const floorIndex = Math.floor(scrollIndex);
      const blend = scrollIndex - floorIndex;

      const currentIndex = Math.round(scrollIndex);
      if (currentIndex !== lastReportedIndex) {
        lastReportedIndex = currentIndex;
        if (onIndexChange) {
          onIndexChange(currentIndex);
          songViewContext.setSelectedSong({
            index: currentIndex,
            song: songs[currentIndex],
          });
        }
      }

      planes.forEach((plane, i) => {
        if (!plane) return;

        let pos = i * baseSpacing;
        if (i < floorIndex) pos -= halfGap;
        else if (i > floorIndex + 1) pos += halfGap;
        if (i === floorIndex) pos -= halfGap * blend;
        else if (i === floorIndex + 1) pos += halfGap * (1 - blend);

        plane.position.x = pos - scrollIndex * baseSpacing;

        const offset = i - scrollIndex;
        const sign = offset < 0 ? 1 : -1;
        const t = THREE.MathUtils.clamp(Math.abs(offset), 0, 1);

        const targetRotation =
          Math.abs(offset) < 0.01
            ? 0
            : THREE.MathUtils.lerp(0, sign * maxAngle, t);
        plane.rotation.y = THREE.MathUtils.lerp(
          plane.rotation.y,
          targetRotation,
          0.1,
        );

        const distance = Math.abs(offset);
        const scaleRatio = unActivePlaneSize / planeSize;
        const targetScale =
          distance < 0.1
            ? 1
            : THREE.MathUtils.lerp(1, scaleRatio, Math.min(distance, 1));
        planeScales[i] = THREE.MathUtils.lerp(planeScales[i], targetScale, 0.1);
        plane.scale.setScalar(planeScales[i]);
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      isMounted = false;

      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener("mousedown", onPointerDown);
      renderer.domElement.removeEventListener("mousemove", onPointerMove);
      renderer.domElement.removeEventListener("mouseup", onPointerUp);
      renderer.domElement.removeEventListener("mouseleave", onPointerUp);
      renderer.domElement.removeEventListener("touchstart", onPointerDown);
      renderer.domElement.removeEventListener("touchmove", onPointerMove);
      renderer.domElement.removeEventListener("touchend", onPointerUp);
      renderer.domElement.removeEventListener("wheel", onWheel);
      renderer.domElement.removeEventListener("click", onClick);
      renderer.domElement.removeEventListener("mousemove", onPointerMoveCursor);

      if (
        mountRef.current &&
        renderer.domElement.parentNode === mountRef.current
      ) {
        mountRef.current.removeChild(renderer.domElement);
      }

      planes.forEach((plane) => {
        if (plane?.geometry) plane.geometry.dispose();
        if (plane?.material?.map) plane.material.map.dispose();
        if (plane?.material) plane.material.dispose();
        scene.remove(plane);
      });

      renderer.dispose();
    };
  }, [hasMounted, songs, isMobile, onIndexChange]);

  return (
    <div className="flex justify-center">
      <p className="text-gray-000">{isLoading && "Loading..."}</p>
      <div
        ref={mountRef}
        className="flex items-center justify-center w-full h-[34vh] lg:h-[45vh] bg-transparent overflow-hidden relative"
      />
    </div>
  );
}
