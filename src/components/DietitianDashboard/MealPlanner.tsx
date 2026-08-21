import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MealPlan,
  ClientProfile,
  PlannedMeal,
  FoodItem,
  MealType,
} from "../../types/nutrition";
import { AddFoodDrawer } from "../AddFoodDrawer";
import { FoodSwapDrawer } from "../FoodSwapDrawer";
import { AIMealPlanModal } from "../AIMealPlanModal";
import { ShoppingListModal } from "../ShoppingListModal";
import {
  Sparkles,
  Plus,
  Trash2,
  ArrowLeftRight,
  Flame,
  Clock,
  ShoppingBag,
  Printer,
  ChevronRight,
  ChevronLeft,
  PieChart,
  Copy,
  CheckCircle2,
} from "lucide-react";

interface MealPlannerProps {
  client: ClientProfile;
  mealPlan: MealPlan;
  onUpdateMealPlan: (updated: MealPlan) => void;
}

export const MealPlanner: React.FC<MealPlannerProps> = ({
  client,
  mealPlan,
  onUpdateMealPlan,
}) => {
  const [selectedDayId, setSelectedDayId] = useState<string>("monday");
  const [addFoodTarget, setAddFoodTarget] = useState<{
    mealType: MealType;
    isOpen: boolean;
  }>({ mealType: "Breakfast", isOpen: false });
  const [swapTarget, setSwapTarget] = useState<{
    food: FoodItem | null;
    quantity: number;
    mealType: MealType;
    isOpen: boolean;
  }>({ food: null, quantity: 1, mealType: "Breakfast", isOpen: false });

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const days = [
    { id: "monday", label: "Mon" },
    { id: "tuesday", label: "Tue" },
    { id: "wednesday", label: "Wed" },
    { id: "thursday", label: "Thu" },
    { id: "friday", label: "Fri" },
    { id: "saturday", label: "Sat" },
    { id: "sunday", label: "Sun" },
  ];

  const currentDayPlan =
    mealPlan.days.find((d) => d.dayId === selectedDayId) || mealPlan.days[0];

  // Calculate day total calories and macros
  let dayCalories = 0;
  let dayProtein = 0;
  let dayCarbs = 0;
  let dayFat = 0;
  let dayFiber = 0;

  currentDayPlan.meals.forEach((meal) => {
    meal.items.forEach(({ food, quantity }) => {
      if (!food) return;
      dayCalories += (food.calories || 0) * (quantity || 1);
      dayProtein += (food.macros?.protein || 0) * (quantity || 1);
      dayCarbs += (food.macros?.carbs || 0) * (quantity || 1);
      dayFat += (food.macros?.fat || 0) * (quantity || 1);
      dayFiber += (food.macros?.fiber || 0) * (quantity || 1);
    });
  });

  dayCalories = Math.round(dayCalories);
  dayProtein = Math.round(dayProtein);
  dayCarbs = Math.round(dayCarbs);
  dayFat = Math.round(dayFat);
  dayFiber = Math.round(dayFiber);

  const targetCalories = mealPlan.targetCalories || 1950;
  const calPercent = Math.min(100, Math.round((dayCalories / targetCalories) * 100));

  // Handle adding food item
  const handleAddFood = (food: FoodItem, quantity: number) => {
    const updatedDays = mealPlan.days.map((day) => {
      if (day.dayId === selectedDayId) {
        const updatedMeals = day.meals.map((meal) => {
          if (meal.type === addFoodTarget.mealType) {
            return {
              ...meal,
              items: [...meal.items, { food, quantity }],
            };
          }
          return meal;
        });
        return { ...day, meals: updatedMeals };
      }
      return day;
    });

    onUpdateMealPlan({ ...mealPlan, days: updatedDays });
  };

  // Handle removing food item
  const handleRemoveFood = (mealType: MealType, foodId: string) => {
    const updatedDays = mealPlan.days.map((day) => {
      if (day.dayId === selectedDayId) {
        const updatedMeals = day.meals.map((meal) => {
          if (meal.type === mealType) {
            return {
              ...meal,
              items: meal.items.filter((item) => item.food.id !== foodId),
            };
          }
          return meal;
        });
        return { ...day, meals: updatedMeals };
      }
      return day;
    });

    onUpdateMealPlan({ ...mealPlan, days: updatedDays });
  };

  // Handle applying food swap
  const handleApplySwap = (
    originalId: string,
    newFood: FoodItem,
    newQuantity: number
  ) => {
    const updatedDays = mealPlan.days.map((day) => {
      if (day.dayId === selectedDayId) {
        const updatedMeals = day.meals.map((meal) => {
          if (meal.type === swapTarget.mealType) {
            const updatedItems = meal.items.map((item) => {
              if (item.food.id === originalId) {
                return { food: newFood, quantity: newQuantity };
              }
              return item;
            });
            return { ...meal, items: updatedItems };
          }
          return meal;
        });
        return { ...day, meals: updatedMeals };
      }
      return day;
    });

    onUpdateMealPlan({ ...mealPlan, days: updatedDays });
  };

  // Duplicate current day to other days
  const handleDuplicateToAll = () => {
    const sourceMeals = currentDayPlan.meals;
    const updatedDays = mealPlan.days.map((d) => ({
      ...d,
      meals: JSON.parse(JSON.stringify(sourceMeals)),
    }));
    onUpdateMealPlan({ ...mealPlan, days: updatedDays });
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Energy & Macro Distribution Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#222222] shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-700 dark:text-teal-400 font-bold text-xs">
                Active Prescription
              </span>
              <span className="text-xs text-slate-500 dark:text-[#888888]">
                Client: <span className="text-slate-900 dark:text-[#ededed] font-medium">{client.name}</span> ({client.primaryGoal})
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1.5">
              {mealPlan.name}
            </h3>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setIsAiModalOpen(true)}
              id="open-ai-meal-plan-modal-btn"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-teal-900/30 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              ASET AI Planner
            </button>

            <button
              type="button"
              onClick={() => setIsShoppingListOpen(true)}
              id="open-shopping-list-btn"
              className="px-4 py-2 bg-slate-100 dark:bg-[#1a1a1a] hover:bg-slate-200 dark:hover:bg-[#222222] border border-slate-200 dark:border-[#333333] text-slate-800 dark:text-[#ededed] rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              Shopping List
            </button>

            <button
              type="button"
              onClick={handleDuplicateToAll}
              className="px-3.5 py-2 bg-slate-100 dark:bg-[#1a1a1a] hover:bg-slate-200 dark:hover:bg-[#222222] border border-slate-200 dark:border-[#333333] text-slate-600 dark:text-[#888888] hover:text-slate-900 dark:hover:text-[#ededed] rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Copy this day's meals across all 7 days"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy Day
            </button>
          </div>
        </div>

        {copiedNotification && (
          <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800/60 text-teal-900 dark:text-teal-300 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            Day menu copied across Monday - Sunday successfully!
          </div>
        )}

        {/* Nutritional Gauges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 pt-1">
          {/* Calories Gauge */}
          <div className="bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-[#222222] p-4 sm:p-5 rounded-2xl">
            <p className="text-[11px] uppercase tracking-widest text-slate-500 dark:text-[#666666] mb-1 font-medium">Calories</p>
            <h3 className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {dayCalories}{" "}
              <span className="text-xs sm:text-sm font-normal text-teal-600 dark:text-teal-400">
                / {targetCalories} kcal
              </span>
            </h3>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-[#222222] mt-3 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  calPercent > 105 ? "bg-rose-500" : "bg-teal-500"
                }`}
                style={{ width: `${calPercent}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500 dark:text-[#888888] font-mono mt-2 flex justify-between">
              <span>{calPercent}% target</span>
              <span>{Math.max(0, targetCalories - dayCalories)} kcal left</span>
            </div>
          </div>

          {/* Protein */}
          <div className="bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-[#222222] p-4 sm:p-5 rounded-2xl">
            <p className="text-[11px] uppercase tracking-widest text-slate-500 dark:text-[#666666] mb-1 font-medium">Protein</p>
            <h3 className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {dayProtein} <span className="text-xs sm:text-sm font-normal text-teal-600 dark:text-teal-400">g</span>
            </h3>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-[#222222] mt-3 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-500 rounded-full"
                style={{
                  width: `${Math.min(100, (dayProtein / (targetCalories * 0.3 / 4)) * 100)}%`,
                }}
              />
            </div>
            <div className="text-[10px] text-slate-500 dark:text-[#888888] font-mono mt-2">
              {Math.round(((dayProtein * 4) / (dayCalories || 1)) * 100)}% of calories
            </div>
          </div>

          {/* Carbs */}
          <div className="bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-[#222222] p-4 sm:p-5 rounded-2xl">
            <p className="text-[11px] uppercase tracking-widest text-slate-500 dark:text-[#666666] mb-1 font-medium">Carbs</p>
            <h3 className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {dayCarbs} <span className="text-xs sm:text-sm font-normal text-teal-600 dark:text-teal-400">g</span>
            </h3>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-[#222222] mt-3 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 transition-all duration-500 rounded-full"
                style={{
                  width: `${Math.min(100, (dayCarbs / (targetCalories * 0.45 / 4)) * 100)}%`,
                }}
              />
            </div>
            <div className="text-[10px] text-slate-500 dark:text-[#888888] font-mono mt-2">
              {Math.round(((dayCarbs * 4) / (dayCalories || 1)) * 100)}% of calories
            </div>
          </div>

          {/* Fats */}
          <div className="bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-[#222222] p-4 sm:p-5 rounded-2xl">
            <p className="text-[11px] uppercase tracking-widest text-slate-500 dark:text-[#666666] mb-1 font-medium">Fats</p>
            <h3 className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {dayFat} <span className="text-xs sm:text-sm font-normal text-teal-600 dark:text-teal-400">g</span>
            </h3>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-[#222222] mt-3 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all duration-500 rounded-full"
                style={{
                  width: `${Math.min(100, (dayFat / (targetCalories * 0.25 / 9)) * 100)}%`,
                }}
              />
            </div>
            <div className="text-[10px] text-slate-500 dark:text-[#888888] font-mono mt-2">
              {Math.round(((dayFat * 9) / (dayCalories || 1)) * 100)}% of calories
            </div>
          </div>

          {/* Fiber */}
          <div className="bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-[#222222] p-4 sm:p-5 rounded-2xl col-span-2 sm:col-span-1">
            <p className="text-[11px] uppercase tracking-widest text-slate-500 dark:text-[#666666] mb-1 font-medium">Fiber</p>
            <h3 className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {dayFiber} <span className="text-xs sm:text-sm font-normal text-teal-600 dark:text-teal-400">g</span>
            </h3>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-[#222222] mt-3 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-400 transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, (dayFiber / 30) * 100)}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500 dark:text-[#888888] font-mono mt-2">
              Target: 30g+ daily
            </div>
          </div>
        </div>
      </div>

      {/* Sliding Day Picker Carousel Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto p-1.5 bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-[#222222] shadow-xs custom-scrollbar">
        {days.map((day) => {
          const isActive = selectedDayId === day.id;
          return (
            <button
              key={day.id}
              type="button"
              onClick={() => setSelectedDayId(day.id)}
              className={`flex-1 min-w-[70px] py-2.5 px-3 rounded-xl text-xs font-semibold transition-all relative flex flex-col items-center gap-0.5 cursor-pointer ${
                isActive
                  ? "bg-teal-50 dark:bg-[#1a1a1a] text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-900/40 shadow-xs"
                  : "text-slate-600 dark:text-[#888888] hover:text-slate-900 dark:hover:text-[#ededed]"
              }`}
            >
              <span>{day.label}</span>
              <span className="text-[10px] font-mono opacity-70">
                {day.id === "monday" ? "Day 01" : day.id === "tuesday" ? "Day 02" : day.id === "wednesday" ? "Day 03" : day.id === "thursday" ? "Day 04" : day.id === "friday" ? "Day 05" : day.id === "saturday" ? "Day 06" : "Day 07"}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeDayTab"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-teal-500 dark:bg-teal-400 rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Meals Structure for the Selected Day */}
      <motion.div
        key={selectedDayId}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-4"
      >
        {currentDayPlan.meals.map((meal) => {
          let mealCals = 0;
          let mealProtein = 0;
          let mealCarbs = 0;
          let mealFat = 0;

          meal.items.forEach(({ food, quantity }) => {
            mealCals += (food.calories || 0) * (quantity || 1);
            mealProtein += (food.macros?.protein || 0) * (quantity || 1);
            mealCarbs += (food.macros?.carbs || 0) * (quantity || 1);
            mealFat += (food.macros?.fat || 0) * (quantity || 1);
          });

          return (
            <div
              key={meal.id}
              className="p-6 rounded-3xl bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#222222] shadow-xs hover:border-teal-500/40 dark:hover:border-[#2e2e2e] transition-all space-y-4"
            >
              {/* Meal Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-[#222222]">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-[#1a1a1a] border border-teal-200/60 dark:border-white/5 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-sm">
                    {meal.type.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">
                        {meal.type}
                      </h4>
                      <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-[#888888] font-mono">
                        <Clock className="w-3 h-3 text-teal-500" /> {meal.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-[#888888] italic">
                      {meal.title}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-bold text-sm text-slate-900 dark:text-white font-mono flex items-center justify-end gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      {Math.round(mealCals)} <span className="text-xs font-normal text-slate-400 dark:text-[#666666]">KCAL</span>
                    </span>
                    <div className="text-[10px] text-slate-500 dark:text-[#888888] font-mono">
                      P: {Math.round(mealProtein)}g | C: {Math.round(mealCarbs)}g | F: {Math.round(mealFat)}g
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setAddFoodTarget({
                        mealType: meal.type,
                        isOpen: true,
                      })
                    }
                    className="px-3.5 py-1.5 bg-slate-100 dark:bg-[#1a1a1a] hover:bg-slate-200 dark:hover:bg-[#222222] border border-slate-200 dark:border-[#333333] text-teal-700 dark:text-teal-400 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Food
                  </button>
                </div>
              </div>

              {/* Meal Food Items List */}
              <div className="space-y-2.5">
                {meal.items.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-[#222222] rounded-2xl text-xs text-slate-400 dark:text-[#666666]">
                    No items in this meal yet. Click "+ Add Food" to search the database.
                  </div>
                ) : (
                  meal.items.map(({ food, quantity }, idx) => {
                    if (!food) return null;
                    const itemCals = Math.round((food.calories || 0) * (quantity || 1));
                    const itemProt = Math.round((food.macros?.protein || 0) * (quantity || 1));
                    const itemCarb = Math.round((food.macros?.carbs || 0) * (quantity || 1));
                    const itemFat = Math.round((food.macros?.fat || 0) * (quantity || 1));

                    return (
                      <div
                        key={`${food.id || idx}-${idx}`}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200/70 dark:border-white/5 flex items-center justify-between hover:border-teal-500/50 dark:hover:border-teal-900/40 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          {food.imageUrl && (
                            <img
                              src={food.imageUrl}
                              alt={food.name || "Food"}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-[#222222]"
                            />
                          )}
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                              {food.name || "Food item"}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-[#888888] flex items-center gap-2 mt-0.5 font-mono">
                              <span>
                                {quantity > 1 ? `${quantity}x ` : ""}
                                {food.portion || "1 serving"}
                              </span>
                              <span className="text-slate-300 dark:text-[#444444]">•</span>
                              <span className="text-blue-600 dark:text-blue-400">P: {itemProt}g</span>
                              <span className="text-orange-600 dark:text-orange-400">C: {itemCarb}g</span>
                              <span className="text-purple-600 dark:text-purple-400">F: {itemFat}g</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm font-mono text-slate-900 dark:text-white mr-2">
                            {itemCals} <span className="text-[10px] text-slate-400 dark:text-[#666666]">kcal</span>
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              setSwapTarget({
                                food,
                                quantity,
                                mealType: meal.type,
                                isOpen: true,
                              })
                            }
                            className="p-1.5 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-200 dark:hover:bg-[#222222] rounded-lg transition-colors cursor-pointer"
                            title="Find smart nutritional food swap"
                          >
                            <ArrowLeftRight className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveFood(meal.type, food.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200 dark:hover:bg-[#222222] rounded-lg transition-colors cursor-pointer"
                            title="Remove food"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {meal.notes && (
                <div className="text-[11px] text-slate-600 dark:text-[#999999] italic bg-slate-50 dark:bg-[#181818] p-3 rounded-xl border border-slate-200/80 dark:border-[#222222]">
                  Note: {meal.notes}
                </div>
              )}
            </div>
          );
        })}
      </motion.div>

      {/* Add Food Sliding Drawer */}
      <AddFoodDrawer
        isOpen={addFoodTarget.isOpen}
        onClose={() => setAddFoodTarget({ ...addFoodTarget, isOpen: false })}
        targetMealType={addFoodTarget.mealType}
        dayName={currentDayPlan.dayName}
        onAddFood={handleAddFood}
      />

      {/* Smart Food Swap Sliding Drawer */}
      <FoodSwapDrawer
        isOpen={swapTarget.isOpen}
        onClose={() => setSwapTarget({ ...swapTarget, isOpen: false })}
        targetFood={swapTarget.food}
        targetQuantity={swapTarget.quantity}
        onApplySwap={handleApplySwap}
      />

      {/* Nutrium AI Meal Plan Generator Modal */}
      <AIMealPlanModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        client={client}
        onApplyPlan={(newPlan) => onUpdateMealPlan(newPlan)}
      />

      {/* Automated Grocery Shopping List Modal */}
      <ShoppingListModal
        isOpen={isShoppingListOpen}
        onClose={() => setIsShoppingListOpen(false)}
        mealPlan={mealPlan}
      />
    </div>
  );
};
