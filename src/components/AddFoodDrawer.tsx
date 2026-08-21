import React, { useState } from "react";
import { SlidingDrawer } from "./SlidingDrawer";
import { FoodItem, MealType } from "../types/nutrition";
import { FOOD_DATABASE } from "../data/initialData";
import { Search, Plus, Flame, Sparkles, Filter, Check } from "lucide-react";

interface AddFoodDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  targetMealType: MealType;
  dayName: string;
  onAddFood: (food: FoodItem, quantity: number) => void;
}

export const AddFoodDrawer: React.FC<AddFoodDrawerProps> = ({
  isOpen,
  onClose,
  targetMealType,
  dayName,
  onAddFood,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const categories = [
    "All",
    "Proteins",
    "Carbohydrates",
    "Vegetables",
    "Fruits",
    "Dairy & Alt",
    "Fats & Oils",
    "Snacks & Nuts",
  ];

  const filteredFoods = FOOD_DATABASE.filter((food) => {
    const matchesCategory = selectedCategory === "All" || food.category === selectedCategory;
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.dietaryTags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    setQuantity(1);
  };

  const handleConfirmAdd = () => {
    if (selectedFood) {
      onAddFood(selectedFood, quantity);
      onClose();
      setSelectedFood(null);
    }
  };

  return (
    <SlidingDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Add Food to ${targetMealType}`}
      subtitle={`${dayName} • Search ASET Certified Food Database`}
      icon={<Plus className="w-5 h-5" />}
      width="lg"
      footer={
        selectedFood ? (
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-white">
                {selectedFood.name}
              </div>
              <div className="text-[11px] text-[#888888] font-mono">
                {Math.round(selectedFood.calories * quantity)} kcal (P:{" "}
                {Math.round(selectedFood.macros.protein * quantity)}g | C:{" "}
                {Math.round(selectedFood.macros.carbs * quantity)}g | F:{" "}
                {Math.round(selectedFood.macros.fat * quantity)}g)
              </div>
            </div>
            <button
              type="button"
              onClick={handleConfirmAdd}
              id="confirm-add-food-btn"
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-teal-950 flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Add to {targetMealType}
            </button>
          </div>
        ) : null
      }
    >
      <div className="space-y-5">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666666]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chicken breast, quinoa, avocado, oats, spinach..."
            id="food-search-input"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#222222] bg-[#141414] text-[#ededed] placeholder-[#666666] text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors"
          />
        </div>

        {/* Sliding Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#1a1a1a] text-teal-400 border border-teal-900/40 shadow-xs"
                  : "bg-[#141414] text-[#888888] border border-[#222222] hover:text-[#ededed]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Selected Food Portion Slider */}
        {selectedFood && (
          <div className="p-4 rounded-2xl bg-[#141414] border border-teal-900/40 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-teal-400">
                  Selected Item
                </span>
                <h5 className="font-semibold text-white text-sm">
                  {selectedFood.name}
                </h5>
                <p className="text-xs text-[#888888]">
                  Base Portion: {selectedFood.portion}
                </p>
              </div>
              <div className="text-right">
                <span className="font-bold text-base text-teal-400 font-mono">
                  {Math.round(selectedFood.calories * quantity)} kcal
                </span>
              </div>
            </div>

            {/* Sliding Quantity Multiplier */}
            <div>
              <div className="flex justify-between text-xs text-[#888888] mb-1.5">
                <span>Serving Multiplier:</span>
                <span className="font-semibold text-teal-400 font-mono">{quantity.toFixed(2)}x ({Math.round(selectedFood.portionGrams * quantity)}g)</span>
              </div>
              <input
                type="range"
                min="0.25"
                max="4.0"
                step="0.25"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full h-2 bg-[#222222] rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
              <div className="flex justify-between text-[10px] text-[#666666] font-mono mt-1">
                <span>0.25x (light)</span>
                <span>1.0x (standard)</span>
                <span>2.0x (double)</span>
                <span>4.0x (bulk)</span>
              </div>
            </div>
          </div>
        )}

        {/* Foods Grid */}
        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
          {filteredFoods.length === 0 ? (
            <div className="text-center py-8 text-[#666666] text-sm">
              No matching foods found. Try adjusting your search.
            </div>
          ) : (
            filteredFoods.map((food) => {
              const isSelected = selectedFood?.id === food.id;
              return (
                <div
                  key={food.id}
                  onClick={() => handleSelectFood(food)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "border-teal-500 bg-[#161d1b] shadow-xs"
                      : "border-[#222222] bg-[#141414] hover:border-[#333333]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {food.imageUrl && (
                      <img
                        src={food.imageUrl}
                        alt={food.name}
                        referrerPolicy="no-referrer"
                        className="w-11 h-11 rounded-xl object-cover border border-[#222222]"
                      />
                    )}
                    <div>
                      <h6 className="font-medium text-white text-xs sm:text-sm">
                        {food.name}
                      </h6>
                      <p className="text-[11px] text-[#888888]">
                        {food.portion} • {food.category}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1 font-mono">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1a1a1a] text-blue-400 border border-white/5 font-medium">
                          P: {food.macros.protein}g
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1a1a1a] text-orange-400 border border-white/5 font-medium">
                          C: {food.macros.carbs}g
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1a1a1a] text-purple-400 border border-white/5 font-medium">
                          F: {food.macros.fat}g
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <span className="font-bold text-xs sm:text-sm text-white font-mono flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-500" />
                      {food.calories} kcal
                    </span>
                    <button
                      type="button"
                      className={`mt-1.5 p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-teal-500 text-black font-bold"
                          : "bg-[#1a1a1a] text-[#888888] hover:text-teal-400"
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </SlidingDrawer>
  );
};
