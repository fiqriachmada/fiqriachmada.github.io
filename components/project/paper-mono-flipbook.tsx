"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import type { ProjectImage } from "@/types/api";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sparkles,
  Hand,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

interface PaperMonoFlipbookProps {
  images: ProjectImage[];
  projectTitle: string;
}

export function PaperMonoFlipbook({ images, projectTitle }: PaperMonoFlipbookProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const zoomRef = useRef(1);

  const updateZoom = useCallback((updater: number | ((prev: number) => number)) => {
    setZoomLevel((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      const clamped = Math.min(Math.max(Number(next.toFixed(2)), 0.6), 2.5);
      zoomRef.current = clamped;
      return clamped;
    });
  }, []);

  // Pages: 0 = Poster Blueprint '8', 1..N = Project Photos
  const totalPages = Math.max(images.length + 1, 2);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const bookGroupRef = useRef<THREE.Group | null>(null);
  const pagesMeshRef = useRef<THREE.Mesh[]>([]);

  const handleNext = useCallback(() => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  }, [totalPages]);

  const handlePrev = useCallback(() => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 560;
    const mobile = width < 640;
    setIsMobileView(mobile);

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      mobile ? 48 : 40,
      width / height,
      0.1,
      1000
    );
    camera.position.set(0, mobile ? 0 : 0.05, (mobile ? 3.3 : 3.8) / zoomRef.current);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffdfa, 2.0);
    keyLight.position.set(2, 4, 3.5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const softFill = new THREE.DirectionalLight(0xbfdbfe, 1.0);
    softFill.position.set(-3, 1, 2);
    scene.add(softFill);

    const bookGroup = new THREE.Group();
    bookGroupRef.current = bookGroup;
    scene.add(bookGroup);

    if (mobile) {
      bookGroup.position.set(-0.72, 0, 0);
    } else {
      bookGroup.position.set(0, 0, 0);
    }

    const pageWidth = 1.45;
    const pageHeight = 2.05;
    const segments = 32;

    function createMonoTexture(pageIndex: number) {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 1440;
      const ctx = canvas.getContext("2d")!;

      const texture = new THREE.CanvasTexture(canvas);

      if (pageIndex === 0) {
        ctx.fillStyle = "#f8f9fa";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "rgba(59, 130, 246, 0.18)";
        ctx.lineWidth = 1;
        const gridSize = 32;
        for (let x = 0; x < canvas.width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }

        ctx.fillStyle = "#2563eb";
        ctx.font = "bold 20px 'Courier New', monospace";
        ctx.textAlign = "left";
        ctx.fillText("paper mono", 70, 70);
        ctx.fillStyle = "#64748b";
        ctx.font = "16px 'Courier New', monospace";
        ctx.fillText("color = 0;", 70, 105);
        ctx.fillText("glyphname = eight;", 70, 130);
        ctx.fillText("layers = (", 70, 155);

        ctx.textAlign = "right";
        ctx.fillStyle = "#2563eb";
        ctx.font = "bold 20px 'Courier New', monospace";
        ctx.fillText("numbers", canvas.width - 70, 70);
        ctx.fillStyle = "#94a3b8";
        ctx.font = "15px 'Courier New', monospace";
        ctx.fillText("width = 606;", canvas.width - 70, 105);
        ctx.fillText("layerId = 742FEEFA-C05E-41A8", canvas.width - 70, 130);

        const cx = canvas.width / 2;
        const cy = 680;
        const rTop = 220;
        const rBottom = 260;

        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 2.5;

        ctx.beginPath();
        ctx.arc(cx, cy - 200, rTop, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy + 240, rBottom, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = "rgba(100, 116, 139, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx - 320, cy - 200);
        ctx.lineTo(cx + 320, cy - 200);
        ctx.moveTo(cx - 350, cy + 240);
        ctx.lineTo(cx + 350, cy + 240);
        ctx.moveTo(cx, cy - 480);
        ctx.lineTo(cx, cy + 560);
        ctx.stroke();

        const drawDiamond = (x: number, y: number, color = "#3b82f6") => {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(Math.PI / 4);
          ctx.fillStyle = color;
          ctx.fillRect(-8, -8, 16, 16);
          ctx.restore();
        };

        const drawHandle = (x1: number, y1: number, x2: number, y2: number) => {
          ctx.strokeStyle = "#94a3b8";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();

          ctx.fillStyle = "#ffffff";
          ctx.strokeStyle = "#94a3b8";
          ctx.beginPath();
          ctx.arc(x2, y2, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        };

        drawDiamond(cx, cy - 200 - rTop);
        drawDiamond(cx, cy - 200 + rTop);
        drawDiamond(cx - rTop, cy - 200);
        drawDiamond(cx + rTop, cy - 200);
        drawHandle(cx - rTop, cy - 200, cx - rTop, cy - 310);
        drawHandle(cx + rTop, cy - 200, cx + rTop, cy - 310);

        drawDiamond(cx, cy + 240 - rBottom);
        drawDiamond(cx, cy + 240 + rBottom);
        drawDiamond(cx - rBottom, cy + 240);
        drawDiamond(cx + rBottom, cy + 240);
        drawHandle(cx - rBottom, cy + 240, cx - rBottom, cy + 120);
        drawHandle(cx + rBottom, cy + 240, cx + rBottom, cy + 120);

        ctx.fillStyle = "#0f172a";
        ctx.fillRect(cx - 40, cy + 10, 16, 16);
        ctx.fillRect(cx + 24, cy + 10, 16, 16);

        ctx.fillStyle = "#64748b";
        ctx.font = "bold 20px 'Courier New', monospace";
        ctx.textAlign = "left";
        ctx.fillText("by paper.design", 70, 1370);

        ctx.textAlign = "right";
        ctx.fillText("for the love of design", canvas.width - 70, 1370);

        ctx.fillStyle = "#93c5fd";
        ctx.font = "26px 'Courier New', monospace";
        ctx.textAlign = "center";
        ctx.fillText("|- z * a * * * * -|", cx, 1220);
        ctx.fillText("• | - * a a a a * z - |", cx, 1260);
        ctx.fillText("|- z a a a a a a * -|", cx, 1300);

        texture.needsUpdate = true;
      } else {
        ctx.fillStyle = "#fcfdfd";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "rgba(59, 130, 246, 0.12)";
        ctx.lineWidth = 1;
        const gridSize = 32;
        for (let x = 0; x < canvas.width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }

        const imgIdx = pageIndex - 1;
        const currentImg = images[imgIdx];

        ctx.fillStyle = "#2563eb";
        ctx.font = "bold 22px 'Courier New', monospace";
        ctx.textAlign = "left";
        ctx.fillText(`0${pageIndex} // ARCHIVE SPECIMEN`, 65, 80);

        ctx.fillStyle = "#64748b";
        ctx.textAlign = "right";
        ctx.fillText(
          `SPEC.${pageIndex} • ${projectTitle.substring(0, 20)}`,
          canvas.width - 65,
          80
        );

        ctx.fillStyle = "#0f172a";
        ctx.font = "900 110px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(`M O N O`, 65, 210);

        const frameX = 65;
        const frameY = 260;
        const frameW = canvas.width - 130;
        const frameH = 750;

        ctx.fillStyle = "#e2e8f0";
        ctx.roundRect(frameX, frameY, frameW, frameH, [16]);
        ctx.fill();

        if (currentImg?.imageUrl) {
          const imgObj = new window.Image();
          imgObj.crossOrigin = "anonymous";
          imgObj.src = currentImg.imageUrl;
          imgObj.onload = () => {
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(frameX, frameY, frameW, frameH, [16]);
            ctx.clip();
            ctx.drawImage(imgObj, frameX, frameY, frameW, frameH);
            ctx.restore();

            if (currentImg?.isBanner) {
              ctx.fillStyle = "#2563eb";
              ctx.fillRect(frameX + 24, frameY + 24, 250, 48);
              ctx.fillStyle = "#ffffff";
              ctx.font = "bold 22px 'Courier New', monospace";
              ctx.fillText("★ BANNER UTAMA", frameX + 44, frameY + 56);
            }

            texture.needsUpdate = true;
          };
        }

        ctx.fillStyle = "#0f172a";
        ctx.font = "900 78px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("P A P E R", 65, 1100);

        ctx.fillStyle = "#475569";
        ctx.font = "18px 'Courier New', monospace";
        ctx.fillText(
          `Dokumentasi karya rekayasa perangkat lunak dan arsitektur UI/UX`,
          65,
          1150
        );
        ctx.fillText(
          `ID: ${currentImg?.id || "specimen-" + pageIndex} • Geser sentuh jari untuk buka lembar`,
          65,
          1185
        );

        ctx.fillStyle = "#94a3b8";
        ctx.font = "18px 'Courier New', monospace";
        ctx.textAlign = "left";
        ctx.fillText(`FIQRI ACHMADA // RESEARCH ARCHIVE`, 65, 1370);
        ctx.textAlign = "right";
        ctx.fillText(`PAGE 0${pageIndex} OF 0${totalPages - 1}`, canvas.width - 65, 1370);

        texture.needsUpdate = true;
      }

      return texture;
    }

    const pagesList: THREE.Mesh[] = [];

    for (let i = 0; i < totalPages; i++) {
      const pageGeo = new THREE.PlaneGeometry(pageWidth, pageHeight, segments, 1);
      pageGeo.translate(pageWidth / 2, 0, 0);

      const texture = createMonoTexture(i);
      const pageMat = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        roughness: 0.5,
        metalness: 0.04,
      });

      const mesh = new THREE.Mesh(pageGeo, pageMat);
      mesh.position.set(0.01, 0, -i * 0.002);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      bookGroup.add(mesh);
      pagesList.push(mesh);
    }

    pagesMeshRef.current = pagesList;

    let animationFrameId: number;
    let isMobileCurrent = mobile;
    let targetRotY = mobile ? 0 : 0.04;
    let targetRotX = mobile ? 0 : 0.04;

    const onPointerMove = (e: MouseEvent) => {
      if (isMobileCurrent) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      targetRotY = x * 0.12;
      targetRotX = 0.04 - y * 0.06;
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

      bookGroup.rotation.y += (targetRotY - bookGroup.rotation.y) * 0.08;
      bookGroup.rotation.x += (targetRotX - bookGroup.rotation.x) * 0.08;

      const baseZ = isMobileCurrent ? 3.3 : 3.8;
      const targetZ = baseZ / zoomRef.current;
      camera.position.z += (targetZ - camera.position.z) * 0.12;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 560;
      const newMobile = newWidth < 640;
      isMobileCurrent = newMobile;
      setIsMobileView(newMobile);

      camera.aspect = newWidth / newHeight;
      camera.fov = newMobile ? 48 : 40;
      camera.position.set(0, newMobile ? 0 : 0.05, (newMobile ? 3.3 : 3.8) / zoomRef.current);
      camera.updateProjectionMatrix();

      if (newMobile) {
        bookGroup.position.set(-0.72, 0, 0);
      } else {
        bookGroup.position.set(0, 0, 0);
      }

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
  }, [images, projectTitle, totalPages, updateZoom]);

  useEffect(() => {
    pagesMeshRef.current.forEach((mesh, index) => {
      const isFlipped = index < currentPage;
      const targetAngle = isFlipped ? -Math.PI + index * 0.025 : 0;

      const startTime = performance.now();
      const initialAngle = mesh.rotation.y;
      const duration = 650;

      const flipStep = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentAngle = initialAngle + (targetAngle - initialAngle) * ease;
        mesh.rotation.y = currentAngle;

        const pos = mesh.geometry.attributes.position;
        const flexAmount = Math.sin(progress * Math.PI) * 0.28;

        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i);
          pos.setZ(i, -Math.sin((x / 1.45) * Math.PI) * flexAmount);
        }
        pos.needsUpdate = true;

        if (progress < 1) {
          requestAnimationFrame(flipStep);
        }
      };
      requestAnimationFrame(flipStep);
    });
  }, [currentPage]);

  // Touch Swipe & Pinch Zoom + Mouse Drag Swipe Gestures
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const pinchStartDistRef = useRef<number | null>(null);
  const pinchStartZoomRef = useRef<number>(1);
  const mouseStartXRef = useRef<number | null>(null);
  const mouseStartYRef = useRef<number | null>(null);

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
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStartDistRef.current !== null) {
      const currentDist = getTouchDistance(e.touches);
      const scale = currentDist / pinchStartDistRef.current;
      updateZoom(pinchStartZoomRef.current * scale);
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
    const diffX = e.changedTouches[0].clientX - touchStartXRef.current;
    const diffY = e.changedTouches[0].clientY - touchStartYRef.current;

    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    mouseStartXRef.current = e.clientX;
    mouseStartYRef.current = e.clientY;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (mouseStartXRef.current === null || mouseStartYRef.current === null) return;
    const diffX = e.clientX - mouseStartXRef.current;
    const diffY = e.clientY - mouseStartYRef.current;

    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    mouseStartXRef.current = null;
    mouseStartYRef.current = null;
  };

  return (
    <div
      className={`relative w-full rounded-2xl border-2 border-black dark:border-white/20 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] transition-all duration-300 overflow-hidden ${
        isFullscreen
          ? "fixed inset-2 sm:inset-4 z-50 overflow-hidden flex flex-col justify-between"
          : "min-h-[560px] sm:min-h-[620px]"
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-20 dark:opacity-10"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(59, 130, 246, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.2) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Top Header Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b-2 border-black dark:border-white/20 pb-3 sm:pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-mono text-sm sm:text-base font-bold tracking-tight flex items-center gap-2 text-gray-900 dark:text-white">
              paper.design // mono
              <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-mono text-[10px] border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                {isMobileView ? "1 Halaman (Single Page)" : "2 Halaman (Spread)"}
              </span>
            </h3>
            <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-mono">
              {currentPage === 0
                ? "Cover Blueprint '8' • Drag mouse / geser jari untuk buka lembar"
                : `Lembar 0${currentPage} / 0${totalPages - 1} • ${images.length} Media Terlampir`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[11px] font-mono border border-gray-200 dark:border-gray-700">
            <Hand className="h-3 w-3 animate-pulse text-blue-500" />
            <span>Mouse Drag & Touch Pinch/Swipe</span>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center rounded-md bg-white dark:bg-gray-800 border-2 border-black dark:border-white/30 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <button
              onClick={() => updateZoom((z) => z - 0.2)}
              disabled={zoomLevel <= 0.6}
              className="flex items-center justify-center h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition"
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => updateZoom(1)}
              className="px-1.5 h-8 text-[11px] font-mono font-bold border-x border-black/20 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              title="Reset Zoom"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <button
              onClick={() => updateZoom((z) => z + 0.2)}
              disabled={zoomLevel >= 2.5}
              className="flex items-center justify-center h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition"
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center justify-center h-8 w-8 rounded-md bg-white dark:bg-gray-800 border-2 border-black dark:border-white/30 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:opacity-80 transition"
            title="Toggle Layar Penuh"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 3D Canvas Mount with Mouse Drag & Touch Handlers */}
      <div
        ref={mountRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative z-10 w-full flex-1 min-h-[380px] sm:min-h-[460px] cursor-grab active:cursor-grabbing select-none touch-none"
      />

      {/* Gesture Hint */}
      <div className="relative z-10 flex items-center justify-center gap-1.5 py-1 text-[11px] text-blue-600 dark:text-blue-400 font-mono">
        <Hand className="h-3.5 w-3.5 animate-bounce" />
        <span>Geser (Mouse Drag / Swipe) untuk balik lembar • Scroll / Pinch untuk Zoom</span>
      </div>

      {/* Bottom Controls */}
      <div className="relative z-10 mt-2 sm:mt-4 flex flex-wrap items-center justify-between gap-3 border-t-2 border-black dark:border-white/20 pt-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className="inline-flex items-center h-8 sm:h-9 px-3 sm:px-4 gap-1.5 rounded-md bg-white dark:bg-gray-800 font-mono text-xs border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] disabled:opacity-30 disabled:shadow-none transition"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Prev</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentPage >= totalPages - 1}
            className="inline-flex items-center h-8 sm:h-9 px-3 sm:px-4 gap-1.5 rounded-md font-mono text-xs bg-black text-white dark:bg-white dark:text-black font-bold border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] disabled:opacity-30 disabled:shadow-none transition"
          >
            <span>Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`h-2 rounded-none border border-black dark:border-white transition-all duration-200 ${
                currentPage === idx
                  ? "w-6 bg-blue-600 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                  : "w-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-400"
              }`}
              title={idx === 0 ? "Cover" : `Specimen ${idx}`}
            />
          ))}
        </div>

        <span className="font-mono text-xs text-gray-500 dark:text-gray-400 font-semibold">
          {currentPage === 0 ? "COVER" : `0${currentPage}/0${totalPages - 1}`}
        </span>
      </div>
    </div>
  );
}
