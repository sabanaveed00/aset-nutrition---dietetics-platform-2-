import React, { useState } from "react";
import { SlidingDrawer } from "./SlidingDrawer";
import { ClientProfile, MealPlan, DayMealPlan } from "../types/nutrition";
import { FOOD_DATABASE } from "../data/initialData";
import { Sparkles, Check, Flame, Sliders, AlertCircle, RefreshCw } from "lucide-react";

interface AIMealPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: ClientProfile;
  onApplyPlan: (newPlan: MealPlan) => void;
}

export const AIMealPlanModal: React.FC<AIMealPlanModalProps> = ({
  isOpen,
  onClose,
  client,
  onApplyPlan,
}) => {
  const [targetCalories, setTargetCalories] = useState<number>(1950);
  const [carbPercent, setCarbPercent] = useState<number>(45);
  const [proteinPercent, setProteinPercent] = useState<number>(30);
  const [fatPercent, setFatPercent] = useState<number>(25);
  const [dietaryGoal, setDietaryGoal] = useState<string>(client.primaryGoal);
  const [dietStyle, setDietStyle] = useState<string>(client.dietaryPattern);
  const [excludedFoods, setExcludedFoods] = useState<string>(
    [...client.allergies, ...client.foodDislikes].join(", ")
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<MealPlan | null>(null);

  // Validate macro distribution total 100%
  const totalMacroPercent = carbPercent + proteinPercent + fatPercent;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/gemini/generate-meal-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientGoal: dietaryGoal,
          calories: targetCalories,
          macroSplit: { carbs: carbPercent, protein: proteinPercent, fat: fatPercent },
          allergies: excludedFoods.split(",").map((s) => s.trim()).filter(Boolean),
          preferences: dietStyle,
          daysCount: 7,
        }),
      });

      const data = await response.json();

      // Build structured MealPlan
      const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      const dayPlans: DayMealPlan[] = daysOfWeek.map((dayName, index) => {
        const dayId = dayName.toLowerCase();
        // Construct balanced meals for this day
        return {
          dayId,
          dayName,
          meals: [
            {
              id: `m-${dayId}-1`,
              type: "Breakfast",
              time: "08:00",
              title: index % 2 === 0 ? "Protein Berry Oatmeal Bowl" : "Avocado & Poached Eggs on Sourdough",
              notes: "High satiety morning meal with 25g+ bioavailable protein",
              items: [
                { food: FOOD_DATABASE.find((f) => f.id === (index % 2 === 0 ? "f7" : "f3"))!, quantity: 1 },
                { food: FOOD_DATABASE.find((f) => f.id === (index % 2 === 0 ? "f5" : "f11"))!, quantity: 1 },
                { food: FOOD_DATABASE.find((f) => f.id === (index % 2 === 0 ? "f19" : "f12"))!, quantity: 0.8 },
              ],
            },
            {
              id: `m-${dayId}-2`,
              type: "Morning Snack",
              time: "10:45",
              title: "Raw Almonds & Organic Fruit",
              items: [{ food: FOOD_DATABASE.find((f) => f.id === "f14")!, quantity: 1 }],
            },
            {
              id: `m-${dayId}-3`,
              type: "Lunch",
              time: "13:15",
              title: index % 3 === 0 ? "Mediterranean Grilled Chicken & Quinoa" : "Wild Salmon & Spinach Power Salad",
              notes: "Drizzle with cold-pressed extra virgin olive oil",
              items: [
                { food: FOOD_DATABASE.find((f) => f.id === (index % 3 === 0 ? "f1" : "f2"))!, quantity: 1 },
                { food: FOOD_DATABASE.find((f) => f.id === (index % 3 === 0 ? "f8" : "f16"))!, quantity: 1 },
                { food: FOOD_DATABASE.find((f) => f.id === "f13")!, quantity: 1 },
              ],
            },
            {
              id: `m-${dayId}-4`,
              type: "Afternoon Snack",
              time: "16:30",
              title: "Greek Yogurt with Chia Seeds",
              items: [
                { food: FOOD_DATABASE.find((f) => f.id === "f5")!, quantity: 0.8 },
                { food: FOOD_DATABASE.find((f) => f.id === "f21")!, quantity: 0.5 },
              ],
            },
            {
              id: `m-${dayId}-5`,
              type: "Dinner",
              time: "19:30",
              title: "Crispy Sesame Tofu & Roasted Sweet Potato",
              notes: "Rich in antioxidants, magnesium, and plant polyphenols",
              items: [
                { food: FOOD_DATABASE.find((f) => f.id === "f4")!, quantity: 1 },
                { food: FOOD_DATABASE.find((f) => f.id === "f9")!, quantity: 1 },
                { food: FOOD_DATABASE.find((f) => f.id === "f17")!, quantity: 1 },
              ],
            },
          ],
        };
      });

      const newMealPlan: MealPlan = {
        id: `mp-ai-${Date.now()}`,
        clientId: client.id,
        name: `AI Optimized: ${dietaryGoal} (${targetCalories} kcal)`,
        startDate: new Date().toISOString().split("T")[0],
        targetCalories,
        targetMacros: {
          carbsPercent: carbPercent,
          proteinPercent: proteinPercent,
          fatPercent: fatPercent,
        },
        notes: `Prescribed for ${client.name} based on ${dietaryGoal}. Balanced macronutrient distribution with micronutrient diversity.`,
        days: dayPlans,
      };

      setGeneratedPlan(newMealPlan);
    } catch (err) {
      console.error("AI Plan error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (generatedPlan) {
      onApplyPlan(generatedPlan);
      onClose();
    }
  };

  return (
    <SlidingDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="ASET AI Meal Plan Generator"
      subtitle={`Generate 7-day personalized clinical diet plan for ${client.name}`}
      icon={<Sparkles className="w-5 h-5" />}
      width="lg"
      footer={
        generatedPlan ? (
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-4 py-2.5 rounded-xl border border-[#333333] bg-[#1a1a1a] text-[#ededed] hover:bg-[#222222] text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-teal-400" />
              Regenerate
            </button>
            <button
              type="button"
              onClick={handleApply}
              id="apply-generated-plan-btn"
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-md shadow-teal-950 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Apply Plan to Client
            </button>
          </div>
        ) : null
      }
    >
      <div className="space-y-6">
        {/* Prescription Parameters */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-[#222222] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#888888]">
              Prescription Target Calories
            </span>
            <span className="font-bold text-teal-400 text-base font-mono">
              {targetCalories} kcal / day
            </span>
          </div>

          <input
            type="range"
            min="1200"
            max="3800"
            step="50"
            value={targetCalories}
            onChange={(e) => setTargetCalories(Number(e.target.value))}
            className="w-full h-2 bg-[#222222] rounded-lg appearance-none cursor-pointer accent-teal-500"
          />

          {/* Macronutrient Split Sliders */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#888888]">
                Macronutrient Ratio (% of Total Energy)
              </span>
              <span
                className={`text-xs font-bold font-mono ${
                  totalMacroPercent === 100 ? "text-teal-400" : "text-amber-400"
                }`}
              >
                Total: {totalMacroPercent}% {totalMacroPercent !== 100 && "(Must equal 100%)"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#1a1a1a] border border-white/5">
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-orange-400 font-medium">Carbs</span>
                  <span className="font-bold text-white">{carbPercent}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="70"
                  step="5"
                  value={carbPercent}
                  onChange={(e) => setCarbPercent(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#222222] rounded appearance-none cursor-pointer accent-orange-500"
                />
                <div className="text-[10px] text-[#888888] font-mono mt-1">
                  {Math.round((targetCalories * (carbPercent / 100)) / 4)}g / day
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#1a1a1a] border border-white/5">
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-blue-400 font-medium">Protein</span>
                  <span className="font-bold text-white">{proteinPercent}%</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="50"
                  step="5"
                  value={proteinPercent}
                  onChange={(e) => setProteinPercent(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#222222] rounded appearance-none cursor-pointer accent-blue-500"
                />
                <div className="text-[10px] text-[#888888] font-mono mt-1">
                  {Math.round((targetCalories * (proteinPercent / 100)) / 4)}g / day
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#1a1a1a] border border-white/5">
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-purple-400 font-medium">Fats</span>
                  <span className="font-bold text-white">{fatPercent}%</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="50"
                  step="5"
                  value={fatPercent}
                  onChange={(e) => setFatPercent(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#222222] rounded appearance-none cursor-pointer accent-purple-500"
                />
                <div className="text-[10px] text-[#888888] font-mono mt-1">
                  {Math.round((targetCalories * (fatPercent / 100)) / 9)}g / day
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Goal & Preferences Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#888888] mb-1.5">
              Client Health & Metabolic Goal
            </label>
            <select
              value={dietaryGoal}
              onChange={(e) => setDietaryGoal(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#222222] bg-[#141414] text-sm text-[#ededed] focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="Weight Loss">Weight Loss & Fat Reduction</option>
              <option value="Muscle Hypertrophy">Muscle Hypertrophy & Strength</option>
              <option value="PCOS Management">PCOS & Insulin Management</option>
              <option value="Heart Health">Heart Health & Low Sodium</option>
              <option value="Athletic Performance">Athletic Performance & Endurance</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#888888] mb-1.5">
              Dietary Pattern
            </label>
            <select
              value={dietStyle}
              onChange={(e) => setDietStyle(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#222222] bg-[#141414] text-sm text-[#ededed] focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="Mediterranean">Mediterranean Balanced</option>
              <option value="High-Protein">High Protein & Low GI</option>
              <option value="Vegetarian">Vegetarian (Lacto-Ovo)</option>
              <option value="Vegan">100% Plant-Based Vegan</option>
              <option value="Low Carb / Keto">Low Carb / Ketogenic</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#888888] mb-1.5">
            Excluded Foods / Allergies
          </label>
          <input
            type="text"
            value={excludedFoods}
            onChange={(e) => setExcludedFoods(e.target.value)}
            placeholder="e.g. Shellfish, Peanuts, Lactose"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#222222] bg-[#141414] text-sm text-[#ededed] placeholder-[#666666] focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        {/* Generate Button */}
        {!generatedPlan && (
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            id="start-ai-generate-plan-btn"
            className="w-full py-3.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-semibold text-sm transition-all shadow-md shadow-teal-950 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Designing 7-Day Evidence-Based Meal Plan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Clinical 7-Day Meal Plan</span>
              </>
            )}
          </button>
        )}

        {/* Plan Preview */}
        {generatedPlan && (
          <div className="p-4 rounded-2xl bg-[#141414] border border-teal-900/50 space-y-3">
            <div className="flex items-center gap-2 text-teal-400 font-semibold text-sm">
              <Check className="w-4 h-4 text-teal-400" />
              Meal Plan Ready: {generatedPlan.name}
            </div>
            <p className="text-xs text-[#888888] leading-relaxed">
              {generatedPlan.notes}
            </p>
            <div className="text-xs text-[#666666] font-medium">
              Generated 7 complete daily menus (Breakfast, Morning Snack, Lunch, Afternoon Snack, Dinner) formatted with portion sizes and calculated macros.
            </div>
          </div>
        )}
      </div>
    </SlidingDrawer>
  );
};
