import React, { useState } from "react";
import {
  Activity,
  Flame,
  Info,
  ArrowRight,
} from "lucide-react";

interface NutritionCalculatorsProps {
  onOpenAuth: (mode?: "login" | "signup") => void;
}

export function NutritionCalculators({ onOpenAuth }: NutritionCalculatorsProps) {
  const [activeTab, setActiveTab] = useState<"bmi" | "tdee">("bmi");

  // Unit System
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");

  // Common Inputs
  const [gender, setGender] = useState<"male" | "female">("female");
  const [age, setAge] = useState<number>(29);

  // Metric Values
  const [heightCm, setHeightCm] = useState<number>(170);
  const [weightKg, setWeightKg] = useState<number>(68);

  // Imperial Values
  const [heightFeet, setHeightFeet] = useState<number>(5);
  const [heightInches, setHeightInches] = useState<number>(7);
  const [weightLbs, setWeightLbs] = useState<number>(150);

  // TDEE Specific
  const [activityLevel, setActivityLevel] = useState<number>(1.375); // Light active
  const [targetGoal, setTargetGoal] = useState<"loss" | "maintain" | "gain">("loss");
  const [dietStyle] = useState<"balanced" | "high_protein" | "low_carb">("balanced");

  // Calculate actual height in meters and weight in kg
  const effectiveHeightM =
    unitSystem === "metric"
      ? heightCm / 100
      : (heightFeet * 12 + heightInches) * 0.0254;

  const effectiveWeightKg =
    unitSystem === "metric" ? weightKg : weightLbs * 0.45359237;

  // BMI Calculation
  const bmi =
    effectiveHeightM > 0
      ? Number((effectiveWeightKg / (effectiveHeightM * effectiveHeightM)).toFixed(1))
      : 0;

  // BMI Classification
  const getBmiDetails = (bmiVal: number) => {
    if (bmiVal < 18.5) {
      return {
        category: "Underweight",
        color: "text-amber-500",
        advice: "Recommend slight calorie surplus and nutrient-dense healthy fats.",
      };
    }
    if (bmiVal < 25) {
      return {
        category: "Healthy Normal Weight",
        color: "text-teal-500",
        advice: "Optimal metabolic range! Maintain balanced macros and exercise.",
      };
    }
    if (bmiVal < 30) {
      return {
        category: "Overweight",
        color: "text-amber-500",
        advice: "Recommend moderate calorie deficit (300-500 kcal) with high fiber.",
      };
    }
    return {
      category: "Obesity Class",
      color: "text-rose-500",
      advice: "Clinical nutrition guidance recommended for structured insulin care.",
    };
  };

  const bmiDetails = getBmiDetails(bmi);
  const minHealthyWeight = (18.5 * effectiveHeightM * effectiveHeightM).toFixed(1);
  const maxHealthyWeight = (24.9 * effectiveHeightM * effectiveHeightM).toFixed(1);

  // BMR Calculation via Mifflin-St Jeor Formula
  const bmr = Math.round(
    gender === "male"
      ? 10 * effectiveWeightKg + 6.25 * (effectiveHeightM * 100) - 5 * age + 5
      : 10 * effectiveWeightKg + 6.25 * (effectiveHeightM * 100) - 5 * age - 161
  );

  const tdee = Math.round(bmr * activityLevel);

  let targetCals = tdee;
  if (targetGoal === "loss") targetCals = Math.max(1200, tdee - 500);
  if (targetGoal === "gain") targetCals = tdee + 350;

  // Macro Splits
  let pPercent = 0.3;
  let cPercent = 0.45;
  let fPercent = 0.25;

  if (dietStyle === "high_protein") {
    pPercent = 0.38;
    cPercent = 0.35;
    fPercent = 0.27;
  } else if (dietStyle === "low_carb") {
    pPercent = 0.35;
    cPercent = 0.2;
    fPercent = 0.45;
  }

  const pGrams = Math.round((targetCals * pPercent) / 4);
  const cGrams = Math.round((targetCals * cPercent) / 4);
  const fGrams = Math.round((targetCals * fPercent) / 9);

  return (
    <div className="p-3 sm:p-5">
      {/* Compact Header & Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-[#222222]">
        {/* Selector Tabs */}
        <div className="inline-flex p-1 bg-white dark:bg-[#181818] rounded-xl border border-slate-200 dark:border-[#282828] shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab("bmi")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "bmi"
                ? "bg-teal-600 text-white shadow-xs"
                : "text-slate-600 dark:text-[#888888] hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>BMI Index</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("tdee")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "tdee"
                ? "bg-teal-600 text-white shadow-xs"
                : "text-slate-600 dark:text-[#888888] hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>TDEE & Macros</span>
          </button>
        </div>

        {/* Unit & Gender Toggle Pills */}
        <div className="flex items-center gap-2">
          {/* Unit Toggle */}
          <div className="inline-flex p-0.5 bg-white dark:bg-[#181818] rounded-lg border border-slate-200 dark:border-[#282828] text-[11px]">
            <button
              type="button"
              onClick={() => setUnitSystem("metric")}
              className={`px-2 py-1 rounded-md font-semibold cursor-pointer ${
                unitSystem === "metric"
                  ? "bg-teal-600 text-white"
                  : "text-slate-500"
              }`}
            >
              Metric (kg/cm)
            </button>
            <button
              type="button"
              onClick={() => setUnitSystem("imperial")}
              className={`px-2 py-1 rounded-md font-semibold cursor-pointer ${
                unitSystem === "imperial"
                  ? "bg-teal-600 text-white"
                  : "text-slate-500"
              }`}
            >
              Imperial (lbs/ft)
            </button>
          </div>

          {/* Gender Toggle */}
          <div className="inline-flex p-0.5 bg-white dark:bg-[#181818] rounded-lg border border-slate-200 dark:border-[#282828] text-[11px]">
            <button
              type="button"
              onClick={() => setGender("female")}
              className={`px-2 py-1 rounded-md font-semibold cursor-pointer ${
                gender === "female"
                  ? "bg-teal-600 text-white"
                  : "text-slate-500"
              }`}
            >
              Female
            </button>
            <button
              type="button"
              onClick={() => setGender("male")}
              className={`px-2 py-1 rounded-md font-semibold cursor-pointer ${
                gender === "male"
                  ? "bg-teal-600 text-white"
                  : "text-slate-500"
              }`}
            >
              Male
            </button>
          </div>
        </div>
      </div>

      {/* 2-Column Responsive Layout: Inputs Left, Live Results Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mt-4 items-start">
        {/* Left: Compact Input Controls */}
        <div className="lg:col-span-6 space-y-3">
          <div className="grid grid-cols-3 gap-2.5">
            {/* Age */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Age
              </label>
              <input
                type="number"
                min="14"
                max="100"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#2a2a2a] bg-white dark:bg-[#181818] text-slate-900 dark:text-white font-mono text-xs focus:ring-1 focus:ring-teal-500"
              />
            </div>

            {/* Height */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Height {unitSystem === "metric" ? "(cm)" : "(ft/in)"}
              </label>
              {unitSystem === "metric" ? (
                <input
                  type="number"
                  min="100"
                  max="240"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#2a2a2a] bg-white dark:bg-[#181818] text-slate-900 dark:text-white font-mono text-xs focus:ring-1 focus:ring-teal-500"
                />
              ) : (
                <div className="grid grid-cols-2 gap-1">
                  <input
                    type="number"
                    min="3"
                    max="7"
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(Number(e.target.value))}
                    className="w-full px-1.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#2a2a2a] bg-white dark:bg-[#181818] text-slate-900 dark:text-white font-mono text-xs"
                  />
                  <input
                    type="number"
                    min="0"
                    max="11"
                    value={heightInches}
                    onChange={(e) => setHeightInches(Number(e.target.value))}
                    className="w-full px-1.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#2a2a2a] bg-white dark:bg-[#181818] text-slate-900 dark:text-white font-mono text-xs"
                  />
                </div>
              )}
            </div>

            {/* Weight */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Weight {unitSystem === "metric" ? "(kg)" : "(lbs)"}
              </label>
              {unitSystem === "metric" ? (
                <input
                  type="number"
                  min="30"
                  max="250"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#2a2a2a] bg-white dark:bg-[#181818] text-slate-900 dark:text-white font-mono text-xs focus:ring-1 focus:ring-teal-500"
                />
              ) : (
                <input
                  type="number"
                  min="70"
                  max="500"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#2a2a2a] bg-white dark:bg-[#181818] text-slate-900 dark:text-white font-mono text-xs focus:ring-1 focus:ring-teal-500"
                />
              )}
            </div>
          </div>

          {activeTab === "tdee" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Activity Level
                </label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-[#2a2a2a] bg-white dark:bg-[#181818] text-slate-900 dark:text-white text-xs font-medium"
                >
                  <option value={1.2}>Sedentary (desk job)</option>
                  <option value={1.375}>Lightly Active (1-3 days/wk)</option>
                  <option value={1.55}>Moderately Active (3-5 days/wk)</option>
                  <option value={1.725}>Very Active (6-7 days/wk)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Caloric Goal
                </label>
                <select
                  value={targetGoal}
                  onChange={(e) => setTargetGoal(e.target.value as any)}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-[#2a2a2a] bg-white dark:bg-[#181818] text-slate-900 dark:text-white text-xs font-medium"
                >
                  <option value="loss">Weight Loss (-500 kcal)</option>
                  <option value="maintain">Maintenance (TDEE)</option>
                  <option value="gain">Muscle Surplus (+350 kcal)</option>
                </select>
              </div>
            </div>
          )}

          {/* Helper note */}
          <div className="p-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/40 text-[11px] text-slate-700 dark:text-slate-300 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
            <span>{bmiDetails.advice}</span>
          </div>
        </div>

        {/* Right: Live Calculation Output Display */}
        <div className="lg:col-span-6">
          {activeTab === "bmi" ? (
            <div className="p-4 rounded-xl bg-white dark:bg-[#161616] border border-slate-200 dark:border-[#262626] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Calculated BMI
                  </span>
                  <div className="text-3xl font-black text-teal-600 dark:text-teal-400 font-mono">
                    {bmi} <span className="text-xs font-normal text-slate-400">kg/m²</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-teal-500/15 text-teal-700 dark:text-teal-300">
                    {bmiDetails.category}
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Healthy span: {minHealthyWeight} - {maxHealthyWeight} kg
                  </div>
                </div>
              </div>

              {/* Compact BMI Colored Gauge Bar */}
              <div className="space-y-1">
                <div className="h-2 w-full rounded-full overflow-hidden flex bg-slate-200 dark:bg-[#222222]">
                  <div className="bg-blue-400 h-full w-[18.5%]" title="Underweight (<18.5)" />
                  <div className="bg-teal-500 h-full w-[25%]" title="Normal (18.5-24.9)" />
                  <div className="bg-amber-400 h-full w-[20%]" title="Overweight (25-29.9)" />
                  <div className="bg-rose-500 h-full w-[36.5%]" title="Obese (30+)" />
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                  <span>&lt;18.5</span>
                  <span className="text-teal-500 font-bold">18.5-24.9</span>
                  <span>25-29.9</span>
                  <span>30+</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-white dark:bg-[#161616] border border-slate-200 dark:border-[#262626] shadow-sm space-y-3">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#202020]">
                  <span className="text-[10px] text-slate-500">BMR at Rest</span>
                  <div className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                    {bmr} kcal
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/50">
                  <span className="text-[10px] text-teal-700 dark:text-teal-300 font-semibold">
                    Target Daily Intake
                  </span>
                  <div className="text-lg font-black font-mono text-teal-600 dark:text-teal-300">
                    {targetCals} kcal
                  </div>
                </div>
              </div>

              {/* Macro Distribution */}
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#202020]">
                  <span className="text-[10px] text-blue-500 font-bold">Protein</span>
                  <div className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                    {pGrams}g
                  </div>
                  <span className="text-[9px] text-slate-400">{Math.round(pPercent * 100)}%</span>
                </div>

                <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#202020]">
                  <span className="text-[10px] text-teal-500 font-bold">Carbs</span>
                  <div className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                    {cGrams}g
                  </div>
                  <span className="text-[9px] text-slate-400">{Math.round(cPercent * 100)}%</span>
                </div>

                <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#202020]">
                  <span className="text-[10px] text-amber-500 font-bold">Fats</span>
                  <div className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                    {fGrams}g
                  </div>
                  <span className="text-[9px] text-slate-400">{Math.round(fPercent * 100)}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Action CTA */}
          <button
            type="button"
            onClick={() => onOpenAuth("signup")}
            className="w-full mt-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Log Nutrition Targets in ASET</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
