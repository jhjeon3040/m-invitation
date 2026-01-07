"use client";

import { useRef, useEffect, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { useScroll, useTransform, useSpring, motion, MotionValue } from "framer-motion";
import Lenis from "lenis";
import * as THREE from "three";

const JOURNEY_LENGTH = 6000;
const TOTAL_WIDTH = 120;

const STAGES = {
  SPRING: { start: 0, end: 0.25 },
  MEETING: { start: 0.25, end: 0.5 },
  DATING: { start: 0.5, end: 0.75 },
  WEDDING: { start: 0.75, end: 1.0 },
};

const ASSETS = {
  cherryTree: "/assets/cherry-tree.jpg",
  cloud: "/assets/cloud.jpg",
  coupleWalking: "/assets/couple-walking.jpg",
  coupleWedding: "/assets/couple-wedding.jpg",
  weddingHall: "/assets/wedding-hall.jpg",
  weddingCouple: "/assets/wedding-couple.png",
};

function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.7,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);
}

export default function JourneyDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  useLenis();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.0001,
  });

  return (
    <div ref={containerRef} style={{ height: `${JOURNEY_LENGTH}px` }}>
      <div className="fixed inset-0 overflow-hidden">
        <Canvas gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
          <Suspense fallback={null}>
            <CameraController progress={smoothProgress} />
            <DynamicLighting progress={smoothProgress} />
            <Scene progress={smoothProgress} />
          </Suspense>
        </Canvas>

        <StoryIndicator progress={smoothProgress} />
        <ScrollHint progress={smoothProgress} />
      </div>
    </div>
  );
}

