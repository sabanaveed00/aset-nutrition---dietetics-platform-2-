import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  INITIAL_CLIENTS,
  INITIAL_MEAL_PLANS,
  INITIAL_RECIPES,
  INITIAL_APPOINTMENTS,
  INITIAL_DIARY_ENTRIES,
  INITIAL_WATER_LOG,
} from "./data/initialData";
import {
  ClientProfile,
  MealPlan,
  Recipe,
  Appointment,
  FoodDiaryItem,
  DailyWaterLog,
  AnthropometricRecord,
  MealType,
} from "./types/nutrition";
import { MealPlanner } from "./components/DietitianDashboard/MealPlanner";
import { AnthropometricsView } from "./components/DietitianDashboard/AnthropometricsView";
import { ClientDirectory } from "./components/DietitianDashboard/ClientDirectory";
import { AppointmentsManager } from "./components/DietitianDashboard/AppointmentsManager";
import { FoodDiaryReview } from "./components/DietitianDashboard/FoodDiaryReview";
import { DailyMealTimeline } from "./components/PatientCompanion/DailyMealTimeline";
import { InteractiveWaterTracker } from "./components/PatientCompanion/InteractiveWaterTracker";
import { RecipeBook } from "./components/PatientCompanion/RecipeBook";
import { ProgressJournal } from "./components/PatientCompanion/ProgressJournal";
import { AICoachDrawer } from "./components/AICoachDrawer";

// ASET Home Components
import { AsetNavbar } from "./components/AsetHome/AsetNavbar";
import { HamburgerMenuDrawer } from "./components/AsetHome/HamburgerMenuDrawer";
import { HeroSection } from "./components/AsetHome/HeroSection";
import { BrandLogosCarousel } from "./components/AsetHome/BrandLogosCarousel";
import { YazioShowcaseCarousel } from "./components/AsetHome/YazioShowcaseCarousel";
import { CheckOurFeaturesSection } from "./components/AsetHome/CheckOurFeaturesSection";
import { ClinicLocations } from "./components/AsetHome/ClinicLocations";
import { TestimonialsCarousel } from "./components/AsetHome/TestimonialsCarousel";
import { AuthModal } from "./components/AsetHome/AuthModal";
import { AsetFooter } from "./components/AsetHome/AsetFooter";

