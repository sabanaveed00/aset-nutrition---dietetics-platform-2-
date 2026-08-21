import React, { useState } from "react";
import { SlidingDrawer } from "./SlidingDrawer";
import { MealPlan } from "../types/nutrition";
import { ShoppingBag, Check, Printer, Copy, Share2, Sparkles } from "lucide-react";

interface ShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealPlan: MealPlan;
}

export const ShoppingListModal: React.FC<ShoppingListModalProps> = ({
  isOpen,
  onClose,
  mealPlan,
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  // Group all food items from all 7 days of the meal plan
  const categorizedItems: Record<string, Array<{ name: string; count: number; portion: string }>> = {};

  if (mealPlan?.days) {
    mealPlan.days.forEach((day) => {
      if (!day?.meals) return;
      day.meals.forEach((meal) => {
        if (!meal?.items) return;
        meal.items.forEach(({ food, quantity }) => {
          if (!food || !food.name) return;
          const cat = food.category || "Pantry";
          if (!categorizedItems[cat]) {
            categorizedItems[cat] = [];
          }
          const existing = categorizedItems[cat].find((item) => item.name === food.name);
          if (existing) {
            existing.count += quantity || 1;
          } else {
            categorizedItems[cat].push({
              name: food.name,
              count: quantity || 1,
              portion: food.portion || "1 serving",
            });
          }
        });
      });
    });
  }

  const toggleCheck = (itemKey: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemKey]: !prev[itemKey],
    }));
  };

  const handleCopyList = () => {
    let text = `🛒 ASET Grocery List - ${mealPlan.name}\n\n`;
    Object.entries(categorizedItems).forEach(([category, items]) => {
      text += `[${category}]\n`;
      items.forEach((item) => {
        text += `- ${item.name} (${item.count.toFixed(1)}x ${item.portion})\n`;
      });
      text += "\n";
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <SlidingDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Weekly Grocery Shopping List"
      subtitle={`Automated ingredients checklist from ${mealPlan.name}`}
      icon={<ShoppingBag className="w-5 h-5" />}
      width="lg"
      footer={
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCopyList}
            id="copy-grocery-list-btn"
            className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#222222] border border-[#333333] text-[#ededed] rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied to Clipboard!" : "Copy Text List"}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            id="print-grocery-list-btn"
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-md shadow-teal-950 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Checklist
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="p-3.5 rounded-2xl bg-[#141414] border border-teal-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-medium text-[#ededed]">
              Aggregated from 7 days • Zero food waste portion estimation
            </span>
          </div>
          <span className="text-xs font-bold text-teal-400 font-mono">
            {Object.values(categorizedItems).reduce((acc, curr) => acc + curr.length, 0)} Items
          </span>
        </div>

        {Object.entries(categorizedItems).map(([category, items]) => (
          <div key={category} className="space-y-2.5">
            <h5 className="font-semibold text-[#888888] text-xs uppercase tracking-wider px-1">
              {category} ({items.length})
            </h5>
            <div className="space-y-1.5">
              {items.map((item, idx) => {
                const key = `${category}-${item.name}`;
                const isDone = !!checkedItems[key];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleCheck(key)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                      isDone
                        ? "bg-[#111111] border-[#1a1a1a] opacity-50 line-through text-[#666666]"
                        : "bg-[#141414] border-[#222222] hover:border-[#333333] shadow-xs text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-colors ${
                          isDone
                            ? "bg-teal-500 border-teal-500 text-black"
                            : "border-[#333333] bg-[#1a1a1a]"
                        }`}
                      >
                        {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className={`text-sm font-medium ${isDone ? "text-[#666666]" : "text-white"}`}>
                        {item.name}
                      </span>
                    </div>

                    <span className="text-xs px-2.5 py-1 rounded-lg bg-[#1a1a1a] text-[#888888] border border-white/5 font-mono">
                      {item.count > 1 ? `${item.count.toFixed(1)}x` : ""} {item.portion}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </SlidingDrawer>
  );
};