function DynamicLighting({ progress }: { progress: MotionValue<number> }) {
  const ambientRef = useRef<THREE.AmbientLight>(null);

  useFrame(() => {
    const p = progress.get();

    if (ambientRef.current) {
      if (p < STAGES.DATING.start) {
        ambientRef.current.intensity = 0.9;
        ambientRef.current.color.setHex(0xfff5ee);
      } else if (p < STAGES.WEDDING.start) {
        const t = (p - STAGES.DATING.start) / 0.25;
        ambientRef.current.intensity = THREE.MathUtils.lerp(0.9, 0.7, t);
        ambientRef.current.color.lerpColors(
          new THREE.Color(0xfff5ee),
          new THREE.Color(0xffd4a3),
          t
        );
      } else {
        ambientRef.current.intensity = 1.0;
        ambientRef.current.color.setHex(0xfffaf0);
      }
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.9} />
      <directionalLight position={[10, 10, 5]} intensity={0.4} color="#ffeedd" />
    </>
  );
}

function CameraController({ progress }: { progress: MotionValue<number> }) {
  const cameraRef = useRef<THREE.OrthographicCamera>(null);
  const cameraX = useTransform(progress, [0, 1], [0, TOTAL_WIDTH]);

  useFrame(() => {
    if (cameraRef.current) {
      cameraRef.current.position.x = cameraX.get();
    }
  });

  return (
    <OrthographicCamera
      ref={cameraRef}
      makeDefault
      position={[0, 2, 20]}
      zoom={38}
      near={0.1}
      far={1000}
    />
  );
}

function Scene({ progress }: { progress: MotionValue<number> }) {
  return (
    <group>
      <DynamicSky progress={progress} />
      <CloudsLayer progress={progress} />
      <MountainSilhouettes progress={progress} />
      <CherryTreesLayer progress={progress} />
      <Ground progress={progress} />
      <WeddingHallScene progress={progress} />
      <FloatingPetals progress={progress} />
      <WalkingCouple progress={progress} />
    </group>
  );
}

function DynamicSky({ progress }: { progress: MotionValue<number> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  const skyTextures = useMemo(() => {
    const createGradient = (colors: Array<{ stop: number; color: string }>) => {
      const canvas = document.createElement("canvas");
      canvas.width = 4;
      canvas.height = 512;
      const ctx = canvas.getContext("2d")!;
      const gradient = ctx.createLinearGradient(0, 0, 0, 512);
      colors.forEach(({ stop, color }) => gradient.addColorStop(stop, color));
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 4, 512);
      return new THREE.CanvasTexture(canvas);
    };

    return {
      spring: createGradient([
        { stop: 0, color: "#87CEEB" },
        { stop: 0.3, color: "#E0F4FF" },
        { stop: 0.6, color: "#FFE4EC" },
        { stop: 0.85, color: "#FFF0F5" },
        { stop: 1, color: "#98D8AA" },
      ]),
      summer: createGradient([
        { stop: 0, color: "#4A90D9" },
        { stop: 0.4, color: "#87CEEB" },
        { stop: 0.7, color: "#FFE4B5" },
        { stop: 1, color: "#90EE90" },
      ]),
      autumn: createGradient([
        { stop: 0, color: "#2C3E50" },
        { stop: 0.3, color: "#E74C3C" },
        { stop: 0.5, color: "#F39C12" },
        { stop: 0.7, color: "#FFD93D" },
        { stop: 1, color: "#8B4513" },
      ]),
      wedding: createGradient([
        { stop: 0, color: "#FFB6C1" },
        { stop: 0.3, color: "#FFC0CB" },
        { stop: 0.5, color: "#FFE4E1" },
        { stop: 0.7, color: "#FFF0F5" },
        { stop: 1, color: "#F0FFF0" },
      ]),
    };
  }, []);

  useFrame(() => {
    if (!materialRef.current) return;
    const p = progress.get();

    let texture: THREE.CanvasTexture;

    if (p < STAGES.MEETING.start) {
      texture = skyTextures.spring;
    } else if (p < STAGES.DATING.start) {
      texture = skyTextures.summer;
    } else if (p < STAGES.WEDDING.start) {
      texture = skyTextures.autumn;
    } else {
      texture = skyTextures.wedding;
    }

    materialRef.current.map = texture;
    materialRef.current.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} position={[60, 5, -50]}>
      <planeGeometry args={[300, 35]} />
      <meshBasicMaterial ref={materialRef} />
    </mesh>
  );
}

function CloudsLayer({ progress }: { progress: MotionValue<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useLoader(THREE.TextureLoader, ASSETS.cloud);
  const parallaxX = useTransform(progress, [0, 1], [0, TOTAL_WIDTH * 0.15]);

  const cloudData = useMemo(
    () => [
      { x: 5, y: 7, scale: 1.8 },
      { x: 25, y: 8, scale: 2.2 },
      { x: 45, y: 6.5, scale: 1.6 },
      { x: 65, y: 7.5, scale: 2.0 },
      { x: 85, y: 8.5, scale: 1.9 },
      { x: 105, y: 7, scale: 2.3 },
      { x: 125, y: 8, scale: 1.7 },
    ],
    []
  );

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.position.x = parallaxX.get();

    const time = clock.getElapsedTime();
    groupRef.current.children.forEach((cloud, i) => {
      const data = cloudData[i];
      if (data) {
        cloud.position.y = data.y + Math.sin(time * 0.3 + i * 0.5) * 0.15;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {cloudData.map((cloud, i) => (
        <mesh key={i} position={[cloud.x, cloud.y, -30]}>
          <planeGeometry args={[cloud.scale * 2, cloud.scale * 1.5]} />
          <meshBasicMaterial map={texture} transparent opacity={0.95} />
        </mesh>
      ))}
    </group>
  );
}

function MountainSilhouettes({ progress }: { progress: MotionValue<number> }) {
  const farRef = useRef<THREE.Group>(null);
  const nearRef = useRef<THREE.Group>(null);

  const farParallax = useTransform(progress, [0, 1], [0, TOTAL_WIDTH * 0.1]);
  const nearParallax = useTransform(progress, [0, 1], [0, TOTAL_WIDTH * 0.25]);

  const farShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-60, 0);
    const points = [
      -50, 3, -40, 2, -30, 4.5, -20, 2.5, -10, 4, 0, 5.5, 10, 3.5, 20, 5, 30, 3, 40, 4.5, 50, 3.5,
      60, 5, 70, 4, 80, 5.5, 90, 3.5, 100, 4.5, 110, 3, 120, 5, 130, 3.5, 140, 4, 150, 2, 160, 0,
    ];
    for (let i = 0; i < points.length; i += 2) {
      shape.lineTo(points[i], points[i + 1]);
    }
    shape.lineTo(-60, 0);
    return shape;
  }, []);

  const nearShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-60, 0);
    const points = [
      -45, 4.5, -30, 2.5, -15, 6, 0, 3.5, 15, 5.5, 30, 7.5, 45, 5, 60, 7, 75, 4.5, 90, 7.5, 105, 6,
      120, 8, 135, 6, 150, 7, 160, 0,
    ];
    for (let i = 0; i < points.length; i += 2) {
      shape.lineTo(points[i], points[i + 1]);
    }
    shape.lineTo(-60, 0);
    return shape;
  }, []);

  useFrame(() => {
    const p = progress.get();

    if (farRef.current) {
      farRef.current.position.x = farParallax.get();
      const material = (farRef.current.children[0] as THREE.Mesh).material as THREE.MeshBasicMaterial;

      if (p < STAGES.DATING.start) {
        material.color.setHex(0xc8d6e5);
      } else if (p < STAGES.WEDDING.start) {
        material.color.setHex(0xdeb887);
      } else {
        material.color.setHex(0xe8d4c4);
      }
    }

    if (nearRef.current) {
      nearRef.current.position.x = nearParallax.get();
      const material = (nearRef.current.children[0] as THREE.Mesh).material as THREE.MeshBasicMaterial;

      if (p < STAGES.DATING.start) {
        material.color.setHex(0xa8c0d8);
      } else if (p < STAGES.WEDDING.start) {
        material.color.setHex(0xcd853f);
      } else {
        material.color.setHex(0xd4b8a8);
      }
    }
  });

  return (
    <>
      <group ref={farRef} position={[50, -2.5, -25]}>
        <mesh>
          <shapeGeometry args={[farShape]} />
          <meshBasicMaterial transparent opacity={0.5} />
        </mesh>
      </group>
      <group ref={nearRef} position={[50, -3, -18]}>
        <mesh>
          <shapeGeometry args={[nearShape]} />
          <meshBasicMaterial transparent opacity={0.7} />
        </mesh>
      </group>
    </>
  );
}

