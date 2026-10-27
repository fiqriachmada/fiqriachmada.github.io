"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import type { ProjectApiItem } from "@/types/api";
import { ChevronLeft, ChevronRight, BookOpen, Maximize2, Hand } from "lucide-react";

interface ProjectDetailBook3DProps {
  project: ProjectApiItem;
}

export function ProjectDetailBook3D({ project }: ProjectDetailBook3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  const images = project.projectImages || [];
  // Pages: 0 = Cover, 1 = Intro / Overview, 2..N = Project Photos
  const totalPages = Math.max(2 + images.length, 2);

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
    camera.position.set(0, mobile ? 0 : 0.05, mobile ? 3.4 : 3.9);
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

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffdf5, 2.2);
    dirLight.position.set(2, 4, 3.5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 1.0);
    fillLight.position.set(-3, 1, 2);
    scene.add(fillLight);

    const bookGroup = new THREE.Group();
    bookGroupRef.current = bookGroup;
    scene.add(bookGroup);

    if (mobile) {
      bookGroup.position.set(-0.75, 0, 0);
    } else {
      bookGroup.position.set(0, 0, 0);
    }

    const pageWidth = 1.48;
    const pageHeight = 2.08;
    const segments = 32;

    function createMemoryPageTexture(type: "cover" | "intro" | "photo", data?: { index: number }) {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 1440;
      const ctx = canvas.getContext("2d")!;

      const texture = new THREE.CanvasTexture(canvas);

      if (type === "cover") {
        ctx.fillStyle = "#090d16";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "#fbbf24";
        ctx.lineWidth = 14;
        ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

        ctx.strokeStyle = "#d97706";
        ctx.lineWidth = 4;
        ctx.strokeRect(75, 75, canvas.width - 150, canvas.height - 150);

        ctx.fillStyle = "#fbbf24";
        ctx.font = "bold 38px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("✦ PROJECT MEMORY BOOK ✦", canvas.width / 2, 340);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 64px 'Plus Jakarta Sans', sans-serif";
        const titleText = project.title.length > 25 ? project.title.substring(0, 24) + "..." : project.title;
        ctx.fillText(titleText, canvas.width / 2, 480);

        ctx.fillStyle = "#94a3b8";
        ctx.font = "32px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText("BUKU KENANGAN & DOKUMENTASI", canvas.width / 2, 600);
        ctx.fillText(`${images.length} Media & Tangkapan Layar`, canvas.width / 2, 660);

        ctx.beginPath();
        ctx.arc(canvas.width / 2, 900, 140, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(251, 191, 36, 0.1)";
        ctx.fill();
        ctx.strokeStyle = "#fbbf24";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = "#fbbf24";
        ctx.font = "bold 28px 'Courier New', monospace";
        ctx.fillText("FIQRI ACHMADA", canvas.width / 2, 890);
        ctx.fillText("OFFICIAL ARCHIVES", canvas.width / 2, 930);

        ctx.fillStyle = "#f59e0b";
        ctx.font = "italic 30px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText("Buka halaman berikutnya →", canvas.width / 2, 1280);

        texture.needsUpdate = true;
      } else if (type === "intro") {
        ctx.fillStyle = "#fdfdfd";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 4;
        ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

        ctx.fillStyle = "#6366f1";
        ctx.font = "bold 28px 'Courier New', monospace";
        ctx.textAlign = "left";
        ctx.fillText("OVERVIEW // TENTANG PROYEK", 90, 140);

        ctx.fillStyle = "#0f172a";
        ctx.font = "900 58px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText(project.title.substring(0, 22), 90, 230);

        ctx.fillStyle = "#334155";
        ctx.font = "32px 'Plus Jakarta Sans', sans-serif";
        const descWords = (project.description || "Dokumentasi karya dan rekayasa perangkat lunak.").split(" ");
        let line = "";
        let y = 350;
        for (let i = 0; i < descWords.length; i++) {
          const testLine = line + descWords[i] + " ";
          if (ctx.measureText(testLine).width > canvas.width - 180 && i > 0) {
            ctx.fillText(line, 90, y);
            line = descWords[i] + " ";
            y += 52;
            if (y > 900) break;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, 90, y);

        ctx.fillStyle = "#e0e7ff";
        ctx.roundRect(90, 1020, canvas.width - 180, 250, [16]);
        ctx.fill();

        ctx.fillStyle = "#4338ca";
        ctx.font = "bold 32px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText("✦ REKAM JEJAK PORTOFOLIO", 130, 1100);

        ctx.fillStyle = "#3730a3";
        ctx.font = "26px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText("Balik lembaran berikutnya untuk melihat seluruh foto karya.", 130, 1160);

        texture.needsUpdate = true;
      } else {
        ctx.fillStyle = "#fafafa";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 4;
        ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

        const imgIdx = data?.index || 0;
        const currentImg = images[imgIdx];

        ctx.fillStyle = "#6366f1";
        ctx.font = "bold 26px 'Courier New', monospace";
        ctx.textAlign = "left";
        ctx.fillText(`FOTO #${imgIdx + 1} // DOKUMENTASI`, 90, 130);

        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 52px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText(project.title.substring(0, 24), 90, 210);

        const frameX = 90;
        const frameY = 270;
        const frameW = canvas.width - 180;
        const frameH = 760;

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
              ctx.fillStyle = "#4f46e5";
              ctx.fillRect(frameX + 24, frameY + 24, 260, 50);
              ctx.fillStyle = "#ffffff";
              ctx.font = "bold 24px 'Courier New', monospace";
              ctx.fillText("★ BANNER UTAMA", frameX + 44, frameY + 58);
            }

            texture.needsUpdate = true;
          };
        }

        ctx.fillStyle = "#475569";
        ctx.font = "26px 'Courier New', monospace";
        ctx.fillText(`Tangkapan Layar & Dokumentasi Karya #${imgIdx + 1}`, 90, 1140);
        ctx.fillText(`ID: ${currentImg?.id || "img-" + (imgIdx + 1)}`, 90, 1190);

        ctx.fillStyle = "#6366f1";
        ctx.font = "bold 24px 'Courier New', monospace";
        ctx.fillText("FIQRI ACHMADA ARCHIVES", 90, 1340);

        ctx.textAlign = "right";
        ctx.fillStyle = "#94a3b8";
        ctx.fillText(`HALAMAN 0${imgIdx + 2}`, canvas.width - 90, 1340);

        texture.needsUpdate = true;
      }

      return texture;
    }

    const pagesList: THREE.Mesh[] = [];

    for (let i = 0; i < totalPages; i++) {
      const pageGeo = new THREE.PlaneGeometry(pageWidth, pageHeight, segments, 1);
      pageGeo.translate(pageWidth / 2, 0, 0);

      const pageType = i === 0 ? "cover" : i === 1 ? "intro" : "photo";
      const texture = createMemoryPageTexture(pageType, { index: i - 2 });

      const pageMat = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        roughness: 0.5,
        metalness: 0.05,
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
    let targetRotY = mobile ? 0 : 0.04;
    let targetRotX = mobile ? 0 : 0.04;

    const onPointerMove = (e: MouseEvent) => {
      if (mobile) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      targetRotY = x * 0.12;
      targetRotX = 0.04 - y * 0.06;
    };

    container.addEventListener("mousemove", onPointerMove);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      bookGroup.rotation.y += (targetRotY - bookGroup.rotation.y) * 0.08;
      bookGroup.rotation.x += (targetRotX - bookGroup.rotation.x) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 560;
      const newMobile = newWidth < 640;
      setIsMobileView(newMobile);

      camera.aspect = newWidth / newHeight;
      camera.fov = newMobile ? 48 : 40;
      camera.position.set(0, newMobile ? 0 : 0.05, newMobile ? 3.4 : 3.9);
      camera.updateProjectionMatrix();

      if (newMobile) {
        bookGroup.position.set(-0.75, 0, 0);
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
      renderer.dispose();
      container.innerHTML = "";
    };
  }, [project, images, totalPages]);

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
          pos.setZ(i, -Math.sin((x / 1.48) * Math.PI) * flexAmount);
        }
        pos.needsUpdate = true;

        if (progress < 1) {
          requestAnimationFrame(flipStep);
        }
      };
      requestAnimationFrame(flipStep);
    });
  }, [currentPage]);

  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
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

  return (
    <div
      className={`relative w-full rounded-2xl border-2 border-black dark:border-white/20 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] transition-all duration-300 overflow-hidden ${
        isFullscreen
          ? "fixed inset-2 sm:inset-4 z-50 overflow-hidden flex flex-col justify-between"
          : "min-h-[560px] sm:min-h-[620px]"
      }`}
    >
      {/* Top Header Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b-2 border-black dark:border-white/20 pb-3 sm:pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-mono text-sm sm:text-base font-bold tracking-tight flex items-center gap-2 text-gray-900 dark:text-white">
              Memory Book 3D
              <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-mono text-[10px] border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                {isMobileView ? "1 Halaman (Single Page)" : "2 Halaman (Spread)"}
              </span>
            </h3>
            <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-mono">
              {currentPage === 0
                ? "Sampul Album Buku • Geser sentuh jari untuk membuka"
                : currentPage === 1
                ? "Ikhtisar Proyek • Geser lagi untuk galeri foto"
                : `Foto #${currentPage - 1} dari ${images.length}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[11px] font-mono border border-gray-200 dark:border-gray-700">
            <Hand className="h-3 w-3 animate-pulse text-indigo-500" />
            <span>Swipe Gestur Sentuh Aktif</span>
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

      {/* 3D Canvas Mount with Touch Handlers */}
      <div
        ref={mountRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative z-10 w-full flex-1 min-h-[380px] sm:min-h-[460px] cursor-grab active:cursor-grabbing select-none touch-pan-y"
      />

      {/* Mobile Swipe Hint */}
      <div className="sm:hidden relative z-10 flex items-center justify-center gap-1.5 py-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-mono">
        <Hand className="h-3.5 w-3.5 animate-bounce" />
        <span>Geser sentuh jari ke kiri/kanan untuk membalik album buku</span>
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
            className="inline-flex items-center h-8 sm:h-9 px-3 sm:px-4 gap-1.5 rounded-md font-mono text-xs bg-indigo-600 text-white font-bold border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] disabled:opacity-30 disabled:shadow-none transition"
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
                  ? "w-6 bg-indigo-600 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                  : "w-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-400"
              }`}
              title={idx === 0 ? "Cover" : idx === 1 ? "Overview" : `Foto ${idx - 1}`}
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
