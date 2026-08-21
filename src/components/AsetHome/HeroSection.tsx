import React from "react";
import { motion } from "motion/react";
import { BrandLogosCarousel } from "./BrandLogosCarousel";

interface HeroSectionProps {
  onOpenAuth: (mode?: "login" | "signup") => void;
  onNavigate: (sectionId: string) => void;
  onSwitchMode: (mode: "home" | "dietitian" | "patient") => void;
}

export function HeroSection({
  onOpenAuth,
  onNavigate,
  onSwitchMode,
}: HeroSectionProps) {
  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-[#0c181b]">
      {/* Immersive Kitchen Background Image matching reference */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=2400&q=85"
          alt="A nutrition solution within everyone's reach"
          className="w-full h-full object-cover object-[center_32%] select-none"
        />
        {/* Soft Contrast Gradient to ensure text readability without darkening the kitchen vibe */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      </div>

      {/* Hero Headline Area (Clean, uncluttered, matching reference image) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-28 sm:pt-36 pb-12 flex-1 flex flex-col justify-center">
        <div className="max-w-2xl lg:max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-2 sm:space-y-3"
          >
            {/* Boxed Top Line matching reference screenshot */}
            <div>
              <span className="inline-block px-4 sm:px-6 py-1.5 sm:py-2 rounded-2xl bg-[#e3f4f6] text-[#0f3d45] font-extrabold text-3xl sm:text-4.5xl lg:text-5.5xl tracking-tight shadow-sm">
                A nutrition solution
              </span>
            </div>

            {/* Second Line in Clean Crisp White Display Text */}
            <h1 className="text-3xl sm:text-4.5xl lg:text-5.5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
              within everyone's reach
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Integrated Bottom Brand Carousel & Curved Wave matching reference */}
      <div className="relative z-10 w-full">
        {/* Smooth Organic Wave Divider matching reference screenshot */}
        <div className="w-full overflow-hidden leading-none -mb-[1px]">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-8 sm:h-11 lg:h-14 object-cover text-[#eef8fa] dark:text-[#0b1416] transition-colors"
            preserveAspectRatio="none"
          >
            <path
              d="M0,32 C340,64 720,12 1100,38 C1280,50 1380,24 1440,28 L1440,60 L0,60 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Brand Carousel Banner */}
        <BrandLogosCarousel />
      </div>
    </section>
  );
}