function CherryTreesLayer({ progress }: { progress: MotionValue<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useLoader(THREE.TextureLoader, ASSETS.cherryTree);
  const parallaxX = useTransform(progress, [0, 1], [0, TOTAL_WIDTH * 0.35]);

  const treeData = useMemo(
    () => [
      { x: -5, scale: 3.5, z: -8 },
      { x: 12, scale: 4.0, z: -9 },
      { x: 28, scale: 3.2, z: -7 },
      { x: 42, scale: 3.8, z: -8 },
      { x: 58, scale: 3.5, z: -9 },
      { x: 75, scale: 4.2, z: -7 },
      { x: 90, scale: 3.6, z: -8 },
      { x: 108, scale: 3.9, z: -9 },
      { x: 125, scale: 3.4, z: -7 },
    ],
    []
  );

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.x = parallaxX.get();

    const p = progress.get();
    groupRef.current.children.forEach((tree) => {
      if (tree instanceof THREE.Mesh) {
        const material = tree.material as THREE.MeshBasicMaterial;
        if (p < STAGES.WEDDING.start) {
          material.opacity = 0.95;
        } else {
          const t = (p - STAGES.WEDDING.start) / 0.25;
          material.opacity = THREE.MathUtils.lerp(0.95, 0.3, t);
        }
      }
    });
  });

  return (
    <group ref={groupRef}>
      {treeData.map((tree, i) => (
        <mesh key={i} position={[tree.x, 0.5, tree.z]}>
          <planeGeometry args={[tree.scale * 1.2, tree.scale * 1.8]} />
          <meshBasicMaterial map={texture} transparent />
        </mesh>
      ))}
    </group>
  );
}

