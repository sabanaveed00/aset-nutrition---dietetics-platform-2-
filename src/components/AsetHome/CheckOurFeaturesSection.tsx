import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Target,
  Calculator,
  ChefHat,
  Sparkles,
  ChevronRight,
  X,
  CheckCircle2,
} from "lucide-react";
import { GoalSection } from "./GoalSection";
import { NutritionCalculators } from "./NutritionCalculators";
import { MealGallery } from "./MealGallery";

interface CheckOurFeaturesSectionProps {
  onOpenAuth: (mode?: "login" | "signup") => void;
  onNavigate: (sectionId: string) => void;
}

type FeatureKey = "goals" | "calculator" | "meals" | null;

export function CheckOurFeaturesSection({
  onOpenAuth,
  onNavigate,
}: CheckOurFeaturesSectionProps) {
  const [selectedFeature, setSelectedFeature] = useState<FeatureKey>(null);

  const features = [
    {
      id: "goals" as const,
      title: "Personalized Wellness Goals",
      shortDesc: "Calibrate customized metabolic targets for fat loss, hypertrophy, or longevity.",
      badge: "Goal Engine",
      icon: Target,
    },
    {
      id: "calculator" as const,
      title: "BMI & Calorie Calculator",
      shortDesc: "Evidence-based Mifflin-St Jeor TDEE, BMR, and macro split calculator.",
      badge: "Clinical Tool",
      icon: Calculator,
    },
    {
      id: "meals" as const,
      title: "Dietitian Recipe Gallery",
      shortDesc: "Explore nutrient-dense meal templates, allergen filters, and macro-balanced dishes.",
      badge: "Recipe Database",
      icon: ChefHat,
    },
  ];

  return (
    <section
      id="check-our-features"
      className="py-10 sm:py-12 bg-white dark:bg-[#0d0d0d] border-t border-slate-200/80 dark:border-[#1e1e1e] transition-colors"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/15 text-teal-800 dark:text-teal-300 text-xs font-bold mb-2.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Nutrition Technology</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Check our features
          </h2>

          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-[#888888]">
            Click any tool below to calculate your biometrics, define metabolic targets, or explore dietitian-crafted recipes.
          </p>
        </div>

        {/* Feature Selector Cards (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {features.map((feat) => {
            const IconComp = feat.icon;
            const isSelected = selectedFeature === feat.id;

            return (
              <button
                key={feat.id}
                type="button"
                onClick={() => setSelectedFeature(isSelected ? null : feat.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group relative ${
                  isSelected
                    ? "bg-teal-50/90 dark:bg-teal-950/40 border-teal-500 ring-2 ring-teal-500/30 shadow-md"
                    : "bg-slate-50 dark:bg-[#141414] border-slate-200 dark:border-[#222222] hover:border-teal-400 dark:hover:border-teal-500/60 hover:shadow-sm"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div
                      className={`p-2 rounded-xl transition-colors ${
                        isSelected
                          ? "bg-teal-600 text-white shadow-xs"
                          : "bg-white dark:bg-[#1e1e1e] text-teal-600 dark:text-teal-400 border border-slate-200 dark:border-[#2a2a2a] group-hover:bg-teal-500 group-hover:text-white"
                      }`}
                    >
                      <IconComp className="w-4.5 h-4.5" />
                    </div>

                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isSelected
                          ? "bg-teal-600 text-white"
                          : "bg-slate-200 dark:bg-[#222222] text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-[#888888] mt-1 leading-relaxed line-clamp-2">
                    {feat.shortDesc}
                  </p>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-slate-200/60 dark:border-[#222222] flex items-center justify-between text-xs font-bold text-teal-600 dark:text-teal-400">
                  <span>{isSelected ? "Active (Click to Close)" : "Open Feature"}</span>
                  {isSelected ? (
                    <X className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Display of Selected Feature */}
        <AnimatePresence mode="wait">
          {selectedFeature && (
            <motion.div
              key={selectedFeature}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl border border-teal-500/30 bg-slate-50/70 dark:bg-[#121212]/70 p-2.5 sm:p-4 shadow-xl relative"
            >
              {/* Close Button Banner */}
              <div className="flex items-center justify-between px-3 py-2 mb-3 bg-white dark:bg-[#181818] rounded-xl border border-slate-200 dark:border-[#282828] shadow-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Showing: {features.find((f) => f.id === selectedFeature)?.title}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedFeature(null)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#242424] hover:bg-slate-200 dark:hover:bg-[#303030] text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Close</span>
                </button>
              </div>

              {/* Render corresponding tool */}
              {selectedFeature === "goals" && (
                <GoalSection onOpenAuth={onOpenAuth} onNavigate={onNavigate} />
              )}

              {selectedFeature === "calculator" && (
                <NutritionCalculators onOpenAuth={onOpenAuth} />
              )}

              {selectedFeature === "meals" && (
                <MealGallery onOpenAuth={onOpenAuth} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