import {
  UtensilsCrossed,
  Activity,
  Users,
  Calendar,
  BookOpen,
  Sparkles,
  Smartphone,
  Stethoscope,
  Moon,
  Sun,
  Droplet,
  ChefHat,
  Scale,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";

export default function App() {
  // App Modes: "home" (ASET Landing Page), "dietitian" (Clinical Practice), "patient" (Mobile Patient App)
  const [appMode, setAppMode] = useState<"home" | "dietitian" | "patient">("home");

  // Dark Mode State - Default to Clean Light theme (matching Nutrium), fully toggleable
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("aset_theme");
      if (saved) return saved === "dark";
      return false; // Default to Light Mode as requested
    } catch {
      return false;
    }
  });

  // Hamburger Menu Drawer State
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Auth Modal State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<"login" | "signup">("signup");

  // Core Clinical Data States
  const [clients, setClients] = useState<ClientProfile[]>(INITIAL_CLIENTS);
  const [selectedClientId, setSelectedClientId] = useState<string>(INITIAL_CLIENTS[0].id);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>(INITIAL_MEAL_PLANS);
  const [recipes] = useState<Recipe[]>(INITIAL_RECIPES);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [diaryEntries, setDiaryEntries] = useState<FoodDiaryItem[]>(INITIAL_DIARY_ENTRIES);
  const [waterLog, setWaterLog] = useState<DailyWaterLog>(INITIAL_WATER_LOG);

  // Active Tabs for Dietitian View
  const [dietitianTab, setDietitianTab] = useState<
    "planner" | "anthropometrics" | "clients" | "appointments" | "diary"
  >("planner");

  // Active Tabs for Patient View
  const [patientTab, setPatientTab] = useState<
    "timeline" | "water" | "recipes" | "progress"
  >("timeline");

  // AI Assistant Floating Drawer State
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

  // Active Client reference
  const activeClient =
    clients.find((c) => c.id === selectedClientId) || clients[0];

  // Active Meal Plan reference for current client
  const activeMealPlan =
    mealPlans.find((mp) => mp.clientId === activeClient.id) ||
    mealPlans[0];

  // Handle Dark mode toggle with DOM sync
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      try {
        localStorage.setItem("aset_theme", "dark");
      } catch {
        // ignore
      }
    } else {
      document.documentElement.classList.remove("dark");
      try {
        localStorage.setItem("aset_theme", "light");
      } catch {
        // ignore
      }
    }
  }, [isDarkMode]);

  // Smooth Navigation to section
  const handleNavigateSection = (sectionId: string) => {
    if (appMode !== "home") {
      setAppMode("home");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Open Auth Modal
  const handleOpenAuth = (mode: "login" | "signup" = "signup") => {
    setAuthInitialMode(mode);
    setIsAuthOpen(true);
  };

  // Handle Successful Auth
  const handleAuthSuccess = (role: "dietitian" | "patient") => {
    setAppMode(role);
  };

  // Update meal plan
  const handleUpdateMealPlan = (updatedPlan: MealPlan) => {
    setMealPlans((prev) =>
      prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
    );
  };

  // Add anthropometric measurement
  const handleAddAnthropometricRecord = (record: AnthropometricRecord) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === activeClient.id) {
          const updatedRecords = [record, ...(c.records || [])];
          return {
            ...c,
            currentWeightKg: record.weight,
            records: updatedRecords,
          };
        }
        return c;
      })
    );
  };

  // Add new patient/client
  const handleAddClient = (newClient: ClientProfile) => {
    setClients((prev) => [newClient, ...prev]);
    setSelectedClientId(newClient.id);
  };

  // Add new appointment
  const handleAddAppointment = (newApt: Appointment) => {
    setAppointments((prev) => [newApt, ...prev]);
  };

  // Update appointment status
  const handleUpdateAppointmentStatus = (
    id: string,
    status: Appointment["status"]
  ) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
    );
  };

  // Patient logs meal photo
  const handleLogMealPhoto = (
    mealType: MealType,
    photoUrl: string,
    notes: string
  ) => {
    const newEntry: FoodDiaryItem = {
      id: `fd-${Date.now()}`,
      clientId: activeClient.id,
      date: new Date().toISOString().split("T")[0],
      mealType,
      timeLogged: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      foodDescription: `${mealType} verified with photo confirmation`,
      caloriesEstimate: 420,
      macros: { carbs: 45, protein: 28, fat: 12 },
      photoUrl,
      clientNotes: notes,
      hungerLevel: 3,
      satisfactionLevel: 4,
    };
    setDiaryEntries((prev) => [newEntry, ...prev]);
  };

  // Dietitian leaves feedback on diary
  const handleAddDiaryFeedback = (entryId: string, feedback: string) => {
    setDiaryEntries((prev) =>
      prev.map((entry) =>
        entry.id === entryId
          ? { ...entry, dietitianFeedback: feedback, dietitianLiked: true }
          : entry
      )
    );
  };

  // Dietitian toggles like on diary
  const handleToggleDiaryLike = (entryId: string) => {
    setDiaryEntries((prev) =>
      prev.map((entry) =>
        entry.id === entryId
          ? { ...entry, dietitianLiked: !entry.dietitianLiked }
          : entry
      )
    );
  };

  // Patient logs weight
  const handleLogPatientWeight = (newWeight: number) => {
    const heightM = activeClient.heightCm / 100;
    const newRecord: AnthropometricRecord = {
      id: `r-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      weight: newWeight,
      bodyFatPercentage: 24.5,
      muscleMassKg: 25.1,
      bmi: Number((newWeight / (heightM * heightM)).toFixed(1)),
      notes: "Logged via Patient Mobile Companion",
    };
    handleAddAnthropometricRecord(newRecord);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-[#ededed] flex flex-col font-sans transition-colors">
      {/* Top Main Navigation Bar with 3-line menu */}
      <AsetNavbar
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenAuth={handleOpenAuth}
        onNavigate={handleNavigateSection}
        onSwitchMode={(mode) => setAppMode(mode)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        currentMode={appMode}
      />

      {/* Hamburger 3-Line Slide-out Drawer */}
      <HamburgerMenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={handleNavigateSection}
        onSwitchMode={(mode) => setAppMode(mode)}
        onOpenAuth={handleOpenAuth}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Auth Modal (Sign Up / Sign In) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authInitialMode}
        onSuccess={handleAuthSuccess}
      />

      {/* Conditional Content by App Mode */}
      {appMode === "home" && (
        <div className="flex-1 flex flex-col">
          {/* Hero Section & Integrated Brand Carousel (matching reference screenshot) */}
          <HeroSection
            onOpenAuth={handleOpenAuth}
            onNavigate={handleNavigateSection}
            onSwitchMode={(mode) => setAppMode(mode)}
          />

          {/* YAZIO-style 5-Card Interactive Feature Showcase Carousel */}
          <YazioShowcaseCarousel
            onOpenAuth={handleOpenAuth}
            onNavigate={handleNavigateSection}
          />

          {/* Interactive "Check Our Features" Hub (Goals, Calculators, Meal Gallery on demand) */}
          <CheckOurFeaturesSection
            onOpenAuth={handleOpenAuth}
            onNavigate={handleNavigateSection}
          />

          {/* ASET Physical Clinics & 24/7 Global Telehealth Network */}
          <ClinicLocations onOpenAuth={handleOpenAuth} />

          {/* Testimonials & Patient Reviews Carousel */}
          <TestimonialsCarousel />

          {/* Professional Footer */}
          <AsetFooter
            onNavigate={handleNavigateSection}
            onSwitchMode={(mode) => setAppMode(mode)}
            onOpenAuth={handleOpenAuth}
          />
        </div>
      )}

      {/* Dietitian Pro Mode View */}
      {appMode === "dietitian" && (
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 pt-24 sm:pt-28 space-y-6">
          {/* Header Bar with Back Button & Patient Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#222222] shadow-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setAppMode("home")}
                className="p-2 rounded-xl border border-slate-200 dark:border-[#262626] bg-slate-50 dark:bg-[#141414] text-slate-700 dark:text-[#ededed] hover:border-teal-500 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to ASET Home</span>
              </button>

              <div className="h-5 w-px bg-slate-200 dark:bg-[#262626] hidden sm:block" />

              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  Dietitian Clinical Suite
                </span>
                <span className="text-xs text-slate-500 dark:text-[#888888] block">
                  Active Client: {activeClient.name}
                </span>
              </div>
            </div>

            {/* Quick Switch Client */}
            <div className="relative w-full sm:w-auto">
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full sm:w-auto pl-3 pr-8 py-2 rounded-xl border border-slate-200 dark:border-[#262626] bg-slate-50 dark:bg-[#141414] text-slate-900 dark:text-[#ededed] text-xs font-medium appearance-none cursor-pointer focus:ring-1 focus:ring-teal-500 shadow-xs"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.primaryGoal})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Dietitian Module Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-white dark:bg-[#111111] p-2 rounded-2xl border border-slate-200 dark:border-[#222222] shadow-xs custom-scrollbar">
            <button
              type="button"
              onClick={() => setDietitianTab("planner")}
              id="tab-meal-planner"
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 relative cursor-pointer ${
                dietitianTab === "planner"
                  ? "bg-teal-50 dark:bg-[#1a1a1a] text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-900/40 shadow-xs"
                  : "text-slate-600 dark:text-[#888888] hover:bg-slate-50 dark:hover:bg-[#161616] hover:text-slate-900 dark:hover:text-[#ededed]"
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5 text-teal-500" />
              Meal Planner & Macros
            </button>

            <button
              type="button"
              onClick={() => setDietitianTab("anthropometrics")}
              id="tab-anthropometrics"
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 relative cursor-pointer ${
                dietitianTab === "anthropometrics"
                  ? "bg-teal-50 dark:bg-[#1a1a1a] text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-900/40 shadow-xs"
                  : "text-slate-600 dark:text-[#888888] hover:bg-slate-50 dark:hover:bg-[#161616] hover:text-slate-900 dark:hover:text-[#ededed]"
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-teal-500" />
              Anthropometrics & BMR
            </button>

            <button
              type="button"
              onClick={() => setDietitianTab("clients")}
              id="tab-clients"
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 relative cursor-pointer ${
                dietitianTab === "clients"
                  ? "bg-teal-50 dark:bg-[#1a1a1a] text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-900/40 shadow-xs"
                  : "text-slate-600 dark:text-[#888888] hover:bg-slate-50 dark:hover:bg-[#161616] hover:text-slate-900 dark:hover:text-[#ededed]"
              }`}
            >
              <Users className="w-3.5 h-3.5 text-teal-500" />
              Patient Directory ({clients.length})
            </button>

            <button
              type="button"
              onClick={() => setDietitianTab("appointments")}
              id="tab-appointments"
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 relative cursor-pointer ${
                dietitianTab === "appointments"
                  ? "bg-teal-50 dark:bg-[#1a1a1a] text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-900/40 shadow-xs"
                  : "text-slate-600 dark:text-[#888888] hover:bg-slate-50 dark:hover:bg-[#161616] hover:text-slate-900 dark:hover:text-[#ededed]"
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-teal-500" />
              Consultations & Telehealth ({appointments.length})
            </button>

            <button
              type="button"
              onClick={() => setDietitianTab("diary")}
              id="tab-diary-review"
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 relative cursor-pointer ${
                dietitianTab === "diary"
                  ? "bg-teal-50 dark:bg-[#1a1a1a] text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-900/40 shadow-xs"
                  : "text-slate-600 dark:text-[#888888] hover:bg-slate-50 dark:hover:bg-[#161616] hover:text-slate-900 dark:hover:text-[#ededed]"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-teal-500" />
              Food Diary Review ({diaryEntries.length})
            </button>
          </div>

          {/* Active Tab View */}
          <motion.div
            key={dietitianTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {dietitianTab === "planner" && (
              <MealPlanner
                client={activeClient}
                mealPlan={activeMealPlan}
                onUpdateMealPlan={handleUpdateMealPlan}
              />
            )}

            {dietitianTab === "anthropometrics" && (
              <AnthropometricsView
                client={activeClient}
                onAddRecord={handleAddAnthropometricRecord}
              />
            )}

            {dietitianTab === "clients" && (
              <ClientDirectory
                clients={clients}
                activeClient={activeClient}
                onSelectClient={(c) => {
                  setSelectedClientId(c.id);
                  setDietitianTab("planner");
                }}
                onAddClient={handleAddClient}
              />
            )}

            {dietitianTab === "appointments" && (
              <AppointmentsManager
                appointments={appointments}
                clients={clients}
                onAddAppointment={handleAddAppointment}
                onUpdateStatus={handleUpdateAppointmentStatus}
              />
            )}

            {dietitianTab === "diary" && (
              <FoodDiaryReview
                client={activeClient}
                diaryEntries={diaryEntries.filter(
                  (d) => d.clientId === activeClient.id || true
                )}
                onAddFeedback={handleAddDiaryFeedback}
                onToggleLike={handleToggleDiaryLike}
              />
            )}
          </motion.div>
        </div>
      )}

      {/* Patient Mobile Companion Mode View */}
      {appMode === "patient" && (
        <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 pt-24 sm:pt-28 space-y-6">
          {/* Patient Header Card with Back Button */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#222222] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <button
                type="button"
                onClick={() => setAppMode("home")}
                className="p-2 rounded-xl border border-slate-200 dark:border-[#262626] bg-slate-50 dark:bg-[#141414] text-slate-700 dark:text-[#ededed] hover:border-teal-500 transition-colors cursor-pointer"
                title="Back to ASET Home"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <img
                src={activeClient.avatar}
                alt={activeClient.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-teal-500 shadow-xs"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {activeClient.name}
                  </h3>
                  <span className="px-2 py-0.5 bg-teal-500/15 text-teal-700 dark:text-teal-400 font-bold text-[10px] rounded-full">
                    Patient Portal
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-[#888888] mt-0.5">
                  Goal: <span className="text-slate-900 dark:text-[#ededed] font-medium">{activeClient.primaryGoal}</span> • <span className="font-mono text-teal-600 dark:text-teal-400 font-bold">{activeClient.streakDays} Day Streak 🔥</span>
                </p>
              </div>
            </div>

            {/* Patient Navigation Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#161616] rounded-2xl border border-slate-200 dark:border-[#222222]">
              <button
                type="button"
                onClick={() => setPatientTab("timeline")}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  patientTab === "timeline"
                    ? "bg-white dark:bg-[#222222] text-teal-700 dark:text-teal-400 border border-slate-200 dark:border-teal-900/30 shadow-xs"
                    : "text-slate-600 dark:text-[#888888] hover:text-slate-900 dark:hover:text-[#ededed]"
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                Meals
              </button>

              <button
                type="button"
                onClick={() => setPatientTab("water")}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  patientTab === "water"
                    ? "bg-white dark:bg-[#222222] text-cyan-600 dark:text-cyan-400 border border-slate-200 dark:border-cyan-900/30 shadow-xs"
                    : "text-slate-600 dark:text-[#888888] hover:text-slate-900 dark:hover:text-[#ededed]"
                }`}
              >
                <Droplet className="w-3.5 h-3.5" />
                Water
              </button>

              <button
                type="button"
                onClick={() => setPatientTab("recipes")}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  patientTab === "recipes"
                    ? "bg-white dark:bg-[#222222] text-teal-700 dark:text-teal-400 border border-slate-200 dark:border-teal-900/30 shadow-xs"
                    : "text-slate-600 dark:text-[#888888] hover:text-slate-900 dark:hover:text-[#ededed]"
                }`}
              >
                <ChefHat className="w-3.5 h-3.5" />
                Recipes
              </button>

              <button
                type="button"
                onClick={() => setPatientTab("progress")}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  patientTab === "progress"
                    ? "bg-white dark:bg-[#222222] text-teal-700 dark:text-teal-400 border border-slate-200 dark:border-teal-900/30 shadow-xs"
                    : "text-slate-600 dark:text-[#888888] hover:text-slate-900 dark:hover:text-[#ededed]"
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                Progress
              </button>
            </div>
          </div>

          {/* Active Patient View Tab */}
          <motion.div
            key={patientTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {patientTab === "timeline" && (
              <div className="space-y-6">
                <InteractiveWaterTracker
                  waterLog={waterLog}
                  onUpdateWater={(amount) =>
                    setWaterLog({ ...waterLog, currentMl: amount })
                  }
                />
                <DailyMealTimeline
                  mealPlan={activeMealPlan}
                  client={activeClient}
                  onLogMealPhoto={handleLogMealPhoto}
                />
              </div>
            )}

            {patientTab === "water" && (
              <InteractiveWaterTracker
                waterLog={waterLog}
                onUpdateWater={(amount) =>
                  setWaterLog({ ...waterLog, currentMl: amount })
                }
              />
            )}

            {patientTab === "recipes" && <RecipeBook recipes={recipes} />}

            {patientTab === "progress" && (
              <ProgressJournal
                client={activeClient}
                onLogWeight={handleLogPatientWeight}
              />
            )}
          </motion.div>
        </div>
      )}

      {/* Sliding Floating AI Nutrition Assistant Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsAiAssistantOpen(true)}
          id="open-aset-ai-coach-fab"
          className="group relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-2xl shadow-xl shadow-teal-950/60 border border-teal-500/30 transition-all duration-300 font-semibold text-xs cursor-pointer"
        >
          <div className="relative">
            <Sparkles className="w-4 h-4 text-teal-200" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-teal-300 rounded-full ring-2 ring-[#0a0a0a] animate-ping" />
          </div>
          <span>ASET AI Assistant</span>
        </button>
      </div>

      {/* AI Clinical Assistant Sliding Drawer */}
      <AICoachDrawer
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        activeClient={activeClient}
        clientName={activeClient?.name}
        clientGoal={activeClient?.primaryGoal}
      />
    </div>
  );
}
