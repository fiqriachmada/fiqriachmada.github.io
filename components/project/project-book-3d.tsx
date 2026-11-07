"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import type { ProjectApiItem } from "@/types/api";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Maximize2,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Hand,
} from "lucide-react";

export function ProjectBook3D({ projects = [] }: { projects?: ProjectApiItem[] }) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const zoomRef = useRef(1);
  const panRef = useRef({ x: 0, y: 0 });

  const updateZoom = useCallback((updater: number | ((prev: number) => number)) => {
    setZoomLevel((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      const clamped = Math.min(Math.max(Number(next.toFixed(2)), 0.6), 2.5);
      zoomRef.current = clamped;
      if (clamped <= 1) panRef.current = { x: 0, y: 0 };
      return clamped;
    });
  }, []);

  const totalPages = (projects.length || 0) + 1; // +1 for cover
  const activeProject = currentPage > 0 ? projects[currentPage - 1] : null;

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const bookGroupRef = useRef<THREE.Group | null>(null);
  const pagesMeshRef = useRef<THREE.Object3D[]>([]);

  const handleNext = useCallback(() => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  }, [totalPages]);

  const handlePrev = useCallback(() => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 1.8 / zoomRef.current, 4.2 / zoomRef.current);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 3. Lighting (balanced for open book)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff8e7, 1.8);
    dirLight.position.set(3, 5, 4);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const leftFillLight = new THREE.DirectionalLight(0xffffff, 1.5);
    leftFillLight.position.set(-3, 4, 3);
    scene.add(leftFillLight);

    const fillLight = new THREE.DirectionalLight(0x90b0ff, 0.8);
    fillLight.position.set(0, 3, -2);
    scene.add(fillLight);

    // 4. Book Mesh Construction
    const bookGroup = new THREE.Group();
    bookGroupRef.current = bookGroup;
    scene.add(bookGroup);

    // Shadow plane
    const planeGeo = new THREE.PlaneGeometry(10, 10);
    const planeMat = new THREE.ShadowMaterial({ opacity: 0.15 });
    const shadowPlane = new THREE.Mesh(planeGeo, planeMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.05;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Spine
    const spineGeo = new THREE.CylinderGeometry(
      0.08,
      0.08,
      2.2,
      16,
      1,
      true,
      -Math.PI / 2,
      Math.PI
    );
    const spineMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.4,
      metalness: 0.2,
    });
    const spine = new THREE.Mesh(spineGeo, spineMat);
    spine.rotation.x = Math.PI / 2;
    spine.rotation.z = Math.PI / 2;
    bookGroup.add(spine);

    // Left & Right Book Covers (inner face is clean paper)
    const coverWidth = 1.6;
    const coverHeight = 2.2;
    const coverDepth = 0.04;

    const coverOuterMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.3,
      metalness: 0.1,
    });
    const coverInnerMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.5,
    });

    const leftCoverMat = [coverOuterMat, coverOuterMat, coverInnerMat, coverOuterMat, coverOuterMat, coverOuterMat];
    const rightCoverMat = [coverOuterMat, coverOuterMat, coverInnerMat, coverOuterMat, coverOuterMat, coverOuterMat];

    const leftCover = new THREE.Mesh(
      new THREE.BoxGeometry(coverWidth, coverDepth, coverHeight),
      leftCoverMat
    );
    leftCover.position.set(-coverWidth / 2 - 0.05, -coverDepth / 2, 0);
    leftCover.castShadow = true;
    leftCover.receiveShadow = true;
    bookGroup.add(leftCover);

    const rightCover = new THREE.Mesh(
      new THREE.BoxGeometry(coverWidth, coverDepth, coverHeight),
      rightCoverMat
    );
    rightCover.position.set(coverWidth / 2 + 0.05, -coverDepth / 2, 0);
    rightCover.castShadow = true;
    rightCover.receiveShadow = true;
    bookGroup.add(rightCover);

    // Helper canvas texture generator for pages
    function createPageTexture(title: string, subtitle: string, isCover = false) {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 1400;
      const ctx = canvas.getContext("2d");
      if (!ctx) return new THREE.CanvasTexture(canvas);

      // Paper background
      ctx.fillStyle = isCover ? "#0f172a" : "#fbfbfb";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (isCover) {
        // Gold foil border
        ctx.strokeStyle = "#fbbf24";
        ctx.lineWidth = 14;
        ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 4;
        ctx.strokeRect(90, 90, canvas.width - 180, canvas.height - 180);

        // Badge / Monogram
        ctx.fillStyle = "#fbbf24";
        ctx.font = "bold 44px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("✦ YEARBOOK PORTFOLIO ✦", canvas.width / 2, 380);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 82px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText("PROJECTS", canvas.width / 2, 580);
        ctx.fillText("CHRONICLE", canvas.width / 2, 690);

        ctx.fillStyle = "#94a3b8";
        ctx.font = "34px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText("BUKU KENANGAN KARYA & PROYEK", canvas.width / 2, 850);
        ctx.fillText("Fiqri Achmada Portfolio", canvas.width / 2, 920);

        ctx.fillStyle = "#f59e0b";
        ctx.font = "italic 32px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText("Buka halaman berikutnya →", canvas.width / 2, 1200);
      } else {
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 4;
        ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

        ctx.fillStyle = "#64748b";
        ctx.font = "bold 28px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("PORTFOLIO CASE STUDY", 80, 120);

        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 54px 'Plus Jakarta Sans', sans-serif";
        const maxTitleWidth = canvas.width - 160;
        ctx.fillText((title || "Project").substring(0, 26), 80, 220);

        ctx.fillStyle = "#f1f5f9";
        if (ctx.roundRect) {
          ctx.roundRect(80, 280, canvas.width - 160, 650, [20]);
        } else {
          ctx.fillRect(80, 280, canvas.width - 160, 650);
        }
        ctx.fill();

        ctx.fillStyle = "#64748b";
        ctx.font = "italic 32px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("📷 Showcase Proyek", canvas.width / 2, 620);

        ctx.fillStyle = "#334155";
        ctx.font = "32px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "left";

        const descWords = (
          subtitle || "Karya dan portofolio pengembangan aplikasi web."
        ).split(" ");
        let line = "";
        let y = 1010;
        for (let i = 0; i < descWords.length; i++) {
          const testLine = line + descWords[i] + " ";
          if (ctx.measureText(testLine).width > maxTitleWidth && i > 0) {
            ctx.fillText(line, 80, y);
            line = descWords[i] + " ";
            y += 48;
            if (y > 1220) break;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, 80, y);

        ctx.fillStyle = "#0284c7";
        ctx.font = "bold 28px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText("FIQRI ACHMADA ARCHIVES", 80, 1320);
      }

      return new THREE.CanvasTexture(canvas);
    }

    const pagesList: THREE.Object3D[] = [];
    const pageGeo = new THREE.BoxGeometry(
      coverWidth - 0.05,
      0.008,
      coverHeight - 0.05
    );

    // Front Cover
    const coverTex = createPageTexture("Cover", "", true);
    const coverBackTex = createPageTexture("Daftar Karya", "Buku portofolio & kumpulan proyek terpilih.", false);
    const coverPageMat = [
      new THREE.MeshStandardMaterial({ color: 0x0f172a }),
      new THREE.MeshStandardMaterial({ color: 0x0f172a }),
      new THREE.MeshStandardMaterial({ map: coverTex, roughness: 0.3 }),
      new THREE.MeshStandardMaterial({ map: coverBackTex, roughness: 0.5 }),
      new THREE.MeshStandardMaterial({ color: 0x0f172a }),
      new THREE.MeshStandardMaterial({ color: 0x0f172a }),
    ];

    const coverPageMesh = new THREE.Mesh(pageGeo, coverPageMat);
    coverPageMesh.geometry.translate((coverWidth - 0.05) / 2, 0, 0);
    coverPageMesh.position.set(0.04, 0.02, 0);
    bookGroup.add(coverPageMesh);
    pagesList.push(coverPageMesh);

    // Pages for projects
    projects.forEach((proj, i) => {
      const pageTex = createPageTexture(proj.title, proj.description || "");
      const nextProj = projects[i + 1];
      const backDesc = nextProj ? `Halaman Berikutnya: ${nextProj.title}` : "Akhir dari buku kenangan.";
      const pageBackTex = createPageTexture(proj.title + " (Catatan)", proj.description || backDesc);

      const pageMat = [
        new THREE.MeshStandardMaterial({ color: 0xffffff }),
        new THREE.MeshStandardMaterial({ color: 0xffffff }),
        new THREE.MeshStandardMaterial({ map: pageTex, roughness: 0.5 }),
        new THREE.MeshStandardMaterial({ map: pageBackTex, roughness: 0.5 }),
        new THREE.MeshStandardMaterial({ color: 0xffffff }),
        new THREE.MeshStandardMaterial({ color: 0xffffff }),
      ];

      const pMesh = new THREE.Mesh(pageGeo, pageMat);
      pMesh.geometry.translate((coverWidth - 0.05) / 2, 0, 0);
      pMesh.position.set(0.04, 0.015 - i * 0.001, 0);
      bookGroup.add(pMesh);
      pagesList.push(pMesh);
    });

    pagesMeshRef.current = pagesList;

    let animationFrameId = 0;
    let targetRotationY = 0;
    let targetRotationX = 0.35;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      targetRotationY = x * 0.25;
      targetRotationX = 0.35 - y * 0.15;
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey || Math.abs(e.deltaY) > 0) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.12 : -0.12;
        updateZoom((z) => z + delta);
      }
    };

    container.addEventListener("mousemove", onPointerMove);
    container.addEventListener("wheel", onWheel, { passive: false });

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      bookGroup.rotation.y += (targetRotationY - bookGroup.rotation.y) * 0.05;
      bookGroup.rotation.x += (targetRotationX - bookGroup.rotation.x) * 0.05;

      bookGroup.position.x += (panRef.current.x - bookGroup.position.x) * 0.14;
      bookGroup.position.y += (panRef.current.y - bookGroup.position.y) * 0.14;

      const targetY = 1.8 / zoomRef.current;
      const targetZ = 4.2 / zoomRef.current;
      camera.position.y += (targetY - camera.position.y) * 0.12;
      camera.position.z += (targetZ - camera.position.z) * 0.12;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 450;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", onPointerMove);
      container.removeEventListener("wheel", onWheel);
      renderer.dispose();
      container.innerHTML = "";
    };
  }, [projects, updateZoom]);

  // Flip page rotation
  useEffect(() => {
    pagesMeshRef.current.forEach((mesh, index) => {
      const isFlipped = index < currentPage;
      const targetAngle = isFlipped ? -Math.PI + 0.08 * (index * 0.05) : 0;

      const startTime = performance.now();
      const initialAngle = mesh.rotation.z;
      const duration = 650;

      const flipStep = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        mesh.rotation.z = initialAngle + (targetAngle - initialAngle) * ease;

        if (progress < 1) {
          requestAnimationFrame(flipStep);
        }
      };
      requestAnimationFrame(flipStep);
    });
  }, [currentPage]);

  // Touch Swipe & Pinch Zoom + Mouse Drag Swipe / Pan Gestures
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const pinchStartDistRef = useRef<number | null>(null);
  const pinchStartZoomRef = useRef<number>(1);
  const mouseStartXRef = useRef<number | null>(null);
  const mouseStartYRef = useRef<number | null>(null);
  const panStartRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  const clampPan = (x: number, y: number) => {
    const maxX = Math.max((zoomRef.current - 1) * 1.35, 0);
    const maxY = Math.max((zoomRef.current - 1) * 1.15, 0);
    return {
      x: Math.min(Math.max(x, -maxX), maxX),
      y: Math.min(Math.max(y, -maxY), maxY),
    };
  };

  const getTouchDistance = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      pinchStartDistRef.current = getTouchDistance(e.touches);
      pinchStartZoomRef.current = zoomRef.current;
      touchStartXRef.current = null;
      touchStartYRef.current = null;
    } else if (e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
      panStartRef.current = { ...panRef.current };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStartDistRef.current !== null) {
      const currentDist = getTouchDistance(e.touches);
      const scale = currentDist / pinchStartDistRef.current;
      updateZoom(pinchStartZoomRef.current * scale);
    } else if (
      e.touches.length === 1 &&
      zoomRef.current > 1 &&
      touchStartXRef.current !== null &&
      touchStartYRef.current !== null
    ) {
      const dx = (e.touches[0].clientX - touchStartXRef.current) * 0.0045;
      const dy = -(e.touches[0].clientY - touchStartYRef.current) * 0.0045;
      panRef.current = clampPan(panStartRef.current.x + dx, panStartRef.current.y + dy);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (pinchStartDistRef.current !== null) {
      if (e.touches.length < 2) {
        pinchStartDistRef.current = null;
      }
      return;
    }
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    if (zoomRef.current <= 1) {
      const diffX = e.changedTouches[0].clientX - touchStartXRef.current;
      const diffY = e.changedTouches[0].clientY - touchStartYRef.current;

      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isDraggingRef.current = true;
    mouseStartXRef.current = e.clientX;
    mouseStartYRef.current = e.clientY;
    panStartRef.current = { ...panRef.current };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (
      !isDraggingRef.current ||
      zoomRef.current <= 1 ||
      mouseStartXRef.current === null ||
      mouseStartYRef.current === null
    )
      return;
    const dx = (e.clientX - mouseStartXRef.current) * 0.0045;
    const dy = -(e.clientY - mouseStartYRef.current) * 0.0045;
    panRef.current = clampPan(panStartRef.current.x + dx, panStartRef.current.y + dy);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    if (mouseStartXRef.current === null || mouseStartYRef.current === null) return;
    if (zoomRef.current <= 1) {
      const diffX = e.clientX - mouseStartXRef.current;
      const diffY = e.clientY - mouseStartYRef.current;

      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }

    mouseStartXRef.current = null;
    mouseStartYRef.current = null;
  };

  return (
    <div
      className={`relative w-full rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md p-6 shadow-xl transition-all duration-300 ${
        isFullscreen
          ? "fixed inset-4 z-50 overflow-hidden flex flex-col justify-between"
          : "min-h-[550px]"
      }`}>
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <BookOpen className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base lg:text-lg font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              Memory Book 3D (Buku Kenangan)
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                Interactive Three.js
              </span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {currentPage === 0
                ? "Sampul Buku: Drag mouse / geser jari untuk membuka halaman."
                : `Halaman ${currentPage} dari ${totalPages - 1}: ${
                    activeProject?.title || ""
                  }`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeProject?.image && (
            <a
              href={activeProject.image}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <span>Buka Gambar</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}

          {/* Zoom Controls */}
          <div className="flex items-center rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            <button
              onClick={() => updateZoom((z) => z - 0.2)}
              disabled={zoomLevel <= 0.6}
              className="flex items-center justify-center h-8 w-8 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition"
              title="Zoom Out">
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => updateZoom(1)}
              className="px-2 h-8 text-xs font-mono font-semibold text-gray-700 dark:text-gray-200 border-x border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              title="Reset Zoom">
              {Math.round(zoomLevel * 100)}%
            </button>
            <button
              onClick={() => updateZoom((z) => z + 0.2)}
              disabled={zoomLevel >= 2.5}
              className="flex items-center justify-center h-8 w-8 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition"
              title="Zoom In">
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title="Toggle Layar Penuh">
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div
        ref={mountRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full flex-1 min-h-[400px] cursor-grab active:cursor-grabbing select-none touch-none"
      />

      {/* Gesture Hint */}
      <div className="flex items-center justify-center gap-1.5 py-1 text-[11px] text-blue-600 dark:text-blue-400 font-mono">
        <Hand className="h-3.5 w-3.5 animate-bounce" />
        <span>
          {zoomLevel > 1
            ? "Mode Zoom Aktif: Geser (Drag / Touch) untuk melihat sisi kiri/kanan/atas/bawah"
            : "Geser (Mouse Drag / Swipe) untuk balik halaman • Scroll / Pinch untuk Zoom"}
        </span>
      </div>

      {/* Floating Bottom Nav Controls */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 dark:border-gray-800 pt-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <ChevronLeft className="h-4 w-4" />
            <span>Sebelumnya</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentPage >= totalPages - 1}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-black text-white dark:bg-white dark:text-black disabled:opacity-40 hover:opacity-80 transition">
            <span>Selanjutnya</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Page Dots Indicator */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: Math.min(totalPages, 20) }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`h-2 rounded-full transition-all duration-200 ${
                currentPage === idx
                  ? "w-6 bg-blue-600 dark:bg-blue-400"
                  : "w-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400"
              }`}
              title={idx === 0 ? "Cover" : `Page ${idx}`}
            />
          ))}
        </div>

        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
          {currentPage === 0 ? "Cover" : `${currentPage}/${totalPages - 1}`}
        </span>
      </div>
    </div>
  );
}
