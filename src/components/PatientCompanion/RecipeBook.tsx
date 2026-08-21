import React, { useState } from "react";
import { Recipe } from "../../types/nutrition";
import { SlidingDrawer } from "../SlidingDrawer";
import {
  BookOpen,
  Clock,
  Flame,
  Users,
  Check,
  ChefHat,
  Search,
  Sparkles,
  Play,
  Heart,
} from "lucide-react";

interface RecipeBookProps {
  recipes: Recipe[];
}

export const RecipeBook: React.FC<RecipeBookProps> = ({ recipes }) => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isCookingMode, setIsCookingMode] = useState(false);

  const categories = ["All", "Breakfast", "Lunch", "Dinner", "Snacks", "Smoothies"];

  const filtered = recipes.filter((r) => {
    const matchesCat = selectedCategory === "All" || r.category === selectedCategory;
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.ingredients.some((i) => i.item.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const toggleIngredient = (idx: number) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [`${activeRecipe?.id}-${idx}`]: !prev[`${activeRecipe?.id}-${idx}`],
    }));
  };

  const handleOpenRecipe = (recipe: Recipe) => {
    setActiveRecipe(recipe);
    setCurrentStepIndex(0);
    setIsCookingMode(false);
  };

  return (
    <div className="space-y-6">
      {/* Search and Category Filter Pills */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666666]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dietitian recipes, ingredients, bowls..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#222222] bg-[#141414] text-[#ededed] placeholder-[#666666] text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-teal-600 text-white shadow-md shadow-teal-950"
                  : "bg-[#141414] border border-[#222222] text-[#888888] hover:text-white hover:border-[#333333]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Recipes Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => handleOpenRecipe(recipe)}
            className="group rounded-3xl bg-[#141414] border border-[#222222] overflow-hidden shadow-xs hover:border-[#333333] transition-all cursor-pointer flex flex-col"
          >
            <div className="relative h-44 w-full bg-[#111111] overflow-hidden">
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-teal-300 border border-white/10 px-2.5 py-1 rounded-xl text-xs font-semibold">
                {recipe.category}
              </div>
              <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white border border-white/10 px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 font-mono">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                {recipe.calories} kcal
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h4 className="font-semibold text-white text-base group-hover:text-teal-400 transition-colors">
                  {recipe.title}
                </h4>
                <p className="text-xs text-[#888888] line-clamp-2 mt-1">
                  {recipe.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#222222] flex items-center justify-between text-xs text-[#888888] font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-teal-400" />
                  {recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-teal-400" />
                  {recipe.servings} serving{recipe.servings > 1 ? "s" : ""}
                </span>
                <span className="font-bold text-teal-400">
                  P: {recipe.macros.protein}g
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recipe Detail Slide-Over Drawer */}
      <SlidingDrawer
        isOpen={!!activeRecipe}
        onClose={() => setActiveRecipe(null)}
        title={activeRecipe?.title || "Prescribed Recipe"}
        subtitle={`${activeRecipe?.category} • ${activeRecipe?.servings} Servings`}
        icon={<ChefHat className="w-5 h-5" />}
        width="lg"
        footer={
          activeRecipe ? (
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsCookingMode(!isCookingMode)}
                className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-teal-950 flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                {isCookingMode ? "Exit Cooking Mode" : "Step-by-Step Cooking Mode"}
              </button>
            </div>
          ) : null
        }
      >
        {activeRecipe && (
          <div className="space-y-6">
            {/* Header Image & Macros */}
            <div className="relative h-56 rounded-3xl overflow-hidden border border-[#222222]">
              <img
                src={activeRecipe.imageUrl}
                alt={activeRecipe.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
                <span className="text-xs font-semibold text-teal-400 font-mono">
                  {activeRecipe.category}
                </span>
                <h3 className="text-lg font-bold">{activeRecipe.title}</h3>
              </div>
            </div>

            {/* Nutrition Breakdown Bar */}
            <div className="grid grid-cols-4 gap-2 text-center p-3 rounded-2xl bg-[#1a1a1a] border border-[#222222]">
              <div>
                <div className="text-[10px] text-[#888888]">Calories</div>
                <div className="text-xs font-bold text-white font-mono">
                  {activeRecipe.calories} kcal
                </div>
              </div>
              <div>
                <div className="text-[10px] text-blue-400">Protein</div>
                <div className="text-xs font-bold text-blue-400 font-mono">
                  {activeRecipe.macros.protein}g
                </div>
              </div>
              <div>
                <div className="text-[10px] text-amber-400">Carbs</div>
                <div className="text-xs font-bold text-amber-400 font-mono">
                  {activeRecipe.macros.carbs}g
                </div>
              </div>
              <div>
                <div className="text-[10px] text-rose-400">Fats</div>
                <div className="text-xs font-bold text-rose-400 font-mono">
                  {activeRecipe.macros.fat}g
                </div>
              </div>
            </div>

            {/* Ingredients Checklist */}
            <div className="space-y-3">
              <h5 className="font-semibold text-white text-sm">
                Ingredients Required
              </h5>
              <div className="space-y-1.5">
                {activeRecipe.ingredients.map((ing, idx) => {
                  const isChecked = !!checkedIngredients[`${activeRecipe.id}-${idx}`];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleIngredient(idx)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                        isChecked
                          ? "bg-[#111111] border-[#222222] text-[#666666] line-through"
                          : "bg-[#141414] border-[#222222] text-[#ededed] hover:border-[#333333]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                            isChecked
                              ? "bg-teal-500 border-teal-500 text-black"
                              : "border-[#333333]"
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-medium">{ing.item}</span>
                      </div>
                      <span className="text-xs text-[#888888] font-mono">
                        {ing.amount}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cooking Instructions */}
            <div className="space-y-3">
              <h5 className="font-semibold text-white text-sm">
                Preparation Steps
              </h5>
              <div className="space-y-2.5">
                {activeRecipe.instructions.map((step, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isCookingMode && currentStepIndex === idx
                        ? "bg-[#1a1a1a] border-teal-500/80 shadow-md ring-1 ring-teal-500/20"
                        : "bg-[#141414] border-[#222222]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-teal-950/60 border border-teal-800/40 text-teal-400 font-bold text-xs flex items-center justify-center shrink-0 font-mono">
                        {idx + 1}
                      </div>
                      <p className="text-xs text-[#ededed] leading-relaxed pt-0.5">
                        {step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </SlidingDrawer>
    </div>
  );
};
