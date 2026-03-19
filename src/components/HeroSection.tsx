import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useState, useRef, useMemo, Suspense, lazy, useEffect } from "react";
import * as THREE from "three";
import { Bot } from "lucide-react";

const WHATSAPP = "https://wa.me/967780930635";

/* ─── WebGL support detection ─── */
const detectWebGL = (): boolean => {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
};

/* ─── Detect mobile for reduced particles ─── */
const isMobileDevice = () =>
  typeof window !== "undefined" && window.innerWidth < 768;

/* ─── Detect light mode ─── */
const useIsLightMode = () => {
  const [light, setLight] = useState(
    () => document.documentElement.classList.contains("light")
  );
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setLight(document.documentElement.classList.contains("light"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);
  return light;
};

/* ─── Lazy-loaded 3D Canvas ─── */
const LazyCanvas = lazy(() =>
  import("@react-three/fiber").then((mod) => ({ default: mod.Canvas }))
);

/* ─── R3F hooks / helpers (imported lazily inside 3D components) ─── */
import { useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, MeshWobbleMaterial, Stars } from "@react-three/drei";

/* ─── Galaxy Star Field ─── */
const GalaxyStars = ({ isLight }: { isLight: boolean }) => {
  const starsRef = useRef<THREE.Points>(null!);
  const mobile = isMobileDevice();
  const count = mobile ? 300 : 800;

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 5 + Math.random() * 25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      sz[i] = Math.random() * 0.08 + 0.02;
    }
    return [pos, sz];
  }, [count]);

  useFrame((_, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.008;
      starsRef.current.rotation.x += delta * 0.003;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color={isLight ? "#7B2FF7" : "#c4a0ff"}
        transparent
        opacity={isLight ? 0.6 : 0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

/* ─── Swirling Nebula Particles ─── */
const NebulaParticles = ({ isLight }: { isLight: boolean }) => {
  const ref = useRef<THREE.Points>(null!);
  const mobile = isMobileDevice();
  const count = mobile ? 120 : 350;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const purpleDark = new THREE.Color(isLight ? "#5b1fd0" : "#3a0f7a");
    const purpleBright = new THREE.Color(isLight ? "#7B2FF7" : "#7B2FF7");
    const purpleLight = new THREE.Color(isLight ? "#9333ea" : "#a855f7");

    for (let i = 0; i < count; i++) {
      const arm = Math.floor(Math.random() * 3);
      const armAngle = (arm / 3) * Math.PI * 2;
      const dist = Math.random() * 8 + 1;
      const spiral = armAngle + dist * 0.4;
      const spread = (Math.random() - 0.5) * 2;

      pos[i * 3] = Math.cos(spiral) * dist + spread;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
      pos[i * 3 + 2] = Math.sin(spiral) * dist + spread - 5;

      const c =
        Math.random() > 0.6
          ? purpleBright
          : Math.random() > 0.4
          ? purpleLight
          : purpleDark;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count, isLight]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.015;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={isLight ? 0.45 : 0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

/* ─── Floating Asteroid / Geometric Shape ─── */
const Asteroid = ({
  position,
  scale = 1,
  shape,
  isLight,
}: {
  position: [number, number, number];
  scale?: number;
  shape: "icosahedron" | "octahedron" | "dodecahedron" | "torus";
  isLight: boolean;
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x = t * 0.15 + position[0];
    meshRef.current.rotation.z = t * 0.1 + position[1];
    meshRef.current.position.y =
      position[1] + Math.sin(t * 0.5 + position[0]) * 0.3;
  });

  const geo = useMemo(() => {
    switch (shape) {
      case "torus":
        return <torusGeometry args={[1, 0.35, 16, 32]} />;
      case "icosahedron":
        return <icosahedronGeometry args={[1, 0]} />;
      case "octahedron":
        return <octahedronGeometry args={[1, 0]} />;
      case "dodecahedron":
        return <dodecahedronGeometry args={[1.1, 0]} />;
    }
  }, [shape]);

  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} scale={scale}>
        {geo}
        <MeshDistortMaterial
          color={isLight ? "#7B2FF7" : "#7B2FF7"}
          emissive={isLight ? "#7B2FF7" : "#4a0e8f"}
          emissiveIntensity={isLight ? 0.25 : 0.3}
          transparent
          opacity={isLight ? 0.22 : 0.12}
          wireframe
          distort={0.25}
          speed={1.5}
        />
      </mesh>
    </Float>
  );
};

/* ─── Central Nebula Core ─── */
const NebulaCore = ({ isLight }: { isLight: boolean }) => {
  const ref = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.scale.setScalar(1 + Math.sin(t * 1.2) * 0.06);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.15;
      ringRef.current.rotation.x = Math.sin(t * 0.3) * 0.2 + Math.PI / 2;
    }
  });

  return (
    <Float speed={1.5} floatIntensity={0.4}>
      <mesh ref={ref} position={[0, 0.2, -2]}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <MeshWobbleMaterial
          color={isLight ? "#a78bfa" : "#7B2FF7"}
          emissive={isLight ? "#7c3aed" : "#7B2FF7"}
          emissiveIntensity={isLight ? 0.3 : 0.5}
          transparent
          opacity={isLight ? 0.08 : 0.12}
          factor={0.3}
          speed={1}
        />
      </mesh>
      <mesh position={[0, 0.2, -2]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshBasicMaterial
          color={isLight ? "#8b5cf6" : "#9b4dff"}
          transparent
          opacity={isLight ? 0.25 : 0.4}
        />
      </mesh>
      <mesh ref={ringRef} position={[0, 0.2, -2]}>
        <torusGeometry args={[1.8, 0.015, 16, 100]} />
        <meshBasicMaterial
          color={isLight ? "#a78bfa" : "#7B2FF7"}
          transparent
          opacity={isLight ? 0.2 : 0.3}
        />
      </mesh>
      <mesh
        position={[0, 0.2, -2]}
        rotation={[Math.PI / 3, Math.PI / 4, 0]}
      >
        <torusGeometry args={[2.2, 0.01, 16, 100]} />
        <meshBasicMaterial
          color={isLight ? "#c4b5fd" : "#a855f7"}
          transparent
          opacity={isLight ? 0.1 : 0.15}
        />
      </mesh>
    </Float>
  );
};

