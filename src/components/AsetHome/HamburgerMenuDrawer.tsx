import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Calculator,
  Target,
  Flame,
  Droplet,
  ChefHat,
  HeartHandshake,
  MapPin,
  Sparkles,
  Stethoscope,
  Smartphone,
  UserPlus,
  Moon,
  Sun,
  ShieldCheck,
  ChevronRight,
  Activity,
} from "lucide-react";

interface HamburgerMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
  onSwitchMode: (mode: "home" | "dietitian" | "patient") => void;
  onOpenAuth: (mode?: "login" | "signup") => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function HamburgerMenuDrawer({
  isOpen,
  onClose,
  onNavigate,
  onSwitchMode,
  onOpenAuth,
  isDarkMode,
  onToggleDarkMode,
}: HamburgerMenuDrawerProps) {
  const menuItems = [
    {
      id: "bmi-calculator",
      title: "Calculate BMI",
      desc: "Instant Body Mass Index & health range analysis",
      icon: Activity,
      action: () => onNavigate("calculator-section"),
      badge: "Free Tool",
    },
    {
      id: "calorie-calculator",
      title: "Calculate Daily Calories & TDEE",
      desc: "Mifflin-St Jeor metabolic expenditure & macros",
      icon: Calculator,
      action: () => onNavigate("calculator-section"),
      badge: "Popular",
    },
    {
      id: "goals",
      title: "Set Goals & Strategy",
      desc: "Weight loss, muscle gain & athletic endurance targets",
      icon: Target,
      action: () => onNavigate("goals-section"),
    },
    {
      id: "yazio-showcase",
      title: "ASET App Features & Scanner",
      desc: "AI food vision scanner, today summary & water log",
      icon: Smartphone,
      action: () => onNavigate("features-showcase"),
      badge: "Interactive",
    },
    {
      id: "dietitian-suite",
      title: "Dietitian Practice Suite",
      desc: "Clinical meal planner, anthropometrics & food diary",
      icon: Stethoscope,
      action: () => {
        onSwitchMode("dietitian");
        onClose();
      },
      highlight: true,
    },
    {
      id: "patient-companion",
      title: "Patient Companion App",
      desc: "Interactive timeline, water intake & recipe book",
      icon: HeartHandshake,
      action: () => {
        onSwitchMode("patient");
        onClose();
      },
      highlight: true,
    },
    {
      id: "food-gallery",
      title: "Nutrition & Recipe Gallery",
      desc: "Chef & dietitian approved macro-balanced bowls",
      icon: ChefHat,
      action: () => onNavigate("gallery-section"),
    },
    {
      id: "testimonials",
      title: "Success Stories & Testimonials",
      desc: "Real patient reviews & verified health results",
      icon: Sparkles,
      action: () => onNavigate("testimonials-section"),
    },
    {
      id: "locations",
      title: "Clinic & Dietitian Locations",
      desc: "Find partner centers & telehealth practitioners",
      icon: MapPin,
      action: () => onNavigate("locations-section"),
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Left Drawer Container */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="absolute inset-y-0 left-0 max-w-sm w-full bg-white dark:bg-[#111111] border-r border-slate-200 dark:border-[#222222] shadow-2xl flex flex-col z-10"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-200 dark:border-[#222222] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white font-black text-base shadow-sm">
                  A
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">
                    ASET Nutrition
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#888888]">
                    Clinical & Personal Health System
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-[#888888] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1a1a1a] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Top Bar */}
            <div className="p-4 bg-slate-50 dark:bg-[#141414] border-b border-slate-200 dark:border-[#222222] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={onToggleDarkMode}
                className="flex-1 py-2 px-3 rounded-xl bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#262626] text-xs font-semibold text-slate-700 dark:text-[#ededed] flex items-center justify-center gap-2 hover:border-teal-500 transition-colors cursor-pointer"
              >
                {isDarkMode ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" /> Day Mode
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-teal-600" /> Night Mode
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  onOpenAuth("signup");
                  onClose();
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" /> Sign Up Free
              </button>
            </div>

            {/* Menu Links Scrollable List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar">
              <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#666666]">
                Health Tools & Navigation
              </div>

              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      item.action();
                      onClose();
                    }}
                    className={`w-full p-3 rounded-2xl text-left transition-all flex items-center justify-between group cursor-pointer ${
                      item.highlight
                        ? "bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/40 text-teal-900 dark:text-teal-200"
                        : "hover:bg-slate-100 dark:hover:bg-[#1a1a1a] text-slate-800 dark:text-[#ededed]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2.5 rounded-xl shrink-0 ${
                          item.highlight
                            ? "bg-teal-600 text-white shadow-xs"
                            : "bg-slate-100 dark:bg-[#1a1a1a] text-teal-600 dark:text-teal-400 border border-slate-200/60 dark:border-[#222222]"
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-[#888888] mt-0.5 line-clamp-1">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400 dark:text-[#666666] group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </button>
                );
              })}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-[#222222] bg-slate-50 dark:bg-[#141414] space-y-2 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-[#888888]">
                <ShieldCheck className="w-4 h-4 text-teal-500" /> HIPAA & GDPR
                Certified Nutrition Platform
              </div>
              <p className="text-[11px] text-slate-400 dark:text-[#666666]">
                © {new Date().getFullYear()} ASET Nutrition. All rights reserved.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