function Ground({ progress }: { progress: MotionValue<number> }) {
  const groundRef = useRef<THREE.Mesh>(null);
  const pathRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const p = progress.get();

    if (groundRef.current) {
      const material = groundRef.current.material as THREE.MeshBasicMaterial;
      if (p < STAGES.DATING.start) {
        material.color.setHex(0x7cba6d);
      } else if (p < STAGES.WEDDING.start) {
        material.color.setHex(0xdaa520);
      } else {
        material.color.setHex(0x98d8aa);
      }
    }

    if (pathRef.current) {
      const material = pathRef.current.material as THREE.MeshBasicMaterial;
      if (p < STAGES.WEDDING.start) {
        material.color.setHex(0xd4a574);
      } else {
        material.color.setHex(0xffb6c1);
      }
    }
  });

  return (
    <>
      <mesh ref={groundRef} position={[60, -4.5, -3]}>
        <planeGeometry args={[250, 4]} />
        <meshBasicMaterial color="#7cba6d" />
      </mesh>
      <mesh ref={pathRef} position={[60, -3.5, -2]}>
        <planeGeometry args={[250, 1.2]} />
        <meshBasicMaterial color="#d4a574" />
      </mesh>
      <mesh position={[60, -2.95, -1.9]}>
        <planeGeometry args={[250, 0.1]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
      </mesh>
    </>
  );
}

function WeddingHallScene({ progress }: { progress: MotionValue<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useLoader(THREE.TextureLoader, ASSETS.weddingHall);

  useFrame(() => {
    if (!groupRef.current) return;
    const p = progress.get();

    const visible = p >= STAGES.WEDDING.start - 0.1;
    const fadeIn = visible ? Math.min((p - (STAGES.WEDDING.start - 0.1)) / 0.15, 1) : 0;

    groupRef.current.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        const material = child.material as THREE.MeshBasicMaterial;
        material.opacity = fadeIn * 0.95;
      }
    });
  });

  return (
    <group ref={groupRef} position={[105, 1.5, -6]}>
      <mesh>
        <planeGeometry args={[12, 10]} />
        <meshBasicMaterial map={texture} transparent opacity={0} />
      </mesh>
    </group>
  );
}

