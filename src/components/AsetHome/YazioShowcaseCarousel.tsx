import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  HelpCircle,
  Camera,
  Diamond,
  Flame,
  Calendar,
  Plus,
  Check,
  Sparkles,
} from "lucide-react";

interface YazioShowcaseCarouselProps {
  onOpenAuth: (mode?: "login" | "signup") => void;
  onNavigate: (sectionId: string) => void;
}

export function YazioShowcaseCarousel({
  onOpenAuth,
  onNavigate,
}: YazioShowcaseCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedWaterGlasses, setSelectedWaterGlasses] = useState<number[]>([
    0, 1, 2, 3, 4, 5, 6,
  ]);
  const [isScanning, setIsScanning] = useState(false);
  const [showScanDone, setShowScanDone] = useState(false);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const toggleWaterGlass = (index: number) => {
    if (selectedWaterGlasses.includes(index)) {
      setSelectedWaterGlasses(
        selectedWaterGlasses.filter((idx) => idx !== index)
      );
    } else {
      setSelectedWaterGlasses([...selectedWaterGlasses, index]);
    }
  };

  const handleCameraSnap = () => {
    setIsScanning(true);
    setShowScanDone(false);
    setTimeout(() => {
      setIsScanning(false);
      setShowScanDone(true);
    }, 900);
  };

  return (
    <section
      id="features-showcase"
      className="relative py-12 sm:py-16 bg-[#e3f4f6] dark:bg-[#0b1416] transition-colors overflow-hidden border-t border-b border-teal-100/80 dark:border-[#1a282b]"
    >
      {/* Playful top illustrated character / organic backdrop elements matching reference */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-28 bg-teal-400/25 dark:bg-teal-600/15 rounded-b-[100px] blur-xl pointer-events-none" />

      {/* Decorative cute mascot head peaking behind the phones */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-48 h-20 bg-teal-500 dark:bg-teal-600 rounded-t-full flex items-center justify-center gap-6 pt-3 shadow-inner pointer-events-none opacity-90">
        <div className="w-3.5 h-3.5 rounded-full bg-slate-950" />
        <div className="w-3.5 h-3.5 rounded-full bg-slate-950" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Controls on Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-400 font-mono">
              Interactive Mobile Suite
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Tailored nutrition solutions
            </h2>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Previous Slide"
              className="p-2.5 rounded-full bg-white dark:bg-[#141414] text-slate-800 dark:text-white shadow-md hover:bg-slate-50 dark:hover:bg-[#1f1f1f] border border-slate-200 dark:border-[#262626] transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Next Slide"
              className="p-2.5 rounded-full bg-white dark:bg-[#141414] text-slate-800 dark:text-white shadow-md hover:bg-slate-50 dark:hover:bg-[#1f1f1f] border border-slate-200 dark:border-[#262626] transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Smartphone Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-5 sm:gap-6 overflow-x-auto pb-6 pt-2 scrollbar-none snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* PHONE 1: 75% CREATING YOUR PLAN */}
          <div className="flex-none w-[280px] sm:w-[310px] snap-center">
            <div className="w-full h-[580px] rounded-[40px] bg-white dark:bg-[#121212] border-[7px] border-slate-900 dark:border-slate-800 shadow-2xl p-5 flex flex-col justify-between relative overflow-hidden">
              {/* Speaker / Notch Bar */}
              <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto -mt-2 mb-4" />

              <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
                {/* Circular Progress Gauge */}
                <div className="relative w-36 h-36 flex items-center justify-center my-4">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      className="text-slate-100 dark:text-[#222222]"
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      className="text-teal-500"
                      strokeWidth="10"
                      strokeDasharray={2 * Math.PI * 50}
                      strokeDashoffset={2 * Math.PI * 50 * (1 - 0.75)}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                    />
                  </svg>
                  <span className="absolute text-3xl font-black text-slate-900 dark:text-white font-sans">
                    75%
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-2 leading-tight">
                  Creating your plan ...
                </h3>

                {/* Processing Steps List matching screenshot */}
                <div className="mt-8 space-y-3.5 text-left w-full pl-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                    <span>Calculating your answers</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                    <span>Calculating your calorie goal</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                    <span>Calculating your progress</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-400 dark:text-[#666666]">
                    <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
                    <span>... finishing touches</span>
                  </div>
                </div>
              </div>

              {/* Bottom Home Indicator Bar */}
              <div className="w-32 h-1 bg-slate-900/40 dark:bg-white/30 rounded-full mx-auto mt-4" />
            </div>
          </div>

          {/* PHONE 2: DARK AI CAMERA SCANNER (Coffee & Croissant) */}
          <div className="flex-none w-[280px] sm:w-[310px] snap-center">
            <div className="w-full h-[580px] rounded-[40px] bg-[#1a1a1a] text-white border-[7px] border-slate-900 dark:border-slate-800 shadow-2xl p-4 flex flex-col justify-between relative overflow-hidden">
              {/* Top Bar matching screenshot: Arrow left, brand name, Help Question Mark */}
              <div>
                <div className="w-24 h-3.5 bg-slate-900 rounded-full mx-auto -mt-1 mb-3" />
                <div className="flex items-center justify-between px-2 pt-1">
                  <button
                    type="button"
                    aria-label="Back"
                    className="p-1 rounded-full text-white/80 hover:text-white"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <span className="font-extrabold text-lg tracking-tight lowercase text-white font-sans">
                    aset
                  </span>
                  <button
                    type="button"
                    aria-label="Help"
                    className="p-1 rounded-full text-white/80 hover:text-white"
                  >
                    <HelpCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Viewfinder with Coffee & Croissant on wooden board */}
              <div className="relative my-auto w-full aspect-square rounded-2xl overflow-hidden bg-black shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=600&q=80"
                  alt="Cappuccino and fresh golden croissant on wood board"
                  className="w-full h-full object-cover select-none"
                />

                {/* Viewfinder Target White Corners */}
                <div className="absolute inset-3 border-2 border-white/80 rounded-xl pointer-events-none p-2 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div className="w-3 h-3 border-t-2 border-l-2 border-white" />
                    <div className="w-3 h-3 border-t-2 border-r-2 border-white" />
                  </div>
                  {isScanning && (
                    <motion.div
                      animate={{ y: [-40, 40, -40] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                      className="w-full h-0.5 bg-teal-400 shadow-[0_0_8px_#2dd4bf]"
                    />
                  )}
                  <div className="flex justify-between">
                    <div className="w-3 h-3 border-b-2 border-l-2 border-white" />
                    <div className="w-3 h-3 border-b-2 border-r-2 border-white" />
                  </div>
                </div>

                {showScanDone && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute bottom-2 inset-x-2 bg-slate-950/90 backdrop-blur-md rounded-xl p-2 text-center text-[10px] text-teal-300 font-bold border border-teal-500/40"
                  >
                    ☕ Cappuccino (120 kcal) + 🥐 Croissant (260 kcal)
                  </motion.div>
                )}
              </div>

              {/* Viewfinder Helper Text */}
              <p className="text-[11px] sm:text-xs text-center text-slate-300 font-medium px-3">
                Make sure your meal is well lit and fully within the frame.
              </p>

              {/* Big Green/Teal Camera Shutter Button matching screenshot */}
              <div className="flex flex-col items-center justify-center pt-2 pb-1">
                <button
                  type="button"
                  onClick={handleCameraSnap}
                  aria-label="Scan food photo"
                  className="w-14 h-14 rounded-full bg-[#00d68f] hover:bg-[#00c080] text-slate-950 flex items-center justify-center shadow-lg shadow-teal-900/50 transition-transform active:scale-95 cursor-pointer"
                >
                  <Camera className="w-6 h-6 fill-current" />
                </button>
              </div>

              {/* Bottom Home Indicator Bar */}
              <div className="w-32 h-1 bg-white/30 rounded-full mx-auto" />
            </div>
          </div>

          {/* PHONE 3: TODAY DASHBOARD SUMMARY (Center Focus) */}
          <div className="flex-none w-[280px] sm:w-[310px] snap-center">
            <div className="w-full h-[580px] rounded-[40px] bg-white dark:bg-[#141414] border-[7px] border-slate-900 dark:border-slate-800 shadow-2xl p-4.5 flex flex-col justify-between relative overflow-hidden">
              <div>
                {/* Speaker Bar */}
                <div className="w-24 h-3.5 bg-slate-900 rounded-full mx-auto -mt-2.5 mb-2.5" />

                {/* Top Status Indicators matching screenshot */}
                <div className="flex items-center justify-end gap-3 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <div className="flex items-center gap-1 text-blue-500">
                    <Diamond className="w-3.5 h-3.5 fill-blue-500" />
                    <span className="font-sans font-bold">2000</span>
                  </div>
                  <div className="flex items-center gap-1 text-orange-500">
                    <Flame className="w-3.5 h-3.5 fill-orange-500" />
                    <span className="font-sans font-bold">135</span>
                  </div>
                  <Calendar className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                </div>

                {/* Screen Header: Today & Week 175 */}
                <div className="mt-2 text-left">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Today
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-[#888888] font-semibold">
                    Week 175
                  </span>
                </div>

                {/* Summary Section Header */}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    Summary
                  </span>
                  <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 cursor-pointer">
                    Details
                  </span>
                </div>

                {/* Energy Ring matching screenshot */}
                <div className="mt-2 p-3 rounded-2xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-100 dark:border-[#222222]">
                  <div className="flex items-center justify-between px-1">
                    <div className="text-left">
                      <div className="text-xs font-black text-slate-900 dark:text-white">
                        1,020
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        Eaten
                      </div>
                    </div>

                    {/* Circular Arc with 868 Remaining */}
                    <div className="relative w-20 h-20 flex flex-col items-center justify-center rounded-full border-[3.5px] border-teal-500 bg-white dark:bg-[#141414] shadow-xs">
                      <span className="text-lg font-black text-slate-900 dark:text-white leading-none">
                        868
                      </span>
                      <span className="text-[9px] font-semibold text-slate-500 mt-0.5">
                        Remaining
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-black text-slate-900 dark:text-white">
                        142
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        Burned
                      </div>
                    </div>
                  </div>

                  {/* 3 Macro Bars */}
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-slate-200/60 dark:border-[#2a2a2a] text-center">
                    <div>
                      <div className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                        Carbs
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-[#262626] h-1.5 rounded-full my-1 overflow-hidden">
                        <div className="bg-teal-500 h-full w-[47%]" />
                      </div>
                      <div className="text-[9px] font-bold text-slate-900 dark:text-white">
                        97 / 207 g
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                        Protein
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-[#262626] h-1.5 rounded-full my-1 overflow-hidden">
                        <div className="bg-teal-500 h-full w-[40%]" />
                      </div>
                      <div className="text-[9px] font-bold text-slate-900 dark:text-white">
                        46 / 115 g
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                        Fat
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-[#262626] h-1.5 rounded-full my-1 overflow-hidden">
                        <div className="bg-teal-500 h-full w-[82%]" />
                      </div>
                      <div className="text-[9px] font-bold text-slate-900 dark:text-white">
                        50 / 61 g
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nutrition Section Header */}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    Nutrition
                  </span>
                  <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 cursor-pointer">
                    More
                  </span>
                </div>

                {/* Breakfast Card matching screenshot */}
                <div className="mt-1.5 p-2.5 rounded-2xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-100 dark:border-[#222222] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full border-2 border-teal-500 flex items-center justify-center text-sm bg-white dark:bg-[#141414]">
                      ☕
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Breakfast
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        466 / 566 Cal
                      </div>
                      <div className="flex items-center gap-1 text-[9px] text-purple-600 dark:text-purple-400 font-semibold">
                        <span className="px-1 bg-purple-100 dark:bg-purple-950 rounded text-[8px]">
                          AI
                        </span>
                        <span>Fried eggs with mix...</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label="Add food"
                    className="w-7 h-7 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bottom Home Indicator Bar */}
              <div className="w-32 h-1 bg-slate-900/40 dark:bg-white/30 rounded-full mx-auto mt-2" />
            </div>
          </div>

          {/* PHONE 4: WATER TRACKER & ACTIVITIES */}
          <div className="flex-none w-[280px] sm:w-[310px] snap-center">
            <div className="w-full h-[580px] rounded-[40px] bg-white dark:bg-[#141414] border-[7px] border-slate-900 dark:border-slate-800 shadow-2xl p-4.5 flex flex-col justify-between relative overflow-hidden">
              <div>
                {/* Speaker Bar */}
                <div className="w-24 h-3.5 bg-slate-900 rounded-full mx-auto -mt-2.5 mb-2.5" />

                {/* Title */}
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight text-left">
                  Water Tracker
                </h3>

                {/* Water Header */}
                <div className="mt-3 text-center">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Water
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    Goal: 74 fl oz
                  </div>
                  <div className="text-2.5xl font-black text-slate-900 dark:text-white mt-0.5">
                    72 fl oz
                  </div>
                </div>

                {/* Water Glasses Matrix matching screenshot */}
                <div className="mt-2.5 space-y-2">
                  {/* Row 1: 5 Glasses */}
                  <div className="flex items-center justify-center gap-2">
                    {[0, 1, 2, 3, 4].map((idx) => (
                      <div
                        key={idx}
                        onClick={() => toggleWaterGlass(idx)}
                        className="w-7 h-9 rounded-t-sm rounded-b-md bg-sky-300 dark:bg-sky-500 shadow-xs flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                      >
                        <div className="w-4 h-6 rounded-b-xs bg-sky-400/80 dark:bg-sky-300/80" />
                      </div>
                    ))}
                  </div>

                  {/* Row 2: 3 Glasses with Check and Plus */}
                  <div className="flex items-center justify-center gap-2">
                    <div
                      onClick={() => toggleWaterGlass(5)}
                      className="w-7 h-9 rounded-t-sm rounded-b-md bg-sky-300 dark:bg-sky-500 shadow-xs flex items-center justify-center cursor-pointer"
                    >
                      <div className="w-4 h-6 rounded-b-xs bg-sky-400/80" />
                    </div>

                    <div
                      onClick={() => toggleWaterGlass(6)}
                      className="w-7 h-9 rounded-t-sm rounded-b-md bg-sky-300 dark:bg-sky-500 shadow-xs flex items-center justify-center relative cursor-pointer"
                    >
                      <div className="w-4 h-4 rounded-full bg-teal-500 text-white flex items-center justify-center text-[9px] shadow-xs">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    </div>

                    <div
                      onClick={() => toggleWaterGlass(7)}
                      className="w-7 h-9 rounded-t-sm rounded-b-md bg-sky-100 dark:bg-[#252525] border border-sky-200 dark:border-[#333333] flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                    >
                      +
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-center text-slate-500 mt-2 font-medium">
                  + Water from food: 0.0 fl oz
                </div>

                {/* Activities Section */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    Activities
                  </span>
                  <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 cursor-pointer">
                    More
                  </span>
                </div>

                {/* Steps Automatic Tracking Card */}
                <div className="mt-1.5 p-2.5 rounded-2xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-100 dark:border-[#222222] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">👟</span>
                    <div className="text-left">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Steps
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        Automatic Tracking
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenAuth("signup")}
                    className="px-3 py-1 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-[11px] shadow-xs cursor-pointer hover:opacity-90"
                  >
                    Connect
                  </button>
                </div>

                <div className="text-center mt-1.5">
                  <button
                    type="button"
                    onClick={() => onOpenAuth("signup")}
                    className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                  >
                    Track steps manually
                  </button>
                </div>
              </div>

              {/* Bottom Home Indicator Bar */}
              <div className="w-32 h-1 bg-slate-900/40 dark:bg-white/30 rounded-full mx-auto mt-2" />
            </div>
          </div>

          {/* PHONE 5: 3 DAY MILESTONE */}
          <div className="flex-none w-[280px] sm:w-[310px] snap-center">
            <div className="w-full h-[580px] rounded-[40px] bg-white dark:bg-[#121212] border-[7px] border-slate-900 dark:border-slate-800 shadow-2xl p-5 flex flex-col justify-between relative overflow-hidden">
              {/* Speaker Bar */}
              <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto -mt-2 mb-2" />

              <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
                {/* Big Fire Flame with "3" inside matching screenshot */}
                <div className="relative w-32 h-36 flex items-center justify-center my-2">
                  <svg
                    viewBox="0 0 100 120"
                    className="w-full h-full drop-shadow-lg"
                  >
                    <path
                      d="M50,5 C55,25 70,35 80,50 C92,68 88,95 70,108 C52,121 24,116 14,95 C6,78 12,60 28,45 C32,60 40,65 44,55 C48,45 42,25 50,5 Z"
                      fill="url(#fireGradient)"
                    />
                    <defs>
                      <linearGradient
                        id="fireGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="50%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute text-5xl font-black text-slate-950 font-sans mt-3">
                    3
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                  3 Day Milestone
                </h3>

                {/* Weekly Streak Bar matching screenshot */}
                <div className="mt-6 w-full px-2">
                  <div className="flex justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    <span>Mo</span>
                    <span>Tu</span>
                    <span>We</span>
                    <span>Th</span>
                    <span>Fr</span>
                    <span>Sa</span>
                    <span>Su</span>
                  </div>

                  {/* Golden Streak Bar with Star */}
                  <div className="relative w-full h-3.5 bg-slate-100 dark:bg-[#222222] rounded-full overflow-hidden flex items-center">
                    <div className="w-[45%] h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full" />
                    <span className="absolute left-[40%] -translate-x-1/2 text-xs">
                      ⭐
                    </span>
                  </div>
                </div>

                <p className="mt-6 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 leading-relaxed max-w-[220px]">
                  Amazing! Now, let's go for the next milestone.
                </p>
              </div>

              {/* Bottom Home Indicator Bar */}
              <div className="w-32 h-1 bg-slate-900/40 dark:bg-white/30 rounded-full mx-auto mt-2" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
