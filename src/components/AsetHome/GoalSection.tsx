import React, { useState } from "react";
import {
  Target,
  Dumbbell,
  HeartPulse,
  Leaf,
  Zap,
  TrendingDown,
  CheckCircle2,
  ArrowRight,
  Award,
} from "lucide-react";

interface GoalSectionProps {
  onOpenAuth: (mode?: "login" | "signup") => void;
  onNavigate?: (sectionId: string) => void;
}

export function GoalSection({ onOpenAuth }: GoalSectionProps) {
  const [selectedGoal, setSelectedGoal] = useState<
    "weight_loss" | "muscle_gain" | "longevity" | "diabetes" | "vegan" | "endurance"
  >("weight_loss");

  const [currentWeight, setCurrentWeight] = useState(82);
  const [targetWeight, setTargetWeight] = useState(74);
  const [timelineWeeks, setTimelineWeeks] = useState(16);

  const goals = [
    {
      id: "weight_loss" as const,
      title: "Weight Loss & Recomp",
      desc: "Healthy fat loss preserving lean muscle.",
      icon: TrendingDown,
      calorieMod: -450,
      proteinGPerKg: 2.0,
      fatPercent: 0.25,
    },
    {
      id: "muscle_gain" as const,
      title: "Lean Muscle Hypertrophy",
      desc: "Controlled caloric surplus for hypertrophy.",
      icon: Dumbbell,
      calorieMod: +300,
      proteinGPerKg: 2.2,
      fatPercent: 0.25,
    },
    {
      id: "longevity" as const,
      title: "Longevity & Metabolic Care",
      desc: "Anti-inflammatory & autophagy support.",
      icon: HeartPulse,
      calorieMod: 0,
      proteinGPerKg: 1.6,
      fatPercent: 0.35,
    },
    {
      id: "diabetes" as const,
      title: "Blood Glucose & Insulin",
      desc: "Low glycemic load to balance insulin.",
      icon: Target,
      calorieMod: -250,
      proteinGPerKg: 1.8,
      fatPercent: 0.35,
    },
    {
      id: "vegan" as const,
      title: "Plant-Based & Vegan",
      desc: "Complete amino acid profile & micros.",
      icon: Leaf,
      calorieMod: 0,
      proteinGPerKg: 1.8,
      fatPercent: 0.25,
    },
    {
      id: "endurance" as const,
      title: "Athletic Endurance",
      desc: "Glycogen replenishment & stamina.",
      icon: Zap,
      calorieMod: +400,
      proteinGPerKg: 1.7,
      fatPercent: 0.2,
    },
  ];

  const currentGoalObj = goals.find((g) => g.id === selectedGoal) || goals[0];

  // Live energy calculations
  const bmrEstimate = 10 * currentWeight + 6.25 * 175 - 5 * 30 + 5;
  const tdeeEstimate = Math.round(bmrEstimate * 1.4);
  const targetCalories = Math.max(1200, tdeeEstimate + currentGoalObj.calorieMod);

  // Macros in grams
  const proteinG = Math.round(currentWeight * currentGoalObj.proteinGPerKg);
  const proteinCals = proteinG * 4;
  const fatCals = Math.round(targetCalories * currentGoalObj.fatPercent);
  const fatG = Math.round(fatCals / 9);
  const carbCals = Math.max(0, targetCalories - (proteinCals + fatCals));
  const carbG = Math.round(carbCals / 4);

  const weightDelta = Math.abs(currentWeight - targetWeight);
  const weeklyRate = (weightDelta / timelineWeeks).toFixed(2);

  return (
    <div className="p-3 sm:p-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* Left Column: Compact Goal Archetype Selector & Sliders */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              1. Choose Primary Goal
            </span>
            <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">
              Selected: {currentGoalObj.title}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {goals.map((goal) => {
              const IconComp = goal.icon;
              const isSelected = selectedGoal === goal.id;
              return (
                <div
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal.id)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-teal-50 dark:bg-teal-950/50 border-teal-500 ring-1 ring-teal-500/30 shadow-xs"
                      : "bg-white dark:bg-[#161616] border-slate-200 dark:border-[#262626] hover:border-teal-400"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1.5 rounded-lg shrink-0 ${
                        isSelected
                          ? "bg-teal-600 text-white"
                          : "bg-slate-100 dark:bg-[#202020] text-teal-600 dark:text-teal-400"
                      }`}
                    >
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                        {goal.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-[#888888] line-clamp-1">
                        {goal.desc}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Compact Parameter Adjustment Sliders */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#161616] border border-slate-200 dark:border-[#262626] space-y-3 shadow-xs">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              2. Calibrate Weight & Horizon
            </span>

            {/* Current Weight Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-600 dark:text-[#888888]">
                  Current Weight
                </span>
                <span className="font-mono text-teal-600 dark:text-teal-400 font-bold text-xs">
                  {currentWeight} kg ({Math.round(currentWeight * 2.20462)} lbs)
                </span>
              </div>
              <input
                type="range"
                min="45"
                max="160"
                step="1"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-[#262626] rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
            </div>

            {/* Target Weight Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-600 dark:text-[#888888]">
                  Target Weight
                </span>
                <span className="font-mono text-teal-600 dark:text-teal-400 font-bold text-xs">
                  {targetWeight} kg ({Math.round(targetWeight * 2.20462)} lbs)
                </span>
              </div>
              <input
                type="range"
                min="45"
                max="160"
                step="1"
                value={targetWeight}
                onChange={(e) => setTargetWeight(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-[#262626] rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
            </div>

            {/* Timeline Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-600 dark:text-[#888888]">
                  Target Horizon
                </span>
                <span className="font-mono text-teal-600 dark:text-teal-400 font-bold text-xs">
                  {timelineWeeks} Weeks (~{(timelineWeeks / 4.3).toFixed(1)} Mo)
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="52"
                step="1"
                value={timelineWeeks}
                onChange={(e) => setTimelineWeeks(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-[#262626] rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live Plan Projection Card (Compact) */}
        <div className="lg:col-span-5 p-4 rounded-xl bg-slate-900 text-white dark:bg-[#141414] border border-slate-800 dark:border-[#262626] shadow-lg space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 dark:border-[#262626]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 font-mono">
                ASET Recommended Protocol
              </span>
              <h4 className="text-sm font-bold text-white mt-0.5">
                {currentGoalObj.title}
              </h4>
            </div>
            <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Target Calories Pill */}
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-center space-y-0.5">
            <span className="text-[10px] text-slate-400">
              Daily Target Energy
            </span>
            <div className="text-2xl font-black text-teal-400 font-mono leading-tight">
              {targetCalories}{" "}
              <span className="text-xs font-normal text-slate-400">kcal/day</span>
            </div>
            <div className="text-[10px] text-slate-300 font-mono">
              TDEE: {tdeeEstimate} kcal ({currentGoalObj.calorieMod > 0 ? `+${currentGoalObj.calorieMod}` : currentGoalObj.calorieMod} kcal)
            </div>
          </div>

          {/* Macro Breakdown */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
              Daily Macro Split
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-center">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                <span className="text-[10px] text-blue-400 font-semibold">Protein</span>
                <div className="text-sm font-bold text-white font-mono mt-0.5">
                  {proteinG}g
                </div>
                <span className="text-[9px] text-slate-400">
                  {Math.round((proteinCals / targetCalories) * 100)}%
                </span>
              </div>

              <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                <span className="text-[10px] text-teal-400 font-semibold">Carbs</span>
                <div className="text-sm font-bold text-white font-mono mt-0.5">
                  {carbG}g
                </div>
                <span className="text-[9px] text-slate-400">
                  {Math.round((carbCals / targetCalories) * 100)}%
                </span>
              </div>

              <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                <span className="text-[10px] text-amber-400 font-semibold">Fats</span>
                <div className="text-sm font-bold text-white font-mono mt-0.5">
                  {fatG}g
                </div>
                <span className="text-[9px] text-slate-400">
                  {Math.round((fatCals / targetCalories) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Projected Pace & Timeline */}
          <div className="p-2.5 rounded-lg bg-teal-950/40 border border-teal-800/40 text-[11px] text-teal-200 flex items-center justify-between">
            <span>Weekly Projected Pace:</span>
            <span className="font-mono font-bold text-teal-300">~{weeklyRate} kg/week</span>
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={() => onOpenAuth("signup")}
            className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Adopt This Goal Plan</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
