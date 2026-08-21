import React, { useState } from "react";
import confetti from "canvas-confetti";
import { motion } from "motion/react";
import { MealPlan, FoodItem, MealType, ClientProfile } from "../../types/nutrition";
import { FoodSwapDrawer } from "../FoodSwapDrawer";
import { SlidingDrawer } from "../SlidingDrawer";
import {
  CheckCircle2,
  Clock,
  Flame,
  ArrowLeftRight,
  Camera,
  Check,
  Award,
  Sparkles,
  Info,
} from "lucide-react";

interface DailyMealTimelineProps {
  mealPlan: MealPlan;
  client: ClientProfile;
  onLogMealPhoto: (mealType: MealType, photoUrl: string, notes: string) => void;
}

export const DailyMealTimeline: React.FC<DailyMealTimelineProps> = ({
  mealPlan,
  client,
  onLogMealPhoto,
}) => {
  const [selectedDayId, setSelectedDayId] = useState("monday");
  const [eatenMeals, setEatenMeals] = useState<Record<string, boolean>>({
    "monday-Breakfast": true,
    "monday-Morning Snack": true,
  });

  // Food swap drawer target
  const [swapTarget, setSwapTarget] = useState<{
    food: FoodItem | null;
    quantity: number;
    mealType: MealType;
    isOpen: boolean;
  }>({ food: null, quantity: 1, mealType: "Breakfast", isOpen: false });

  // Photo Log Modal
  const [photoLogTarget, setPhotoLogTarget] = useState<{
    mealType: MealType | null;
    isOpen: boolean;
  }>({ mealType: null, isOpen: false });
  const [photoUrl, setPhotoUrl] = useState(
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80"
  );
  const [mealNotes, setMealNotes] = useState("");

  const days = [
    { id: "monday", label: "Mon" },
    { id: "tuesday", label: "Tue" },
    { id: "wednesday", label: "Wed" },
    { id: "thursday", label: "Thu" },
    { id: "friday", label: "Fri" },
    { id: "saturday", label: "Sat" },
    { id: "sunday", label: "Sun" },
  ];

  const currentDay =
    mealPlan.days.find((d) => d.dayId === selectedDayId) || mealPlan.days[0];

  const toggleEaten = (mealType: MealType) => {
    const key = `${selectedDayId}-${mealType}`;
    const newState = !eatenMeals[key];
    const updated = { ...eatenMeals, [key]: newState };
    setEatenMeals(updated);

    // Check if all meals for the day are eaten
    const allEaten = currentDay.meals.every((m) =>
      m.type === mealType ? newState : updated[`${selectedDayId}-${m.type}`]
    );

    if (allEaten && newState) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10b981", "#3b82f6", "#f59e0b"],
      });
    }
  };

  const handleSavePhotoLog = () => {
    if (photoLogTarget.mealType) {
      onLogMealPhoto(photoLogTarget.mealType, photoUrl, mealNotes);
      setPhotoLogTarget({ mealType: null, isOpen: false });
      setMealNotes("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Day Selector Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto p-1.5 bg-[#141414] border border-[#222222] rounded-2xl custom-scrollbar">
        {days.map((day) => {
          const isActive = selectedDayId === day.id;
          return (
            <button
              key={day.id}
              type="button"
              onClick={() => setSelectedDayId(day.id)}
              className={`flex-1 min-w-[70px] py-2.5 px-3 rounded-xl text-xs font-semibold transition-all relative flex flex-col items-center gap-0.5 cursor-pointer ${
                isActive
                  ? "bg-[#1a1a1a] text-teal-400 border border-teal-900/50 shadow-xs"
                  : "text-[#888888] hover:text-white"
              }`}
            >
              <span>{day.label}</span>
              <span className="text-[10px] font-normal opacity-70">
                {day.id === "monday" ? "Day 1" : day.id === "tuesday" ? "Day 2" : day.id === "wednesday" ? "Day 3" : day.id === "thursday" ? "Day 4" : day.id === "friday" ? "Day 5" : day.id === "saturday" ? "Day 6" : "Day 7"}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activePatientDayTab"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-teal-400 rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Meals Timeline */}
      <motion.div
        key={selectedDayId}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-4"
      >
        {currentDay.meals.map((meal) => {
          const isDone = !!eatenMeals[`${selectedDayId}-${meal.type}`];

          let mealCals = 0;
          let mealProtein = 0;
          let mealCarbs = 0;
          let mealFat = 0;

          meal.items.forEach(({ food, quantity }) => {
            mealCals += food.calories * quantity;
            mealProtein += food.macros.protein * quantity;
            mealCarbs += food.macros.carbs * quantity;
            mealFat += food.macros.fat * quantity;
          });

          return (
            <div
              key={meal.id}
              className={`p-5 sm:p-6 rounded-3xl border transition-all space-y-4 ${
                isDone
                  ? "bg-[#141414] border-teal-500/60 shadow-lg shadow-teal-950/20 ring-1 ring-teal-500/20"
                  : "bg-[#141414] border-[#222222] shadow-xs hover:border-[#333333]"
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#222222]">
                <div className="flex items-center gap-3.5">
                  <button
                    type="button"
                    onClick={() => toggleEaten(meal.type)}
                    className={`w-7 h-7 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                      isDone
                        ? "bg-teal-500 border-teal-500 text-black shadow-md shadow-teal-950"
                        : "border-[#333333] hover:border-teal-500 bg-[#1a1a1a] text-transparent"
                    }`}
                    title="Mark meal as completed"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-white text-base">
                        {meal.type}
                      </h4>
                      <span className="text-xs text-[#666666] font-medium flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-teal-400" /> {meal.time}
                      </span>
                    </div>
                    <p className="text-xs text-[#888888]">{meal.title}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-bold text-sm text-white flex items-center justify-end gap-1 font-mono">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      {Math.round(mealCals)} kcal
                    </span>
                    <div className="text-[10px] text-[#888888] font-mono">
                      P: {Math.round(mealProtein)}g | C: {Math.round(mealCarbs)}g | F: {Math.round(mealFat)}g
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setPhotoLogTarget({
                        mealType: meal.type,
                        isOpen: true,
                      })
                    }
                    className="p-2 rounded-xl bg-[#1a1a1a] text-[#888888] hover:text-teal-400 hover:bg-[#222222] transition-colors cursor-pointer border border-white/5"
                    title="Upload photo of your meal"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Foods List */}
              <div className="space-y-2">
                {meal.items.map(({ food, quantity }, idx) => {
                  if (!food) return null;
                  return (
                    <div
                      key={food.id || idx}
                      className="p-3 rounded-2xl bg-[#1a1a1a] border border-white/5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {food.imageUrl && (
                          <img
                            src={food.imageUrl}
                            alt={food.name || "Food"}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10"
                          />
                        )}
                        <div>
                          <div className="text-xs font-semibold text-[#ededed]">
                            {food.name || "Food Item"}
                          </div>
                          <div className="text-[10px] text-[#888888] font-mono">
                            {quantity > 1 ? `${quantity}x ` : ""}
                            {food.portion || "1 serving"} ({Math.round((food.calories || 0) * (quantity || 1))} kcal)
                          </div>
                        </div>
                      </div>

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
                        className="px-2.5 py-1.5 rounded-lg border border-[#333333] text-[#888888] hover:text-teal-400 hover:border-teal-500/40 hover:bg-[#141414] text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowLeftRight className="w-3 h-3 text-teal-400" />
                        Swap
                      </button>
                    </div>
                  );
                })}
              </div>

              {meal.notes && (
                <div className="p-3 rounded-xl bg-[#111111] text-[11px] text-[#888888] italic border border-teal-900/30 flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                  <span>Dietitian Note: {meal.notes}</span>
                </div>
              )}
            </div>
          );
        })}
      </motion.div>

      {/* Food Swap Drawer */}
      <FoodSwapDrawer
        isOpen={swapTarget.isOpen}
        onClose={() => setSwapTarget({ ...swapTarget, isOpen: false })}
        targetFood={swapTarget.food}
        targetQuantity={swapTarget.quantity}
        onApplySwap={() => {}}
      />

      {/* Log Meal Photo Drawer */}
      <SlidingDrawer
        isOpen={photoLogTarget.isOpen}
        onClose={() => setPhotoLogTarget({ mealType: null, isOpen: false })}
        title={`Log Photo for ${photoLogTarget.mealType}`}
        subtitle="Share meal verification with your clinical dietitian"
        icon={<Camera className="w-5 h-5" />}
        width="md"
        footer={
          <button
            type="button"
            onClick={handleSavePhotoLog}
            id="submit-meal-photo-log-btn"
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-md shadow-teal-950 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            Submit Meal Log
          </button>
        }
      >
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden h-48 bg-[#111111] border border-[#222222] relative">
            <img
              src={photoUrl}
              alt="Meal confirmation"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2.5 py-1 rounded-lg text-[10px] font-mono border border-white/10">
              Sample Photo Ready
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#888888] mb-1">
              Meal Photo URL (or camera upload)
            </label>
            <input
              type="text"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#222222] bg-[#141414] text-xs text-[#ededed] focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#888888] mb-1">
              Personal Satiety Notes
            </label>
            <textarea
              rows={3}
              value={mealNotes}
              onChange={(e) => setMealNotes(e.target.value)}
              placeholder="e.g. Delicious and kept me full! Made a small portion tweak."
              className="w-full px-3.5 py-2 rounded-xl border border-[#222222] bg-[#141414] text-xs text-[#ededed] placeholder-[#666666] focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>
      </SlidingDrawer>
    </div>
  );
};
