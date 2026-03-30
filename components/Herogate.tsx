"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// HeroGate — AAKAR 2026 · The Official Techno-Cultural Fest
// bg.mp3 audio BG · mute toggle · AJIET top-left · contact bottom
// ─────────────────────────────────────────────────────────────────────────────

export default function HeroGate() {
  const sectionRef  = useRef<HTMLElement>(null);
  const audioRef    = useRef<HTMLAudioElement>(null);
  const [isMobile, setIsMobile]   = useState(false);
  const [mounted,  setMounted]    = useState(false);
  const [muted,    setMuted]      = useState(true);

  // ── Detect mobile ─────────────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    setMounted(true);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Auto-play audio on mount (muted by default to satisfy browser policy) ─
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = true;
    audio.play().catch(() => {
      // Autoplay blocked — user must interact first (handled by toggleMute)
    });
  }, []);

  // ── Mute toggle ───────────────────────────────────────────────────────────
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (muted) {
      // Currently muted → unmute and play
      audio.muted = false;
      audio.play().catch(() => {});
      setMuted(false);
    } else {
      // Currently playing → mute
      audio.muted = true;
      setMuted(true);
    }
  };

  // ── Desktop: scroll-driven parallax ──────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY      = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const logoY    = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const overlayOp = useTransform(scrollYProgress, [0, 0.7], [0.48, 0.72]);
  const taglineY = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);

  // ── Desktop: mouse parallax ───────────────────────────────────────────────
  const rawMX   = useMotionValue(0);
  const rawMY   = useMotionValue(0);
  const rawBgMX = useMotionValue(0);
  const rawBgMY = useMotionValue(0);
  const mX   = useSpring(rawMX,   { stiffness: 55, damping: 22 });
  const mY   = useSpring(rawMY,   { stiffness: 55, damping: 22 });
  const bgMX = useSpring(rawBgMX, { stiffness: 22, damping: 30 });
  const bgMY = useSpring(rawBgMY, { stiffness: 22, damping: 30 });

  useEffect(() => {
    if (isMobile) return;
    const handler = (e: MouseEvent) => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      rawMX.set(((e.clientX - cx) / cx) *  16);
      rawMY.set(((e.clientY - cy) / cy) *  10);
      rawBgMX.set(((e.clientX - cx) / cx) * -9);
      rawBgMY.set(((e.clientY - cy) / cy) * -6);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [isMobile, rawMX, rawMY, rawBgMX, rawBgMY]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Noto+Serif+JP:wght@300;400&display=swap');

        .hero-gate *, .hero-gate *::before, .hero-gate *::after { box-sizing: border-box; }

        /* ── Mobile BG: slow float from CENTER outward ──────── */
        @keyframes mobileDrift {
          0%   { transform: scale(1.08) translate(  0px,   0px); }
          25%  { transform: scale(1.10) translate(-12px,  -7px); }
          50%  { transform: scale(1.09) translate(  9px, -12px); }
          75%  { transform: scale(1.10) translate( 10px,   5px); }
          100% { transform: scale(1.08) translate(  0px,   0px); }
        }
        .mobile-drift {
          transform-origin: center center;
          animation: mobileDrift 20s ease-in-out infinite;
        }

        /* ── Vignette breathe ───────────────────────────────── */
        @keyframes vignettePulse {
          0%, 100% { opacity: 1;    }
          50%       { opacity: 0.87; }
        }
        .vignette-pulse { animation: vignettePulse 7s ease-in-out infinite; }

        /* ── Scanlines ──────────────────────────────────────── */
        .scanlines {
          background-image: repeating-linear-gradient(
            to bottom,
            transparent 0px, transparent 3px,
            rgba(0,0,0,0.05) 3px, rgba(0,0,0,0.05) 4px
          );
          pointer-events: none;
        }

        /* ── AAKAR logo warm glow ────────────────────────────── */
        @keyframes logoPulse {
          0%, 100% { filter: drop-shadow(0 0 24px rgba(255,255,255,0.30)) drop-shadow(0 0 60px rgba(255,110,50,0.22)); }
          50%       { filter: drop-shadow(0 0 44px rgba(255,255,255,0.55)) drop-shadow(0 0 95px rgba(255,140,70,0.36)); }
        }
        .logo-glow { animation: logoPulse 4s ease-in-out infinite; }

        /* ── Tagline character reveal ────────────────────────── */
        .tc {
          display: inline-block;
          opacity: 0;
          transform: translateY(20px);
          animation: charUp 0.65s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        @keyframes charUp { to { opacity: 1; transform: translateY(0); } }

        /* ── Badge shimmer ───────────────────────────────────── */
        @keyframes badgeShimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .badge-shimmer {
          background: linear-gradient(
            105deg,
            rgba(255,255,255,0.04) 0%,
            rgba(255,255,255,0.15) 40%,
            rgba(255,255,255,0.04) 60%,
            rgba(255,255,255,0.01) 100%
          );
          background-size: 200% auto;
          animation: badgeShimmer 4.5s linear infinite;
        }

        /* ── Mute button ─────────────────────────────────────── */
        .mute-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 50%;
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(8px);
          cursor: pointer;
          transition: border-color 0.25s, background 0.25s;
        }
        .mute-btn:hover {
          border-color: rgba(255,255,255,0.45);
          background: rgba(0,0,0,0.55);
        }

        /* ── Contact link ────────────────────────────────────── */
        .contact-link {
          position: relative;
          color: rgba(255,255,255,0.30);
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          text-decoration: none;
          font-family: 'Cinzel', serif;
          transition: color 0.3s;
        }
        .contact-link::after {
          content: '';
          position: absolute;
          left: 0; bottom: -2px;
          height: 1px; width: 0;
          background: rgba(255,255,255,0.5);
          transition: width 0.3s ease;
        }
        .contact-link:hover { color: rgba(255,255,255,0.75); }
        .contact-link:hover::after { width: 100%; }
      `}</style>

      {/* ════════════════════════════════════════════════ SECTION ══ */}
      <section
        ref={sectionRef}
        className="hero-gate relative w-full h-screen min-h-150 overflow-hidden bg-black"
        style={{ fontFamily: "'Cinzel', serif" }}
      >

        {/* ── BACKGROUND AUDIO ─────────────────────────────────────── */}
        <audio
          ref={audioRef}
          src="/bg.mp3"
          loop
          muted
          preload="auto"
        />

        {/* ── BACKGROUND IMAGE ─────────────────────────────────────── */}
        <motion.div
          className="absolute z-0"
          style={
            !isMobile
              ? { inset: "-70px", y: bgY, x: bgMX }
              : { inset: 0 }
          }
        >
          <motion.div
            className={
              isMobile && mounted
                ? "mobile-drift absolute inset-0"
                : "absolute inset-0"
            }
            style={!isMobile ? { y: bgMY } : undefined}
          >
            <Image
              src="/aakar26BG.jpg"
              alt=""
              fill
              priority
              quality={90}
              sizes="110vw"
              style={{
                objectFit: "cover",
                objectPosition: "center 28%",
              }}
            />
          </motion.div>
        </motion.div>

        {/* ── SCANLINES ────────────────────────────────────────────── */}
        <div className="scanlines absolute inset-0 z-10" />

        {/* ── GRADIENT OVERLAY ─────────────────────────────────────── */}
        {!isMobile ? (
          <motion.div
            className="vignette-pulse absolute inset-0 z-10 pointer-events-none"
            style={{
              opacity: overlayOp,
              background: [
                "radial-gradient(ellipse 110% 90% at 50% 110%, #080002 0%, transparent 60%)",
                "linear-gradient(to top, rgba(6,0,2,0.90) 0%, rgba(8,0,4,0.40) 38%, rgba(4,0,8,0.10) 100%)",
                "linear-gradient(to bottom, rgba(4,0,6,0.55) 0%, transparent 26%)",
              ].join(", "),
            }}
          />
        ) : (
          <div
            className="vignette-pulse absolute inset-0 z-10 pointer-events-none"
            style={{
              opacity: 0.65,
              background: [
                "radial-gradient(ellipse 110% 90% at 50% 110%, #080002 0%, transparent 60%)",
                "linear-gradient(to top, rgba(6,0,2,0.92) 0%, rgba(8,0,4,0.45) 40%, rgba(4,0,8,0.12) 100%)",
                "linear-gradient(to bottom, rgba(4,0,6,0.60) 0%, transparent 26%)",
              ].join(", "),
            }}
          />
        )}

        {/* ══════════════════════════════════════════════════ NAV ══ */}
        <motion.nav
          className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-10 pt-4 pb-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Left — AJ INSTITUTE logo */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src="/aj.png"
              alt="A J Institute of Engineering & Technology, Mangaluru"
              width={400}
              height={120}
              priority
              className="w-42.5 md:w-60 h-auto"
            />
          </motion.div>

          {/* Right — mute button */}
          <motion.button
            className="mute-btn"
            onClick={toggleMute}
            aria-label={muted ? "Unmute music" : "Mute music"}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            whileTap={{ scale: 0.9 }}
          >
            {muted ? (
              /* Muted — speaker with X */
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              /* Unmuted — speaker with waves */
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            )}
          </motion.button>
        </motion.nav>

        {/* ═════════════════════════════════════════════ CENTER ══ */}
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center">

          {/* Accent line + badge */}
          <motion.div
            className="flex items-center gap-2 md:gap-4"
            style={{
              transformOrigin: "center",
              marginBottom: isMobile ? "-60px" : "-110px",
              marginTop: isMobile ? "80px" : "70px",
            }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="h-px w-6 md:w-20"
              style={{ background: "linear-gradient(to right, transparent, rgba(255,195,140,0.55))", flexShrink: 0 }}
            />
            <span
              className="badge-shimmer border border-white/20 uppercase"
              style={{
                backdropFilter: "blur(6px)",
                borderRadius: "2px",
                color: "rgba(255,255,255,0.72)",
                textShadow: "0 0 18px rgba(255,180,120,0.5)",
                fontSize: isMobile ? "7.5px" : "11px",
                letterSpacing: isMobile ? "0.18em" : "0.44em",
                padding: isMobile ? "5px 10px" : "5px 16px",
                whiteSpace: "nowrap",
              }}
            >
              The Official Techno-Cultural Fest
            </span>
            <div
              className="h-px w-6 md:w-20"
              style={{ background: "linear-gradient(to left, transparent, rgba(255,195,140,0.55))", flexShrink: 0 }}
            />
          </motion.div>

          {/* AAKAR 2026 logo */}
          <motion.div
            style={!isMobile ? { x: mX } : undefined}
            initial={{ opacity: 0, scale: 0.84, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.4, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {!isMobile ? (
              <motion.div style={{ y: logoY }}>
                <Image
                  src="/aklogo.png"
                  alt="AAKAR 2026"
                  width={720}
                  height={275}
                  priority
                  className="logo-glow"
                  style={{ objectFit: "contain", width: "min(82vw, 720px)", height: "auto" }}
                />
              </motion.div>
            ) : (
              <Image
                src="/aklogo.png"
                alt="AAKAR 2026"
                width={640}
                height={245}
                priority
                className="logo-glow"
                style={{ objectFit: "contain", width: "min(98vw, 640px)", height: "auto" }}
              />
            )}
          </motion.div>

          {/* Tagline */}
          <motion.div
            className="mt-9 md:mt-12 text-center"
            style={
              !isMobile
                ? { y: taglineY }
                : { marginTop: "320px" }
            }
          >
            <div className="overflow-hidden mb-2">
              {mounted && (
                <p
                  style={{
                    fontSize: isMobile ? "clamp(0.78rem, 4.5vw, 1rem)" : "clamp(1.4rem, 3.6vw, 2.75rem)",
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 300,
                    color: "#fff",
                    letterSpacing: isMobile ? "0.15em" : "clamp(0.12em, 1.4vw, 0.24em)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {"A New Era Begins.".split("").map((ch, i) => (
                    <span
                      key={i}
                      className="tc"
                      style={{
                        animationDelay: `${1.05 + i * 0.044}s`,
                        whiteSpace: ch === " " ? "pre" : undefined,
                      }}
                    >
                      {ch}
                    </span>
                  ))}
                </p>
              )}
            </div>

            {/* Enter Aakar Button */}
            <motion.div
              className="flex justify-center my-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 1 }}
            >
              <Link href="/countdown" className="badge-shimmer border border-white/20 uppercase transition-all duration-300 hover:border-white/50" style={{ backdropFilter: "blur(6px)", borderRadius: "2px", color: "rgba(255,255,255,0.85)", textShadow: "0 0 18px rgba(255,180,120,0.5)", fontSize: "12px", letterSpacing: "0.3em", padding: "12px 28px", whiteSpace: "nowrap" }}>
                Enter Aakar
              </Link>
            </motion.div>

            {/* Japanese subtitle */}
            <motion.p
              style={{
                fontFamily: "'Noto Serif JP', serif",
                fontSize: "clamp(9px, 1.1vw, 12px)",
                letterSpacing: "0.46em",
                color: "rgba(255,255,255,0.25)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.3, duration: 1.3 }}
            >
              新たな時代の幕開け
            </motion.p>
          </motion.div>
        </div>

        {/* ═════════════════════════════════ BOTTOM BAR ══ */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 pb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          {/* Left — flavour text (desktop only) */}
          <span
            className="hidden md:block text-[9px] tracking-[0.35em] uppercase pointer-events-none"
            style={{ color: "rgba(255,255,255,0.16)", fontFamily: "'Cinzel', serif" }}
          >
            Where Technology Meets Culture
          </span>

          {/* Right — contact 
          <a
            href="mailto:prajwal@ajiet.edu.in"
            className="contact-link"
          >
            Contact Us
          </a>*/}
        </motion.div>

        {/* ════════════════════════════ SIDE VERTICAL LABELS ══ */}
        <motion.div
          className="absolute left-5 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5, duration: 0.9 }}
        >
          <div className="h-16 w-px" style={{ background: "rgba(255,255,255,0.09)" }} />
          <span style={{ writingMode: "vertical-rl", fontFamily: "'Cinzel', serif", fontSize: "9px", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(255,255,255,0.16)" }}>
            Aakar 2026
          </span>
          <div className="h-16 w-px" style={{ background: "rgba(255,255,255,0.09)" }} />
        </motion.div>

        <motion.div
          className="absolute right-5 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5, duration: 0.9 }}
        >
          <div className="h-16 w-px" style={{ background: "rgba(255,255,255,0.09)" }} />
          <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontFamily: "'Cinzel', serif", fontSize: "9px", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(255,255,255,0.16)" }}>
            AJIET · Mangaluru
          </span>
          <div className="h-16 w-px" style={{ background: "rgba(255,255,255,0.09)" }} />
        </motion.div>

      </section>
    </>
  );
}