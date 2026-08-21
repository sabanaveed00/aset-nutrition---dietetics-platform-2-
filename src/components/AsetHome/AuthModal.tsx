import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  User,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Stethoscope,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
  onSuccess: (role: "dietitian" | "patient") => void;
}

export function AuthModal({
  isOpen,
  onClose,
  initialMode = "signup",
  onSuccess,
}: AuthModalProps) {
  const [authMode, setAuthMode] = useState<"login" | "signup">(initialMode);
  const [userRole, setUserRole] = useState<"patient" | "dietitian">("patient");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [primaryGoal, setPrimaryGoal] = useState("Weight Loss");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(userRole);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-xs"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative z-10 max-w-md w-full bg-white dark:bg-[#141414] rounded-3xl border border-slate-200 dark:border-[#262626] shadow-2xl overflow-hidden p-6 sm:p-8"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#222222] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Logo + Header */}
            <div className="text-center mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white font-black text-lg mx-auto shadow-sm">
                A
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3">
                {authMode === "signup" ? "Create your ASET Account" : "Welcome back to ASET"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#888888] mt-1">
                {authMode === "signup"
                  ? "Access smart nutrition tools & clinical meal planning"
                  : "Sign in to access your nutrition workspace"}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex p-1 bg-slate-100 dark:bg-[#1c1c1c] rounded-2xl border border-slate-200 dark:border-[#2a2a2a] mb-5">
              <button
                type="button"
                onClick={() => setAuthMode("signup")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  authMode === "signup"
                    ? "bg-white dark:bg-[#2a2a2a] text-teal-600 dark:text-teal-400 shadow-xs"
                    : "text-slate-500"
                }`}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  authMode === "login"
                    ? "bg-white dark:bg-[#2a2a2a] text-teal-600 dark:text-teal-400 shadow-xs"
                    : "text-slate-500"
                }`}
              >
                Sign In
              </button>
            </div>

            {/* Role Switcher */}
            <div className="grid grid-cols-2 gap-2 mb-5">
              <button
                type="button"
                onClick={() => setUserRole("patient")}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  userRole === "patient"
                    ? "bg-teal-50 dark:bg-teal-950/40 border-teal-500 text-teal-900 dark:text-teal-200 ring-1 ring-teal-500"
                    : "bg-slate-50 dark:bg-[#1a1a1a] border-slate-200 dark:border-[#262626] text-slate-600 dark:text-[#888888]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-teal-500" />
                  <span className="font-bold text-xs">Patient</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Track meals & hydration
                </p>
              </button>

              <button
                type="button"
                onClick={() => setUserRole("dietitian")}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  userRole === "dietitian"
                    ? "bg-teal-50 dark:bg-teal-950/40 border-teal-500 text-teal-900 dark:text-teal-200 ring-1 ring-teal-500"
                    : "bg-slate-50 dark:bg-[#1a1a1a] border-slate-200 dark:border-[#262626] text-slate-600 dark:text-[#888888]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-teal-500" />
                  <span className="font-bold text-xs">Dietitian</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Clinical meal planning suite
                </p>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {authMode === "signup" && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Emily Watson"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#2a2a2a] bg-slate-50 dark:bg-[#1a1a1a] text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#2a2a2a] bg-slate-50 dark:bg-[#1a1a1a] text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#2a2a2a] bg-slate-50 dark:bg-[#1a1a1a] text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              {authMode === "signup" && userRole === "patient" && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Primary Nutrition Goal
                  </label>
                  <select
                    value={primaryGoal}
                    onChange={(e) => setPrimaryGoal(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#2a2a2a] bg-slate-50 dark:bg-[#1a1a1a] text-slate-900 dark:text-white text-xs"
                  >
                    <option value="Weight Loss">Weight Loss & Fat Reduction</option>
                    <option value="Muscle Hypertrophy">Lean Muscle Hypertrophy</option>
                    <option value="Metabolic Health">Metabolic & Glucose Stability</option>
                    <option value="Plant Based">Plant-Based Transition</option>
                    <option value="Endurance">Athletic Performance</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-4 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-teal-950 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{authMode === "signup" ? "Start with ASET" : "Sign In to ASET"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-[#222222] text-center">
              <span className="text-[11px] text-slate-400">
                🔒 Protected by 256-bit HIPAA compliant security
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
