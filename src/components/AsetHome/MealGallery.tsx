import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChefHat,
  Search,
  Clock,
  Flame,
  X,
  Check,
  Sparkles,
  ArrowRight,
  Utensils,
  Leaf,
} from "lucide-react";

interface MealGalleryProps {
  onOpenAuth: (mode?: "login" | "signup") => void;
}

export function MealGallery({ onOpenAuth }: MealGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);

  const galleryItems = [
    {
      id: "gal-1",
      title: "Mediterranean Wild Salmon & Quinoa Bowl",
      category: "High Protein",
      calories: 520,
      protein: 42,
      carbs: 38,
      fat: 18,
      prepTime: "20 min",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80",
      description: "Pan-seared wild Atlantic salmon served over organic tri-color quinoa, baby spinach, kalamata olives, and cold-pressed extra virgin olive oil.",
      ingredients: ["Wild Atlantic salmon fillet (180g)", "Cooked tri-color quinoa (1 cup)", "Baby spinach (2 cups)", "Kalamata olives (6-8)", "Lemon-dill vinaigrette (1 tbsp)"],
      benefits: "Rich in EPA/DHA omega-3 fatty acids for anti-inflammatory cardiovascular protection.",
    },
    {
      id: "gal-2",
      title: "Avocado & Poached Farm Egg Sourdough",
      category: "Breakfast",
      calories: 390,
      protein: 19,
      carbs: 34,
      fat: 16,
      prepTime: "12 min",
      image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=700&q=80",
      description: "Artisanal fermented sourdough toast topped with mashed Hass avocado, poached organic eggs, chili flakes, and hemp hearts.",
      ingredients: ["Artisanal sourdough slice (1 thick)", "Hass avocado (1/2)", "Organic eggs (2)", "Microgreens", "Hemp hearts (1 tsp)"],
      benefits: "High monounsaturated fat matrix stabilizing morning insulin and prolonged satiety.",
    },
    {
      id: "gal-3",
      title: "Roasted Cauliflower & Crispy Chickpea Bowl",
      category: "Plant-Based",
      calories: 440,
      protein: 21,
      carbs: 52,
      fat: 14,
      prepTime: "25 min",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80",
      description: "Turmeric spiced oven-roasted cauliflower florets, spiced chickpeas, pickled red onions, tahini drizzle, and pomegranate seeds.",
      ingredients: ["Cauliflower florets (200g)", "Spiced chickpeas (1 cup)", "Pickled red onions (2 tbsp)", "Tahini-sesame dressing (2 tbsp)", "Pomegranate seeds (1 tbsp)"],
      benefits: "Loaded with prebiotic inulin fiber and curcumin for optimal gut microbiome diversity.",
    },
    {
      id: "gal-4",
      title: "Superfood Acai & Dragonfruit Antioxidant Bowl",
      category: "Breakfast",
      calories: 360,
      protein: 12,
      carbs: 64,
      fat: 8,
      prepTime: "10 min",
      image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=700&q=80",
      description: "Organic blended pure acai berries topped with sliced banana, blueberries, raw cacao nibs, and coconut chia flakes.",
      ingredients: ["Unsweetened acai puree (1 packet)", "Frozen banana (1)", "Fresh blueberries (1/2 cup)", "Raw cacao nibs (1 tbsp)", "Unsweetened almond milk (1/2 cup)"],
      benefits: "Potent polyphenol and anthocyanin payload supporting cellular longevity.",
    },
    {
      id: "gal-5",
      title: "Grilled Herb Chicken Breast & Asparagus",
      category: "High Protein",
      calories: 410,
      protein: 48,
      carbs: 14,
      fat: 12,
      prepTime: "18 min",
      image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=700&q=80",
      description: "Free-range rosemary chicken breast with char-grilled asparagus spears, roasted cherry tomatoes, and garlic emulsion.",
      ingredients: ["Chicken breast (200g)", "Fresh asparagus (10 spears)", "Cherry tomatoes (1 cup)", "Extra virgin olive oil (1 tsp)", "Fresh rosemary & garlic"],
      benefits: "Lean complete essential amino acid profile maximizing muscle protein synthesis.",
    },
    {
      id: "gal-6",
      title: "Keto Grass-Fed Steak & Broccolini",
      category: "Keto",
      calories: 560,
      protein: 44,
      carbs: 8,
      fat: 38,
      prepTime: "15 min",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80",
      description: "Grass-fed ribeye medallions seared in grass-fed ghee with tender charred broccolini and black truffle salt.",
      ingredients: ["Grass-fed beef steak (180g)", "Broccolini (150g)", "Grass-fed ghee (1 tbsp)", "Sea salt & cracked black pepper"],
      benefits: "Zero net sugar impact with bioavailable heme iron and zinc.",
    },
  ];

  const categories = ["All", "High Protein", "Breakfast", "Plant-Based", "Keto"];

  const filteredItems = galleryItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-3 sm:p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Dietitian Formulated Meal Library
          </span>
          <p className="text-[11px] text-slate-500 dark:text-[#888888]">
            Explore macro-balanced dishes with verified calorie targets.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recipes, foods..."
            className="w-full pl-8.5 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#262626] bg-white dark:bg-[#181818] text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-teal-600 text-white shadow-xs"
                : "bg-white dark:bg-[#181818] text-slate-600 dark:text-[#888888] border border-slate-200 dark:border-[#262626] hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredItems.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              className="group rounded-3xl bg-slate-50 dark:bg-[#141414] border border-slate-200/80 dark:border-[#222222] overflow-hidden shadow-xs hover:border-teal-500/50 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-200 dark:bg-[#1a1a1a]">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs text-teal-300 px-3 py-1 rounded-xl text-xs font-semibold">
                    {recipe.category}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-[#141414]/90 backdrop-blur-xs text-slate-900 dark:text-white px-3 py-1 rounded-xl text-xs font-bold font-mono flex items-center gap-1 shadow-sm">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    {recipe.calories} kcal
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {recipe.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#888888] line-clamp-2 leading-relaxed">
                    {recipe.description}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-200/60 dark:border-[#222222] flex items-center justify-between text-xs text-slate-500 dark:text-[#888888] font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-teal-500" />
                    {recipe.prepTime}
                  </span>
                  <span className="font-bold text-blue-500">
                    P: {recipe.protein}g
                  </span>
                  <span className="font-bold text-teal-500">
                    C: {recipe.carbs}g
                  </span>
                  <span className="font-bold text-amber-500">
                    F: {recipe.fat}g
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Recipe Detail */}
        <AnimatePresence>
          {selectedRecipe && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedRecipe(null)}
                className="absolute inset-0 bg-black/70 backdrop-blur-xs"
              />

              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative z-10 max-w-xl w-full bg-white dark:bg-[#141414] rounded-3xl border border-slate-200 dark:border-[#2a2a2a] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              >
                <div className="relative aspect-16/9 w-full">
                  <img
                    src={selectedRecipe.image}
                    alt={selectedRecipe.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setSelectedRecipe(null)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-xs text-teal-300 px-3 py-1 rounded-xl text-xs font-bold">
                    {selectedRecipe.category}
                  </div>
                </div>

                <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {selectedRecipe.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-[#888888] mt-1">
                      {selectedRecipe.description}
                    </p>
                  </div>

                  {/* Macro Banner */}
                  <div className="grid grid-cols-4 gap-2 text-center p-3 rounded-2xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#262626]">
                    <div>
                      <div className="text-[10px] text-slate-400">Calories</div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                        {selectedRecipe.calories} kcal
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-blue-400">Protein</div>
                      <div className="text-xs font-bold text-blue-500 font-mono">
                        {selectedRecipe.protein}g
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-teal-400">Carbs</div>
                      <div className="text-xs font-bold text-teal-500 font-mono">
                        {selectedRecipe.carbs}g
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-amber-400">Fats</div>
                      <div className="text-xs font-bold text-amber-500 font-mono">
                        {selectedRecipe.fat}g
                      </div>
                    </div>
                  </div>

                  {/* Ingredients */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Ingredients
                    </h4>
                    <div className="space-y-1.5">
                      {selectedRecipe.ingredients.map((ing: string, i: number) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300"
                        >
                          <Check className="w-3.5 h-3.5 text-teal-500" />
                          <span>{ing}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Clinical Benefits */}
                  <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs text-teal-900 dark:text-teal-200 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Clinical Nutrition Benefit: </span>
                      {selectedRecipe.benefits}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRecipe(null);
                      onOpenAuth("signup");
                    }}
                    className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Add to My ASET Daily Plan</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
    </div>
  );
}
