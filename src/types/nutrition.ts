export type UserRole = "dietitian" | "patient";

export interface MacroNutrients {
  carbs: number; // in grams
  protein: number; // in grams
  fat: number; // in grams
  fiber?: number; // in grams
  sodium?: number; // in mg
}

export interface MacroPercentages {
  carbsPercent: number;
  proteinPercent: number;
  fatPercent: number;
}

export interface FoodItem {
  id: string;
  name: string;
  category: "Proteins" | "Carbohydrates" | "Fats & Oils" | "Vegetables" | "Fruits" | "Dairy & Alt" | "Snacks & Nuts" | "Beverages";
  portion: string; // e.g. "100g", "1 medium", "1 cup (240ml)"
  portionGrams: number;
  calories: number;
  macros: MacroNutrients;
  allergens?: string[];
  imageUrl?: string;
  dietaryTags?: string[]; // e.g. "Gluten-Free", "Vegan", "High-Protein", "Low-FODMAP"
}

export type MealType = "Breakfast" | "Morning Snack" | "Lunch" | "Afternoon Snack" | "Dinner" | "Evening Snack";

export interface PlannedMeal {
  id: string;
  type: MealType;
  time: string; // e.g. "08:30"
  title: string;
  notes?: string;
  items: Array<{
    food: FoodItem;
    quantity: number; // multiplier of portion
  }>;
}

export interface DayMealPlan {
  dayId: string; // "monday", "tuesday", etc.
  dayName: string; // "Monday", "Tuesday", etc.
  meals: PlannedMeal[];
}

export interface MealPlan {
  id: string;
  clientId: string;
  name: string;
  startDate: string;
  targetCalories: number;
  targetMacros: MacroPercentages;
  notes: string;
  days: DayMealPlan[];
}

export interface AnthropometricRecord {
  id: string;
  date: string;
  weight: number; // in kg
  bodyFatPercentage?: number; // %
  muscleMassKg?: number; // kg
  waistCircumferenceCm?: number; // cm
  hipCircumferenceCm?: number; // cm
  bmi: number;
  bmr?: number; // kcal
  tdee?: number; // kcal
  notes?: string;
}

export interface FoodDiaryItem {
  id: string;
  clientId?: string;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  timeLogged: string;
  foodDescription: string;
  caloriesEstimate: number;
  macros: MacroNutrients;
  completed?: boolean;
  photoUrl?: string;
  hungerLevel?: number; // 1-5
  satisfactionLevel?: number; // 1-5
  clientNotes?: string;
  dietitianFeedback?: string;
  dietitianLiked?: boolean;
}

export interface WaterLogEntry {
  id: string;
  time: string;
  amountMl: number;
}

export interface DailyWaterLog {
  date: string; // YYYY-MM-DD
  targetMl: number;
  currentMl: number;
  entries: WaterLogEntry[];
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  date: string;
  time: string;
  durationMinutes: number;
  type: "Initial Assessment" | "Follow-up Check" | "Meal Plan Review" | "Body Composition" | "Online Video Consult";
  status: "Scheduled" | "Completed" | "Cancelled" | "In-Progress";
  notes?: string;
  videoLink?: string;
}

export interface Recipe {
  id: string;
  title: string;
  subtitle: string;
  category: "Breakfast" | "Lunch & Dinner" | "Snacks" | "Smoothies & Shakes" | "Desserts";
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  calories: number;
  macros: MacroNutrients;
  ingredients: Array<{
    name: string;
    amount: string;
    foodCategory?: string;
  }>;
  instructions: string[];
  dietaryTags: string[];
  imageUrl: string;
  authorDietitian: string;
}

export interface ClientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  age: number;
  gender: "Female" | "Male" | "Other";
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number;
  initialWeightKg: number;
  activityLevel: "Sedentary" | "Lightly Active" | "Moderately Active" | "Very Active" | "Extra Active";
  primaryGoal: "Weight Loss" | "Muscle Hypertrophy" | "PCOS Management" | "Athletic Performance" | "Heart Health" | "General Longevity";
  allergies: string[];
  foodDislikes: string[];
  medicalConditions: string[];
  dietaryPattern: "Omnivore" | "Mediterranean" | "Vegetarian" | "Vegan" | "Pescatarian" | "Low Carb / Keto" | "Gluten-Free";
  adherenceRate: number; // 0-100%
  streakDays: number;
  joinDate: string;
  nextAppointmentDate?: string;
  activeMealPlanId: string;
  records: AnthropometricRecord[];
  waterTargetMl: number;
}

export interface NotificationItem {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  type: "meal" | "water" | "appointment" | "message" | "achievement";
  read: boolean;
}
