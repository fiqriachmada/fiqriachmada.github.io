"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Maximize2,
  ExternalLink,
} from "lucide-react";

export function ProjectBook3D({ projects = [] }) {
  const mountRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const totalPages = (projects.length || 0) + 1; // +1 for cover
  const activeProject = currentPage > 0 ? projects[currentPage - 1] : null;

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const bookGroupRef = useRef(null);
  const pagesMeshRef = useRef([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 1.8, 4.2);
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

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff8e7, 2.0);
    dirLight.position.set(3, 5, 4);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x90b0ff, 0.8);
    fillLight.position.set(-3, 3, -2);
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

    // Left & Right Book Covers
    const coverWidth = 1.6;
    const coverHeight = 2.2;
    const coverDepth = 0.04;

    const coverMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.3,
      metalness: 0.1,
    });

    const leftCover = new THREE.Mesh(
      new THREE.BoxGeometry(coverWidth, coverDepth, coverHeight),
      coverMat
    );
    leftCover.position.set(-coverWidth / 2 - 0.05, -coverDepth / 2, 0);
    leftCover.castShadow = true;
    leftCover.receiveShadow = true;
    bookGroup.add(leftCover);

    const rightCover = new THREE.Mesh(
      new THREE.BoxGeometry(coverWidth, coverDepth, coverHeight),
      coverMat
    );
    rightCover.position.set(coverWidth / 2 + 0.05, -coverDepth / 2, 0);
    rightCover.castShadow = true;
    rightCover.receiveShadow = true;
    bookGroup.add(rightCover);

    // Helper canvas texture generator for pages
    function createPageTexture(title, subtitle, isCover = false) {
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
        ctx.roundRect
          ? ctx.roundRect(80, 280, canvas.width - 160, 650, [20])
          : ctx.fillRect(80, 280, canvas.width - 160, 650);
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

    const pagesList = [];
    const pageGeo = new THREE.BoxGeometry(
      coverWidth - 0.05,
      0.008,
      coverHeight - 0.05
    );

    // Front Cover
    const coverTex = createPageTexture("Cover", "", true);
    const coverPageMat = [
      new THREE.MeshStandardMaterial({ color: 0x0f172a }),
      new THREE.MeshStandardMaterial({ color: 0x0f172a }),
      new THREE.MeshStandardMaterial({ map: coverTex, roughness: 0.3 }),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 }),
      new THREE.MeshStandardMaterial({ color: 0x0f172a }),
      new THREE.MeshStandardMaterial({ color: 0x0f172a }),
    ];

    const coverPageMesh = new THREE.Mesh(pageGeo, coverPageMat);
    coverPageMesh.geometry.translate((coverWidth - 0.05) / 2, 0, 0);
    coverPageMesh.position.set(0.04, 0.02, 0);
    bookGroup.add(coverPageMesh);
    pagesList.push(coverPageMesh);

    // Pages for projects (up to 15)
    projects.slice(0, 15).forEach((proj, i) => {
      const pageTex = createPageTexture(proj.title, proj.description || "");
      const pageMat = [
        new THREE.MeshStandardMaterial({ color: 0xffffff }),
        new THREE.MeshStandardMaterial({ color: 0xffffff }),
        new THREE.MeshStandardMaterial({ map: pageTex, roughness: 0.5 }),
        new THREE.MeshStandardMaterial({ color: 0xfdfdfd, roughness: 0.5 }),
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

    let animationFrameId;
    let targetRotationY = 0;
    let targetRotationX = 0.35;

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      targetRotationY = x * 0.25;
      targetRotationX = 0.35 - y * 0.15;
    };

    container.addEventListener("mousemove", onPointerMove);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      bookGroup.rotation.y += (targetRotationY - bookGroup.rotation.y) * 0.05;
      bookGroup.rotation.x += (targetRotationX - bookGroup.rotation.x) * 0.05;
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
      renderer.dispose();
      container.innerHTML = "";
    };
  }, [projects]);

  // Flip page rotation
  useEffect(() => {
    pagesMeshRef.current.forEach((mesh, index) => {
      const isFlipped = index < currentPage;
      const targetAngle = isFlipped ? -Math.PI + 0.08 * (index * 0.05) : 0;

      const startTime = performance.now();
      const initialAngle = mesh.rotation.z;
      const duration = 650;

      const flipStep = (now) => {
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

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
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
                ? "Sampul Buku: Balik halaman untuk melihat showcase proyek."
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
        className="relative w-full flex-1 min-h-[400px] cursor-grab active:cursor-grabbing select-none"
      />

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