/* ─── Mouse-reactive camera ─── */
const MouseCamera = () => {
  const { camera } = useThree();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      state.pointer.x * 0.6,
      0.015
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      state.pointer.y * 0.4 + 0.3,
      0.015
    );
    camera.position.z = 6 + Math.sin(t * 0.1) * 0.2;
    camera.lookAt(0, 0, -2);
  });

  return null;
};

/* ─── 3D Galaxy Scene ─── */
const GalaxyScene = ({ isLight }: { isLight: boolean }) => {
  const mobile = isMobileDevice();
  return (
    <>
      <ambientLight intensity={isLight ? 0.25 : 0.08} />
      <pointLight
        position={[5, 5, 5]}
        intensity={isLight ? 0.4 : 0.6}
        color={isLight ? "#8b5cf6" : "#7B2FF7"}
      />
      <pointLight
        position={[-5, -3, 3]}
        intensity={isLight ? 0.2 : 0.3}
        color={isLight ? "#a78bfa" : "#a855f7"}
      />
      <pointLight
        position={[0, 4, -5]}
        intensity={isLight ? 0.3 : 0.4}
        color={isLight ? "#8b5cf6" : "#7B2FF7"}
      />
      <pointLight
        position={[3, -2, -4]}
        intensity={0.2}
        color={isLight ? "#7c3aed" : "#6320c9"}
      />

      <MouseCamera />

      <Stars
        radius={30}
        depth={60}
        count={mobile ? 800 : 2000}
        factor={3}
        saturation={isLight ? 0.4 : 0.8}
        fade
        speed={0.5}
      />

      <GalaxyStars isLight={isLight} />
      <NebulaParticles isLight={isLight} />
      <NebulaCore isLight={isLight} />

      {/* Floating asteroids — fewer on mobile */}
      <Asteroid position={[-4, 2, -6]} shape="icosahedron" scale={0.6} isLight={isLight} />
      <Asteroid position={[5, -1, -8]} shape="dodecahedron" scale={0.5} isLight={isLight} />
      <Asteroid position={[-3, -2.5, -4]} shape="octahedron" scale={0.4} isLight={isLight} />
      <Asteroid position={[4, 3, -10]} shape="torus" scale={0.7} isLight={isLight} />
      {!mobile && (
        <>
          <Asteroid position={[-6, 0, -7]} shape="dodecahedron" scale={0.35} isLight={isLight} />
          <Asteroid position={[2, -3, -5]} shape="icosahedron" scale={0.3} isLight={isLight} />
          <Asteroid position={[0, 4, -9]} shape="octahedron" scale={0.45} isLight={isLight} />
        </>
      )}

      <fog
        attach="fog"
        args={[isLight ? "#ede9fe" : "#0B0B0B", 6, 30]}
      />
    </>
  );
};

