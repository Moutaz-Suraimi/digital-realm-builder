import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useState, useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, MeshWobbleMaterial } from "@react-three/drei";
import * as THREE from "three";

const WHATSAPP = "https://wa.me/967780930635";

/* ─── 3D Particles ─── */
const Particles = ({ count = 120 }: { count?: number }) => {
  const mesh = useRef<THREE.Points>(null!);
  const { viewport } = useThree();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const purple = new THREE.Color("#7B2FF7");
    const gold = new THREE.Color("#D4AF37");
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * viewport.width * 3;
      pos[i * 3 + 1] = (Math.random() - 0.5) * viewport.height * 3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
      const c = Math.random() > 0.3 ? purple : gold;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count, viewport]);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += delta * 0.02;
    mesh.current.rotation.x += delta * 0.01;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.7} sizeAttenuation />
    </points>
  );
};

/* ─── Floating abstract shapes ─── */
const FloatingShape = ({
  position,
  color,
  shape,
  scale = 1,
}: {
  position: [number, number, number];
  color: string;
  shape: "torus" | "icosahedron" | "octahedron" | "dodecahedron";
  scale?: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
    meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.2) * 0.2;
  });

  const geo = useMemo(() => {
    switch (shape) {
      case "torus": return <torusGeometry args={[1, 0.4, 16, 32]} />;
      case "icosahedron": return <icosahedronGeometry args={[1, 0]} />;
      case "octahedron": return <octahedronGeometry args={[1, 0]} />;
      case "dodecahedron": return <dodecahedronGeometry args={[1.2, 0]} />;
    }
  }, [shape]);

  return (
    <Float speed={1.5} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={meshRef} position={position} scale={scale}>
        {geo}
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.15}
          wireframe
          distort={0.3}
          speed={2}
        />
      </mesh>
    </Float>
  );
};

/* ─── Central glowing orb ─── */
const CentralOrb = () => {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.08);
  });

  return (
    <Float speed={2} floatIntensity={0.5}>
      <mesh ref={ref} position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.8, 64, 64]} />
        <MeshWobbleMaterial
          color="#7B2FF7"
          emissive="#7B2FF7"
          emissiveIntensity={0.6}
          transparent
          opacity={0.25}
          factor={0.4}
          speed={1.5}
        />
      </mesh>
      {/* Inner bright core */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshBasicMaterial color="#7B2FF7" transparent opacity={0.5} />
      </mesh>
      {/* Gold accent ring */}
      <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.1, 0.02, 16, 64]} />
        <meshBasicMaterial color="#D4AF37" transparent opacity={0.4} />
      </mesh>
    </Float>
  );
};

/* ─── Mouse-reactive camera ─── */
const MouseCamera = () => {
  const { camera } = useThree();
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, state.pointer.x * 0.5, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, state.pointer.y * 0.3 + 0.5, 0.02);
    camera.lookAt(0, 0, 0);
    camera.position.z = 6 + Math.sin(t * 0.15) * 0.3;
  });

  return null;
};

/* ─── 3D Scene ─── */
const Scene3D = () => (
  <>
    <ambientLight intensity={0.15} />
    <pointLight position={[5, 5, 5]} intensity={0.8} color="#7B2FF7" />
    <pointLight position={[-5, -3, 3]} intensity={0.4} color="#D4AF37" />
    <pointLight position={[0, 3, -5]} intensity={0.3} color="#7B2FF7" />

    <MouseCamera />
    <Particles count={150} />
    <CentralOrb />

    <FloatingShape position={[-3.5, 2, -3]} color="#7B2FF7" shape="torus" scale={0.7} />
    <FloatingShape position={[4, -1.5, -4]} color="#D4AF37" shape="icosahedron" scale={0.5} />
    <FloatingShape position={[-2, -2.5, -2]} color="#D4AF37" shape="octahedron" scale={0.4} />
    <FloatingShape position={[3, 2.5, -5]} color="#7B2FF7" shape="dodecahedron" scale={0.6} />
    <FloatingShape position={[0, -3, -6]} color="#7B2FF7" shape="torus" scale={0.5} />
    <FloatingShape position={[-4, 0, -5]} color="#D4AF37" shape="dodecahedron" scale={0.35} />

    <fog attach="fog" args={["#0B0B0B", 5, 18]} />
  </>
);

/* ─── Hero Component ─── */
const HeroSection = () => {
  const { t, lang } = useLanguage();
  const [hoverPrimary, setHoverPrimary] = useState(false);
  const [hoverSecondary, setHoverSecondary] = useState(false);

  const waMessage = encodeURIComponent(
    lang === "ar"
      ? "مرحباً، أريد حجز استشارة مجانية مع فريق صُرَيمي ميديا."
      : lang === "zh"
      ? "你好，我想预约Surimi Media的免费咨询。"
      : "Hello, I want to book a free consultation with Surimi Media."
  );

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: "#0B0B0B" }}>
      {/* Three.js Canvas */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <Canvas
            camera={{ position: [0, 0.5, 6], fov: 50 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true }}
            style={{ background: "transparent" }}
          >
            <Scene3D />
          </Canvas>
        </Suspense>
      </div>

      {/* Ambient glow overlays */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[150px] opacity-20" style={{ background: "#7B2FF7" }} />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full blur-[120px] opacity-15" style={{ background: "#D4AF37" }} />

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center max-w-5xl mx-auto px-6 py-20 text-center">
        {/* Brand tag */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-xs md:text-sm tracking-[0.3em] uppercase mb-8"
          style={{ color: "#D4AF37" }}
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
            color: "#fff",
            textShadow: "0 0 40px rgba(123, 47, 247, 0.4), 0 0 80px rgba(123, 47, 247, 0.15)",
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
            color: "rgba(255,255,255,0.7)",
            textShadow: "0 0 20px rgba(123, 47, 247, 0.2)",
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
          {/* Primary CTA – Book Free Consultation */}
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
                ? "0 0 30px rgba(123, 47, 247, 0.6), 0 0 60px rgba(123, 47, 247, 0.3), 0 10px 40px rgba(0,0,0,0.4)"
                : "0 0 15px rgba(123, 47, 247, 0.3), 0 0 45px rgba(123, 47, 247, 0.1), 0 8px 30px rgba(0,0,0,0.3)",
              transformStyle: "preserve-3d",
              transition: "box-shadow 0.3s ease",
            }}
          >
            <span className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              <motion.span
                className="absolute inset-0"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }}
                initial={{ x: "-100%" }}
                animate={hoverPrimary ? { x: "100%" } : { x: "-100%" }}
                transition={{ duration: 0.6 }}
              />
            </span>
            <span className="relative z-10">{t("hero.cta.consult")}</span>
          </motion.a>

          {/* Secondary CTA – Chat on WhatsApp */}
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
              borderColor: "#D4AF37",
              color: "#D4AF37",
              background: "rgba(212, 175, 55, 0.08)",
              boxShadow: hoverSecondary
                ? "0 0 25px rgba(212, 175, 55, 0.4), 0 0 50px rgba(212, 175, 55, 0.15), 0 8px 30px rgba(0,0,0,0.3)"
                : "0 0 10px rgba(212, 175, 55, 0.15), 0 4px 20px rgba(0,0,0,0.2)",
              transformStyle: "preserve-3d",
              transition: "box-shadow 0.3s ease",
            }}
          >
            <span className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              <motion.span
                className="absolute inset-0"
                style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent)" }}
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
    </section>
  );
};

export default HeroSection;
