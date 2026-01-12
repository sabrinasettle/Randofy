"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { useStyleContext } from "../../../context/style-context";
import { useMusicContext } from "../../../context/music-context";

export default function AlbumCarousel({}) {
  const mountRef = useRef(null);
  const { isMobile } = useStyleContext();
  const { musicContext } = useMusicContext();

  const [isLoading, setIsLoading] = useState(true);

  const songs = useMemo(
    () => musicContext.currentSongs,
    [musicContext.currentSongs],
  );

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);

  const targetIndexRef = useRef(musicContext.selectedSong.index ?? 0);
  const scrollIndexRef = useRef(musicContext.selectedSong.index ?? 0);

  // Prevent self-feedback loop when we commit selected song
  const lastSetIndexRef = useRef(-1);

  useEffect(() => {
    if (!hasMounted || !mountRef.current) return;

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

    if (!mountRef.current.contains(renderer.domElement)) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Touch gesture behavior (allow vertical page scroll, we preventDefault only while dragging)
    renderer.domElement.style.touchAction = "pan-y";

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

    // Loading state (avoid flicker by tracking count)
    let disposed = false;
    let loadedCount = 0;
    const totalToLoad = songs.length;

    setIsLoading(totalToLoad > 0);

    songs.forEach((song, index) => {
      const start = performance.now();

      loader.load(
        song.album_image.url,
        (texture) => {
          if (disposed) return;

          const end = performance.now();
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

          loadedCount += 1;
          if (loadedCount >= totalToLoad) setIsLoading(false);
        },
        undefined,
        (err) => {
          if (disposed) return;
          console.warn(`Texture load error for index ${index}:`, err);
          loadedCount += 1;
          if (loadedCount >= totalToLoad) setIsLoading(false);
        },
      );
    });

    // Interaction variables
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
        const newTarget = clampIndex(targetIndexRef.current - 1);
        targetIndexRef.current = newTarget; // ✅ always animate (no snap)
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        const newTarget = clampIndex(targetIndexRef.current + 1);
        targetIndexRef.current = newTarget; // ✅ always animate (no snap)
      }
    };
    window.addEventListener("keydown", onKeyDown);

    const onWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY + e.deltaX * 0.4;
      wheelAccum += delta;

      if (wheelAccum > wheelThreshold) {
        const newTarget = clampIndex(targetIndexRef.current + 1);
        targetIndexRef.current = newTarget; // ✅ always animate (no snap)
        wheelAccum = 0;
      } else if (wheelAccum < -wheelThreshold) {
        const newTarget = clampIndex(targetIndexRef.current - 1);
        targetIndexRef.current = newTarget; // ✅ always animate (no snap)
        wheelAccum = 0;
      }
    };

    const onPointerDown = (e) => {
      isDragging = true;
      startX = e.touches?.[0]?.clientX ?? e.clientX ?? 0;
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;

      // Stop the page from stealing the swipe (touch only)
      if (e.cancelable) e.preventDefault();

      const x = e.touches?.[0]?.clientX ?? e.clientX ?? startX;
      const delta = (x - startX) * -0.005;
      dragOffset += delta;
      startX = x;

      const proposed = targetIndexRef.current + dragOffset;
      if (proposed < 0) dragOffset = -targetIndexRef.current;
      if (proposed > songs.length - 1) {
        dragOffset = songs.length - 1 - targetIndexRef.current;
      }
    };

    const onPointerUp = () => {
      if (!isDragging) return;
      isDragging = false;

      let newTarget = Math.round(targetIndexRef.current + dragOffset);
      newTarget = clampIndex(newTarget);

      targetIndexRef.current = newTarget; // ✅ always animate (no snap)
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
          console.log(`Clicked on plane ${clickedIndex}`);
          targetIndexRef.current = clickedIndex; // ✅ always animate (no snap)
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
        planes.indexOf(intersects[0].object) !==
          Math.round(scrollIndexRef.current)
          ? "pointer"
          : "default";
    };

    // ✅ TOUCH DRAG
    renderer.domElement.addEventListener("touchstart", onPointerDown, {
      passive: true,
    });
    renderer.domElement.addEventListener("touchmove", onPointerMove, {
      passive: false,
    });
    renderer.domElement.addEventListener("touchend", onPointerUp);

    // ✅ Desktop interactions
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });
    renderer.domElement.addEventListener("click", onClick);
    renderer.domElement.addEventListener("mousemove", onPointerMoveCursor);

    // --- Feel tuning (fix Scott feedback) ---
    // 1-step should be snappy; big jumps should not teleport or feel violent.
    const minSpeed = 0.1; // faster than your old 0.07
    const maxSpeed = 0.18; // capped
    const maxStepPerFrame = 0.22; // cap per-frame motion so 3+ doesn't feel aggressive
    const COMMIT_EPS = 0.03; // commit selection only when nearly settled & not dragging

    let lastReportedIndex = -1;

    const animate = () => {
      if (disposed) return;
      requestAnimationFrame(animate);

      const desiredIndex = targetIndexRef.current + dragOffset;

      // Distance-based easing + per-frame cap
      const delta = desiredIndex - scrollIndexRef.current;
      const dist = Math.abs(delta);

      const speed = THREE.MathUtils.lerp(
        minSpeed,
        maxSpeed,
        Math.min(dist / 1.5, 1),
      );
      const step = THREE.MathUtils.clamp(
        delta * speed,
        -maxStepPerFrame,
        maxStepPerFrame,
      );
      scrollIndexRef.current += step;

      const floorIndex = Math.floor(scrollIndexRef.current);
      const blend = scrollIndexRef.current - floorIndex;

      // ✅ Commit selected song only when settled (reduces rapid updates on multi-step moves)
      const isSettled =
        !isDragging &&
        Math.abs(scrollIndexRef.current - targetIndexRef.current) < COMMIT_EPS;

      if (isSettled && songs.length > 0) {
        let commitIndex = Math.round(targetIndexRef.current);
        commitIndex = clampIndex(commitIndex);

        if (commitIndex !== lastReportedIndex) {
          lastReportedIndex = commitIndex;
          lastSetIndexRef.current = commitIndex;

          musicContext.setSelectedSong({
            index: commitIndex,
            song: songs[commitIndex],
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

        plane.position.x = pos - scrollIndexRef.current * baseSpacing;

        const offset = i - scrollIndexRef.current;
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
      disposed = true;

      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);

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
  }, [hasMounted, songs, isMobile]);

  // Sync external selectedSong -> carousel target (always animate)
  useEffect(() => {
    const index = musicContext.selectedSong.index;
    if (!songs.length) return;

    if (index !== undefined && index !== lastSetIndexRef.current) {
      targetIndexRef.current = Math.max(0, Math.min(songs.length - 1, index));
    }
  }, [musicContext.selectedSong.index, songs.length]);

  return (
    <div className="flex justify-center">
      <p className="text-gray-000">{isLoading && "Loading..."}</p>
      <div
        ref={mountRef}
        className="flex items-center justify-center w-full h-[34vh] xs:h-[36vh] sm:h-[38vh] md:h-[40vh] lg:h-[45vh] xl:h-[48vh] bg-transparent overflow-hidden relative"
      />
    </div>
  );
}
