import React, { useState } from "react";
import { SlidingDrawer } from "./SlidingDrawer";
import { FoodItem } from "../types/nutrition";
import { FOOD_DATABASE } from "../data/initialData";
import { ArrowLeftRight, Sparkles, Check, Flame, Award, AlertCircle } from "lucide-react";

interface FoodSwapDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  targetFood: FoodItem | null;
  targetQuantity?: number;
  onApplySwap: (originalId: string, newFood: FoodItem, newQuantity: number) => void;
}

export const FoodSwapDrawer: React.FC<FoodSwapDrawerProps> = ({
  isOpen,
  onClose,
  targetFood,
  targetQuantity = 1,
  onApplySwap,
}) => {
  const [selectedSwapId, setSelectedSwapId] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [customSearch, setCustomSearch] = useState<string>("");

  if (!targetFood) return null;

  const currentCalories = Math.round(targetFood.calories * targetQuantity);
  const currentProtein = Math.round(targetFood.macros.protein * targetQuantity);
  const currentCarbs = Math.round(targetFood.macros.carbs * targetQuantity);
  const currentFat = Math.round(targetFood.macros.fat * targetQuantity);

  // Local database matching alternatives in same category
  const databaseAlternatives = FOOD_DATABASE.filter(
    (f) => f.id !== targetFood.id && (f.category === targetFood.category || Math.abs(f.calories - targetFood.calories) < 80)
  ).slice(0, 5);

  const handleFetchAiSubstitutions = async () => {
    setIsAiLoading(true);
    try {
      const response = await fetch("/api/gemini/food-swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          foodName: targetFood.name,
          portion: targetFood.portion,
          currentCalories,
          currentMacros: targetFood.macros,
          reason: "variety and optimal nutrient density",
        }),
      });
      const res = await response.json();
      if (res.data?.alternatives) {
        setAiSuggestions(res.data.alternatives);
      }
    } catch (err) {
      console.error("Failed to load AI suggestions", err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleApply = (food: FoodItem) => {
    onApplySwap(targetFood.id, food, targetQuantity);
    onClose();
  };

  return (
    <SlidingDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Smart Food Substitution"
      subtitle={`Find nutrient-equivalent alternatives for ${targetFood.name}`}
      icon={<ArrowLeftRight className="w-5 h-5" />}
      width="lg"
    >
      <div className="space-y-6">
        {/* Original Food Current Metrics */}
        <div className="p-4 rounded-2xl bg-[#141414] border border-[#222222]">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#666666] mb-2">
            Current Selected Food
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-white text-base">
                {targetFood.name}
              </h4>
              <p className="text-xs text-[#888888]">
                Portion: {targetFood.portion} ({targetQuantity}x serving)
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-900/30 border border-teal-800/50 text-teal-400 font-bold text-xs font-mono">
                <Flame className="w-3 h-3 text-amber-500" />
                {currentCalories} kcal
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#222222] text-center font-mono">
            <div className="bg-[#1a1a1a] p-2.5 rounded-xl border border-white/5">
              <div className="text-[11px] text-[#888888]">Protein</div>
              <div className="text-xs font-bold text-blue-400">{currentProtein}g</div>
            </div>
            <div className="bg-[#1a1a1a] p-2.5 rounded-xl border border-white/5">
              <div className="text-[11px] text-[#888888]">Carbs</div>
              <div className="text-xs font-bold text-orange-400">{currentCarbs}g</div>
            </div>
            <div className="bg-[#1a1a1a] p-2.5 rounded-xl border border-white/5">
              <div className="text-[11px] text-[#888888]">Fats</div>
              <div className="text-xs font-bold text-purple-400">{currentFat}g</div>
            </div>
          </div>
        </div>

        {/* AI Dietitian Swaps Generator Button */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-teal-900/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-teal-900/30 text-teal-400 border border-teal-800/40">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-semibold text-white text-sm">
                  ASET AI Clinical Swaps
                </h5>
                <p className="text-xs text-[#888888]">
                  Analyze macro similarity, glycemic load & culinary compatibility
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleFetchAiSubstitutions}
              disabled={isAiLoading}
              id="ai-generate-swaps-btn"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-teal-950 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {isAiLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate Swaps
                </>
              )}
            </button>
          </div>

          {/* Render AI Suggestions if available */}
          {aiSuggestions.length > 0 && (
            <div className="mt-4 space-y-3">
              <div className="text-xs font-semibold text-teal-400">
                Dietitian Recommended Swaps:
              </div>
              {aiSuggestions.map((aiSwap, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-[#1a1a1a] rounded-xl border border-teal-900/40 shadow-xs"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-white text-sm flex items-center gap-1.5">
                        {aiSwap.name}
                        <span className="text-teal-400 text-[11px] font-normal font-mono">
                          ({aiSwap.portion})
                        </span>
                      </div>
                      <p className="text-xs text-[#888888] mt-1">
                        {aiSwap.benefits}
                      </p>
                      {aiSwap.culinaryTip && (
                        <p className="text-[11px] text-[#666666] italic mt-0.5">
                          Tip: {aiSwap.culinaryTip}
                        </p>
                      )}
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-xs font-bold text-white">
                        {aiSwap.calories} kcal
                      </div>
                      <div className="text-[10px] text-[#888888]">
                        P: {aiSwap.protein}g | C: {aiSwap.carbs}g | F: {aiSwap.fat}g
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Database Equivalent Replacements */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="font-semibold text-white text-sm">
              ASET Food Database Alternatives
            </h5>
            <span className="text-xs text-[#888888]">Matched by category & macros</span>
          </div>

          <div className="space-y-2.5">
            {databaseAlternatives.map((alt) => {
              const calDiff = alt.calories - currentCalories;
              return (
                <div
                  key={alt.id}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    selectedSwapId === alt.id
                      ? "border-teal-500 bg-[#161d1b]"
                      : "border-[#222222] bg-[#141414] hover:border-[#333333]"
                  }`}
                  onClick={() => setSelectedSwapId(alt.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {alt.imageUrl && (
                        <img
                          src={alt.imageUrl}
                          alt={alt.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover border border-[#222222]"
                        />
                      )}
                      <div>
                        <h6 className="font-semibold text-white text-sm">
                          {alt.name}
                        </h6>
                        <p className="text-xs text-[#888888]">
                          {alt.portion} • {alt.category}
                        </p>
                        <div className="flex items-center gap-2 mt-1 font-mono">
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#1a1a1a] text-blue-400 border border-white/5 font-medium">
                            P: {alt.macros.protein}g
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#1a1a1a] text-orange-400 border border-white/5 font-medium">
                            C: {alt.macros.carbs}g
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#1a1a1a] text-purple-400 border border-white/5 font-medium">
                            F: {alt.macros.fat}g
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end gap-1 font-mono">
                      <span className="font-bold text-sm text-white">
                        {alt.calories} kcal
                      </span>
                      <span
                        className={`text-[11px] font-medium ${
                          calDiff === 0
                            ? "text-[#888888]"
                            : calDiff > 0
                            ? "text-orange-400"
                            : "text-teal-400"
                        }`}
                      >
                        {calDiff > 0 ? `+${calDiff}` : calDiff} kcal
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApply(alt);
                        }}
                        id={`swap-apply-${alt.id}`}
                        className="mt-1 px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Check className="w-3 h-3" />
                        Apply Swap
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SlidingDrawer>
  );
};