/* ─── Static fallback for no-WebGL ─── */
const StaticFallback = ({ isLight }: { isLight: boolean }) => (
  <div
    className="absolute inset-0"
    style={{
      background: isLight
        ? "radial-gradient(ellipse at 50% 40%, hsl(265 60% 92%) 0%, hsl(250 20% 96%) 60%, hsl(250 15% 94%) 100%)"
        : "radial-gradient(ellipse at 50% 40%, #1a0533 0%, #0B0B0B 60%, #0B0B0B 100%)",
    }}
  >
    {/* Static purple glow orbs */}
    <div
      className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none"
      style={{
        background: isLight
          ? "hsl(265 80% 75% / 0.25)"
          : "hsl(265 90% 60% / 0.15)",
      }}
    />
    <div
      className="absolute bottom-1/3 right-1/4 w-[250px] h-[250px] rounded-full blur-[100px] pointer-events-none"
      style={{
        background: isLight
          ? "hsl(275 70% 70% / 0.2)"
          : "hsl(275 85% 55% / 0.1)",
      }}
    />
  </div>
);

/* ─── Hero Component ─── */
const HeroSection = () => {
  const { t, lang } = useLanguage();
  const [hoverPrimary, setHoverPrimary] = useState(false);
  const [hoverSecondary, setHoverSecondary] = useState(false);
  const [webglSupported] = useState(detectWebGL);
  const isLight = useIsLightMode();

  const waMessage = encodeURIComponent(
    lang === "ar"
      ? "مرحباً، أريد حجز استشارة مجانية مع فريق صُرَيمي ميديا."
      : lang === "zh"
      ? "你好，我想预约Surimi Media的免费咨询。"
      : "Hello, I want to book a free consultation with Surimi Media."
  );

  const bgColor = isLight ? "#ede9fe" : "#0B0B0B";
  const textColor = isLight ? "#1e1b4b" : "#fff";
  const subTextColor = isLight ? "rgba(30,27,75,0.65)" : "rgba(255,255,255,0.65)";
  const purpleGlow = isLight
    ? "0 0 40px rgba(139, 92, 246, 0.3), 0 0 80px rgba(139, 92, 246, 0.1)"
    : "0 0 40px rgba(123, 47, 247, 0.5), 0 0 80px rgba(123, 47, 247, 0.2), 0 2px 20px rgba(0,0,0,0.8)";
  const subTextShadow = isLight
    ? "0 0 30px rgba(139, 92, 246, 0.15)"
    : "0 0 30px rgba(123, 47, 247, 0.25)";

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: bgColor }}
    >
      {/* 3D Canvas or static fallback */}
      <div className="absolute inset-0 z-0">
        {webglSupported ? (
          <Suspense fallback={<StaticFallback isLight={isLight} />}>
            <LazyCanvas
              camera={{ position: [0, 0.3, 6], fov: 50 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true, alpha: true }}
              style={{ background: bgColor }}
            >
              <GalaxyScene isLight={isLight} />
            </LazyCanvas>
          </Suspense>
        ) : (
          <StaticFallback isLight={isLight} />
        )}
      </div>

      {/* Purple nebula glow overlays */}
      <div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[180px] pointer-events-none"
        style={{
          background: isLight ? "#a78bfa" : "#7B2FF7",
          opacity: isLight ? 0.1 : 0.15,
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full blur-[150px] pointer-events-none"
        style={{
          background: isLight ? "#8b5cf6" : "#a855f7",
          opacity: isLight ? 0.08 : 0.1,
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[200px] opacity-[0.07] pointer-events-none"
        style={{ background: isLight ? "#7c3aed" : "#6320c9" }}
      />

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center max-w-5xl mx-auto px-6 py-20 text-center">
        {/* Brand tag */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-xs md:text-sm tracking-[0.3em] uppercase mb-8"
          style={{ color: isLight ? "#7c3aed" : "#a78bfa" }}
        >
          الصُرَيْمي ميديا — Surimi Media
        </motion.p>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40, rotateX: -15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
          style={{
            color: textColor,
            textShadow: purpleGlow,
            transformStyle: "preserve-3d",
          }}
        >
          {t("hero.headline")}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="text-base sm:text-lg md:text-xl max-w-3xl mb-10 leading-relaxed"
          style={{
            color: subTextColor,
            textShadow: subTextShadow,
          }}
        >
          {t("hero.subheadline")}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
        >
          {/* Primary CTA */}
          <motion.a
            href={`${WHATSAPP}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHoverPrimary(true)}
            onMouseLeave={() => setHoverPrimary(false)}
            whileHover={{ scale: 1.06, rotateY: -3, rotateX: 2 }}
            whileTap={{ scale: 0.96 }}
            className="relative px-8 py-4 md:px-10 md:py-5 rounded-2xl font-bold text-base md:text-lg cursor-pointer overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #7B2FF7, #9b59f7)",
              color: "#fff",
              boxShadow: hoverPrimary
                ? "0 0 35px rgba(123, 47, 247, 0.7), 0 0 70px rgba(123, 47, 247, 0.3), 0 10px 40px rgba(0,0,0,0.5)"
                : "0 0 15px rgba(123, 47, 247, 0.35), 0 0 45px rgba(123, 47, 247, 0.1), 0 8px 30px rgba(0,0,0,0.4)",
              transformStyle: "preserve-3d",
              transition: "box-shadow 0.3s ease",
            }}
          >
            <span className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              <motion.span
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                }}
                initial={{ x: "-100%" }}
                animate={hoverPrimary ? { x: "100%" } : { x: "-100%" }}
                transition={{ duration: 0.6 }}
              />
            </span>
            <span className="relative z-10">{t("hero.cta.consult")}</span>
          </motion.a>

          {/* Secondary CTA */}
          <motion.a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHoverSecondary(true)}
            onMouseLeave={() => setHoverSecondary(false)}
            whileHover={{ scale: 1.06, rotateY: 3, rotateX: 2 }}
            whileTap={{ scale: 0.96 }}
            className="relative px-8 py-4 md:px-10 md:py-5 rounded-2xl font-bold text-base md:text-lg cursor-pointer overflow-hidden border-2"
            style={{
              borderColor: "#7B2FF7",
              color: isLight ? "#6d28d9" : "#c4a0ff",
              background: isLight
                ? "rgba(139, 92, 246, 0.1)"
                : "rgba(123, 47, 247, 0.08)",
              boxShadow: hoverSecondary
                ? "0 0 30px rgba(123, 47, 247, 0.5), 0 0 60px rgba(123, 47, 247, 0.2), 0 8px 30px rgba(0,0,0,0.4)"
                : "0 0 10px rgba(123, 47, 247, 0.2), 0 4px 20px rgba(0,0,0,0.3)",
              transformStyle: "preserve-3d",
              transition: "box-shadow 0.3s ease",
            }}
          >
            <span className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              <motion.span
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(123,47,247,0.15), transparent)",
                }}
                initial={{ x: "-100%" }}
                animate={hoverSecondary ? { x: "100%" } : { x: "-100%" }}
                transition={{ duration: 0.6 }}
              />
            </span>
            <span className="relative z-10">{t("hero.cta.whatsapp")}</span>
          </motion.a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 flex items-start justify-center pt-2"
            style={{ borderColor: "rgba(123, 47, 247, 0.4)" }}
          >
            <motion.div
              animate={{ opacity: [1, 0.3, 1], y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#7B2FF7" }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Floating AI Assistant Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          // Trigger chatbot widget open
          const chatBtn = document.querySelector<HTMLButtonElement>(
            "[data-chatbot-trigger]"
          );
          if (chatBtn) chatBtn.click();
        }}
        className="fixed bottom-24 z-40 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer pulse-glow"
        style={{
          right: lang === "ar" ? "auto" : "1.5rem",
          left: lang === "ar" ? "1.5rem" : "auto",
          background: "linear-gradient(135deg, #7B2FF7, #9b59f7)",
          boxShadow:
            "0 0 25px rgba(123,47,247,0.6), 0 0 60px rgba(123,47,247,0.2)",
        }}
        aria-label="AI Assistant"
      >
        <Bot className="w-6 h-6 text-white" />
      </motion.button>
    </section>
  );
};

export default HeroSection;
