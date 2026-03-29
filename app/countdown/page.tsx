"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CountdownPage() {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    // April 24, 2026 UTC (or specific timezone depending on need, assuming 00:00 local time)
    const targetDate = new Date("2026-04-24T00:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden flex flex-col items-center justify-center text-white font-sans">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image 
          src="/aakar26BG.jpg" 
          alt="Aakar Background" 
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center" }}
          className="opacity-60"
        />
        {/* Dark Vignette Overlay to make text readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)] opacity-80" />
      </div>

      <div className="z-10 flex flex-col items-center justify-center w-full px-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-6xl font-black uppercase text-center tracking-[0.2em] mb-12 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Countdown to Aakar
        </motion.h1>

        {timeLeft ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex flex-wrap md:flex-nowrap gap-4 md:gap-8 justify-center items-center backdrop-blur-md bg-black/30 p-4 md:p-10 rounded-sm border border-white/20 shadow-[0_0_30px_rgba(255,195,140,0.1)] relative overflow-hidden max-w-[95vw]"
          >
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
            
            {[
              { label: "Days", value: timeLeft.days },
              { label: "Hours", value: timeLeft.hours },
              { label: "Minutes", value: timeLeft.minutes },
              { label: "Seconds", value: timeLeft.seconds },
            ].map((unit, i) => (
              <div key={i} className="flex flex-col items-center min-w-[70px] md:min-w-[100px] relative z-10 m-1 md:m-0">
                <div className="text-4xl md:text-7xl font-light tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,195,140,0.4)]" style={{ fontFamily: "'Cinzel', serif" }}>
                  {unit.value.toString().padStart(2, "0")}
                </div>
                <div className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-white/70 mt-3 font-semibold" style={{ textShadow: "0 0 10px rgba(255,180,120,0.4)" }}>
                  {unit.label}
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <div className="h-[120px] flex items-center justify-center">
            <p className="text-white/70 tracking-[0.4em] uppercase animate-pulse text-sm">Initializing Data...</p>
          </div>
        )}

        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 1.5, duration: 1 }}
           className="mt-16"
        >
          <Link href="/" className="px-8 py-3 border border-white/20 text-white/80 uppercase tracking-[0.3em] text-[10px] md:text-xs hover:border-white/50 hover:text-white transition-all rounded-sm shadow-[0_0_15px_rgba(255,195,140,0.15)] hover:shadow-[0_0_25px_rgba(255,195,140,0.3)] bg-black/30 backdrop-blur-md relative overflow-hidden group flex items-center gap-2">
            <span className="relative z-10 transition-colors">Return to Gate</span>
            <div className="absolute inset-0 bg-white/10 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100 z-0" />
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
