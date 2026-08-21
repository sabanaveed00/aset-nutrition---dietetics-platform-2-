import React, { useState, useEffect } from "react";
import {
  Menu,
  Globe,
  ChevronRight,
  Stethoscope,
  Smartphone,
  Sparkles,
  Building2,
  Moon,
  Sun,
} from "lucide-react";

interface AsetNavbarProps {
  onOpenMenu: () => void;
  onOpenAuth: (mode?: "login" | "signup") => void;
  onNavigate: (sectionId: string) => void;
  onSwitchMode: (mode: "home" | "dietitian" | "patient") => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  currentMode: "home" | "dietitian" | "patient";
}

export function AsetNavbar({
  onOpenMenu,
  onOpenAuth,
  onNavigate,
  onSwitchMode,
  isDarkMode,
  onToggleDarkMode,
  currentMode,
}: AsetNavbarProps) {
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  const [isOrgsOpen, setIsOrgsOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("EN");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-slate-950/85 backdrop-blur-md text-white border-b border-white/10 shadow-lg"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent text-white border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
        {/* Left: Brand Logo (Leaf Heart + "aset") */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onOpenMenu}
            id="hamburger-menu-btn"
            aria-label="Open Navigation Menu"
            className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-white border border-white/30 backdrop-blur-sm transition-all cursor-pointer lg:hidden shadow-md"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>

          <button
            type="button"
            onClick={() => onSwitchMode("home")}
            className="flex items-center gap-2.5 group cursor-pointer text-left select-none"
          >
            {/* Minimalist Heart/Leaf Brand Icon */}
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8 text-teal-400 fill-current drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-transform group-hover:scale-105"
              viewBox="0 0 32 32"
              fill="currentColor"
            >
              <path d="M16 26.5c-.4 0-.8-.2-1.1-.5C13.5 24.6 4 15.6 4 10.5 4 6.9 6.9 4 10.5 4c2.5 0 4.7 1.4 5.5 3.5.8-2.1 3-3.5 5.5-3.5 3.6 0 6.5 2.9 6.5 6.5 0 5.1-9.5 14.1-10.9 15.5-.3.3-.7.5-1.1.5zm-5.5-20C7.7 6.5 5.5 8.7 5.5 10.5c0 3.8 7.3 11.2 10.5 13.9 3.2-2.7 10.5-10.1 10.5-13.9 0-2.8-2.2-5-5-5-2.2 0-4.1 1.4-4.8 3.5-.2.5-.6.8-1.2.8s-1-.3-1.2-.8c-.7-2.1-2.6-3.5-4.8-3.5z" />
              <path d="M16 8.5c-.4 0-.8-.3-.8-.8V4.5c0-.4.3-.8.8-.8s.8.3.8.8v3.2c0 .5-.4.8-.8.8zM11.5 11c-.3 0-.6-.2-.7-.5-1.2-2.3-.8-4.9.9-6.6.3-.3.8-.3 1.1 0s.3.8 0 1.1c-1.3 1.3-1.6 3.3-.7 5.1.2.4 0 .9-.4 1-.1-.1-.1-.1-.2-.1z" />
            </svg>
            <span className="font-black text-2.5xl sm:text-3xl tracking-tight text-white font-sans lowercase group-hover:text-teal-300 transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              aset
            </span>
          </button>
        </div>

        {/* Center/Right: Clean Navbar with High Contrast Controls */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[15px] font-bold text-white">
          {/* Solutions > */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSolutionsOpen(!isSolutionsOpen)}
              onMouseEnter={() => setIsSolutionsOpen(true)}
              className="flex items-center gap-1 text-white hover:text-teal-300 transition-colors cursor-pointer py-2 font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-wide"
            >
              <span>Solutions</span>
              <ChevronRight className="w-4 h-4 text-white stroke-[3]" />
            </button>

            {isSolutionsOpen && (
              <div
                onMouseLeave={() => setIsSolutionsOpen(false)}
                className="absolute top-full left-0 w-68 p-2 bg-slate-950/95 backdrop-blur-2xl rounded-2xl border border-white/25 shadow-2xl space-y-1 mt-1 z-50 text-white"
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsSolutionsOpen(false);
                    onSwitchMode("dietitian");
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-white/15 text-left flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <Stethoscope className="w-4 h-4 text-teal-400" />
                  <div>
                    <div className="font-bold text-xs text-white">
                      For Dietitians & Nutritionists
                    </div>
                    <div className="text-[11px] text-slate-300">
                      Complete clinical meal planning
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsSolutionsOpen(false);
                    onSwitchMode("patient");
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-white/15 text-left flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <Smartphone className="w-4 h-4 text-teal-400" />
                  <div>
                    <div className="font-bold text-xs text-white">
                      For Patients & Individuals
                    </div>
                    <div className="text-[11px] text-slate-300">
                      Mobile companion & AI food diary
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsSolutionsOpen(false);
                    onNavigate("check-our-features");
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-white/15 text-left flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <div>
                    <div className="font-bold text-xs text-white">
                      Check Our Features
                    </div>
                    <div className="text-[11px] text-slate-300">
                      Goals, calculators & recipes
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* For Organizations > */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOrgsOpen(!isOrgsOpen)}
              onMouseEnter={() => setIsOrgsOpen(true)}
              className="flex items-center gap-1 text-white hover:text-teal-300 transition-colors cursor-pointer py-2 font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-wide"
            >
              <span>For Organizations</span>
              <ChevronRight className="w-4 h-4 text-white stroke-[3]" />
            </button>

            {isOrgsOpen && (
              <div
                onMouseLeave={() => setIsOrgsOpen(false)}
                className="absolute top-full left-0 w-64 p-2 bg-slate-950/95 backdrop-blur-2xl rounded-2xl border border-white/25 shadow-2xl space-y-1 mt-1 z-50 text-white"
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsOrgsOpen(false);
                    onNavigate("brand-carousel");
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-white/15 text-left flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-teal-400" />
                  <div>
                    <div className="font-bold text-xs text-white">
                      Enterprise & Clinics
                    </div>
                    <div className="text-[11px] text-slate-300">
                      Corporate wellness & institutions
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* For People */}
          <button
            type="button"
            onClick={() => onNavigate("check-our-features")}
            className="text-white hover:text-teal-300 transition-colors cursor-pointer py-2 font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-wide"
          >
            For People
          </button>

          {/* For Dietitians */}
          <button
            type="button"
            onClick={() => onSwitchMode("dietitian")}
            className="text-white hover:text-teal-300 transition-colors cursor-pointer py-2 font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-wide"
          >
            For Dietitians
          </button>

          {/* Language Selector: 🌐 EN (High-Contrast Solid Pill) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white font-extrabold text-xs border border-white/35 shadow-md transition-all cursor-pointer"
            >
              <Globe className="w-4 h-4 text-teal-400 stroke-[2.5]" />
              <span>{selectedLang}</span>
            </button>

            {isLanguageOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-slate-950/95 backdrop-blur-xl border border-white/25 rounded-2xl shadow-2xl p-1.5 z-50 text-xs text-white">
                {["EN", "ES", "FR", "DE", "PT"].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      setSelectedLang(lang);
                      setIsLanguageOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-colors cursor-pointer font-bold ${
                      selectedLang === lang
                        ? "bg-teal-500 text-slate-950"
                        : "hover:bg-white/15 text-white"
                    }`}
                  >
                    {lang === "EN" && "English (EN)"}
                    {lang === "ES" && "Español (ES)"}
                    {lang === "FR" && "Français (FR)"}
                    {lang === "DE" && "Deutsch (DE)"}
                    {lang === "PT" && "Português (PT)"}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle & Sign In (High-Contrast, Prominent & Distinct) */}
          <div className="flex items-center gap-2 pl-1">
            {/* Day / Night Toggle Pill */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              aria-label="Toggle Theme"
              className="p-2 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white border border-white/35 shadow-md transition-all cursor-pointer"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-300 fill-amber-300/20" />
              ) : (
                <Moon className="w-4 h-4 text-teal-300 fill-teal-300/20" />
              )}
            </button>

            {/* High-Contrast Sign In Button */}
            <button
              type="button"
              onClick={() => onOpenAuth("login")}
              className="px-4.5 py-1.5 rounded-full text-xs font-black text-slate-950 bg-white hover:bg-teal-300 hover:text-slate-950 transition-all cursor-pointer shadow-lg active:scale-95 tracking-wide"
            >
              Sign In
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
