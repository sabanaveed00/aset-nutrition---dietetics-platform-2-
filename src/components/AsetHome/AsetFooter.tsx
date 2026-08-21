import React from "react";
import {
  Heart,
  ShieldCheck,
  Globe,
  Mail,
  Phone,
  ArrowUp,
  Award,
} from "lucide-react";

interface AsetFooterProps {
  onNavigate: (sectionId: string) => void;
  onSwitchMode: (mode: "home" | "dietitian" | "patient") => void;
  onOpenAuth: (mode?: "login" | "signup") => void;
}

export function AsetFooter({
  onNavigate,
  onSwitchMode,
  onOpenAuth,
}: AsetFooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-900 text-white dark:bg-[#080808] border-t border-slate-800 dark:border-[#1a1a1a] pt-14 pb-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800 dark:border-[#1e1e1e]">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white font-black text-base shadow-sm">
                A
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                aset
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-400 font-bold uppercase tracking-wider">
                Nutrition
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The unified nutrition and dietetics ecosystem connecting certified registered dietitians with motivated individuals worldwide.
            </p>

            <div className="flex items-center gap-2 text-xs text-teal-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>HIPAA Compliant & GDPR Certified</span>
            </div>
          </div>

          {/* Col 1: Features & Calculators */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Interactive Tools
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("calculator-section")}
                  className="hover:text-teal-400 transition-colors cursor-pointer"
                >
                  BMI Calculator
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("calculator-section")}
                  className="hover:text-teal-400 transition-colors cursor-pointer"
                >
                  Calorie & TDEE Calculator
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("goals-section")}
                  className="hover:text-teal-400 transition-colors cursor-pointer"
                >
                  Personalized Goal Setter
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("features-showcase")}
                  className="hover:text-teal-400 transition-colors cursor-pointer"
                >
                  AI Food Vision Scanner
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("gallery-section")}
                  className="hover:text-teal-400 transition-colors cursor-pointer"
                >
                  Dietitian Recipe Gallery
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Solutions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => onSwitchMode("dietitian")}
                  className="hover:text-teal-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Dietitian Clinical Hub</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-teal-500/20 text-teal-300 font-bold">
                    PRO
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSwitchMode("patient")}
                  className="hover:text-teal-400 transition-colors cursor-pointer"
                >
                  Patient Companion App
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("locations-section")}
                  className="hover:text-teal-400 transition-colors cursor-pointer"
                >
                  Clinic & Telehealth Centers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("testimonials-section")}
                  className="hover:text-teal-400 transition-colors cursor-pointer"
                >
                  Patient Success Stories
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenAuth("signup")}
                  className="hover:text-teal-400 transition-colors cursor-pointer"
                >
                  Sign Up Free
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Global Centers */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Global Headquarters
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p>Manhattan • San Francisco • London • Sydney</p>
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-teal-400" />
                <span>support@aset-nutrition.com</span>
              </p>
              <p className="flex items-center gap-1.5 font-mono">
                <Phone className="w-3.5 h-3.5 text-teal-400" />
                <span>+1 (800) 555-ASET</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright + Back to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} ASET Nutrition & Dietetics System. All rights reserved.
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 dark:bg-[#1a1a1a] text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-teal-400" />
          </button>
        </div>
      </div>
    </footer>
  );
}