function FloatingPetals({ progress }: { progress: MotionValue<number> }) {
  const groupRef = useRef<THREE.Group>(null);

  const petalData = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      x: (i * 4) % 180 - 30,
      y: -1 + (i * 0.45) % 10,
      z: -4 + (i % 6) * 0.5,
      size: 0.08 + (i % 4) * 0.04,
      speed: 0.3 + (i % 5) * 0.2,
      swaySpeed: 0.4 + (i % 3) * 0.25,
      swayOffset: i * 0.7,
      rotationSpeed: 0.5 + (i % 4) * 0.3,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const time = clock.getElapsedTime();
    const p = progress.get();

    groupRef.current.children.forEach((petal, i) => {
      const data = petalData[i];
      if (!data || !(petal instanceof THREE.Mesh)) return;

      const material = petal.material as THREE.MeshBasicMaterial;

      if (p < STAGES.DATING.start) {
        material.color.setHex(0xffb7c5);
        material.opacity = 0.8;
      } else if (p < STAGES.WEDDING.start) {
        material.color.setHex(i % 2 === 0 ? 0xffa500 : 0xff6347);
        material.opacity = 0.75;
      } else {
        material.color.setHex(i % 3 === 0 ? 0xffd700 : i % 3 === 1 ? 0xffb6c1 : 0xffffff);
        material.opacity = 0.85;
      }

      petal.position.y = data.y + Math.sin(time * data.speed + data.swayOffset) * 0.5;
      petal.position.x = data.x + Math.sin(time * data.swaySpeed + data.swayOffset) * 0.4;
      petal.rotation.z = time * data.rotationSpeed + data.swayOffset;
    });
  });

  return (
    <group ref={groupRef}>
      {petalData.map((data, i) => (
        <mesh key={i} position={[data.x, data.y, data.z]}>
          <circleGeometry args={[data.size, 5]} />
          <meshBasicMaterial transparent side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function WalkingCouple({ progress }: { progress: MotionValue<number> }) {
  const walkingRef = useRef<THREE.Mesh>(null);
  const weddingRef = useRef<THREE.Mesh>(null);

  const walkingTexture = useLoader(THREE.TextureLoader, ASSETS.coupleWalking);
  const weddingTexture = useLoader(THREE.TextureLoader, ASSETS.coupleWedding);

  const coupleX = useTransform(progress, [0, 1], [0, TOTAL_WIDTH]);

  const walkCycle = useRef(0);
  const prevProgress = useRef(0);

  useFrame((_, delta) => {
    const p = progress.get();
    const x = coupleX.get();

    const isMoving = Math.abs(p - prevProgress.current) > 0.0001;
    prevProgress.current = p;

    if (isMoving) {
      walkCycle.current += delta * 6;
    }

    const bob = isMoving ? Math.sin(walkCycle.current) * 0.06 : 0;
    const isWeddingPhase = p >= STAGES.WEDDING.start;

    if (walkingRef.current) {
      walkingRef.current.position.set(x, -1.8 + bob, 5);
      const material = walkingRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = isWeddingPhase ? 0 : 1;
    }

    if (weddingRef.current) {
      weddingRef.current.position.set(x, -1.5, 5);
      const material = weddingRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = isWeddingPhase ? 1 : 0;
    }
  });

  return (
    <>
      <mesh ref={walkingRef}>
        <planeGeometry args={[3, 3.5]} />
        <meshBasicMaterial map={walkingTexture} transparent />
      </mesh>
      <mesh ref={weddingRef}>
        <planeGeometry args={[3.5, 4]} />
        <meshBasicMaterial map={weddingTexture} transparent opacity={0} />
      </mesh>
    </>
  );
}

function StoryIndicator({ progress }: { progress: MotionValue<number> }) {
  const [currentStage, setCurrentStage] = useState(0);

  const stages = [
    { name: "봄", icon: "🌸", desc: "새로운 시작" },
    { name: "만남", icon: "💕", desc: "운명의 만남" },
    { name: "사랑", icon: "🍂", desc: "함께한 시간" },
    { name: "결혼", icon: "💒", desc: "영원한 약속" },
  ];

  useEffect(() => {
    const unsubscribe = progress.on("change", (p) => {
      if (p < STAGES.MEETING.start) setCurrentStage(0);
      else if (p < STAGES.DATING.start) setCurrentStage(1);
      else if (p < STAGES.WEDDING.start) setCurrentStage(2);
      else setCurrentStage(3);
    });
    return unsubscribe;
  }, [progress]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        className="flex items-center gap-4 px-6 py-4 rounded-2xl"
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 182, 193, 0.3)",
          boxShadow: "0 8px 32px rgba(255, 182, 193, 0.2)",
        }}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        {stages.map((stage, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center gap-1 cursor-pointer"
            animate={{
              scale: i === currentStage ? 1.1 : 1,
              opacity: i === currentStage ? 1 : 0.5,
            }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="relative"
              animate={{
                y: i === currentStage ? -2 : 0,
              }}
            >
              <span className="text-2xl">{stage.icon}</span>
              {i === currentStage && (
                <motion.div
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-pink-400"
                  layoutId="indicator"
                />
              )}
            </motion.div>
            <span
              className="text-xs font-medium"
              style={{
                color: i === currentStage ? "#e91e63" : "#999",
              }}
            >
              {stage.name}
            </span>
          </motion.div>
        ))}

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #ffb6c1, #ff69b4)",
              width: `${((currentStage + 1) / stages.length) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>
    </div>
  );
}

function ScrollHint({ progress }: { progress: MotionValue<number> }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const unsubscribe = progress.on("change", (v) => {
      setShow(v < 0.02);
    });
    return unsubscribe;
  }, [progress]);

  return (
    <motion.div
      className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="flex flex-col items-center"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
      >
        <span
          className="text-sm font-medium mb-2 px-4 py-2 rounded-full"
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            color: "#e91e63",
            boxShadow: "0 4px 15px rgba(255, 182, 193, 0.3)",
          }}
        >
          스크롤하여 여정 시작 🌸
        </span>
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="#e91e63"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
