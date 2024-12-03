export enum TabType {
  Breakfast = "breakfast",
  Lunch = "lunch",
  AfternoonTea = "afternoonTea",
}

export enum WeekDay {
  Monday = "monday",
  Tuesday = "tuesday",
  Wednesday = "wednesday",
  Thursday = "thursday",
  Friday = "friday",
  Saturday = "saturday",
  Sunday = "sunday",
}

export type Tab = {
  readonly id: string;
  readonly dishes: Dish[];
  readonly orderedDish?: Dish;
  readonly status: string;
  readonly type: TabType;
};

export type Dish = {
  readonly id?: string;
  readonly chineseName: string;
  readonly englishName: string;
  readonly restaurant: Restaurant;
};
export type Restaurant = {
  readonly id: string;
  readonly name: string;
};

export type OrderTab = Omit<Tab, "dishes">;

export type Order = {
  readonly time: string;
  readonly tab: OrderTab;
};

// Define an enum for the categories
export enum Category {
  CategoryRequestMenuRecommendation = 1,
  CategoryRequestNutritionAnalyze,
  CategoryUnrelated,
  CategoryMaliciousInput,
  CategoryRequestOrder
}

export type Recommendation = {
  recommendationsPerDay: RecommendationPerDay[];
};

export type RecommendationPerDay = {
  workDay: WeekDay;
  recommendations: MenuOptions[];
};

export type MenuOptions = {
  restaurant: Restaurant;
  dish: Dish;
  tabType: TabType;
};

export enum HttpMethods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export type RecommendInput = {
  userInput: string;
  mealPlan: MealPlan;
};

export type RecommendResult = {
  breakfast: MealInfo[];
  lunch: MealInfo[];
  afternoonTea: MealInfo[];
};

export type MealInfo = {
  weekDay: WeekDay;
  restaurantName: string;
  restaurantId: string;
  dishName: string;
  dishId: string;
  emoji: string;
};

export type DayMealPlan = {
  weekDay: WeekDay;
  breakfast: Dish[];
  lunch: Dish[];
  afternoonTea?: Dish[];
};

export type PreviousRecommendationDish = Dish & {
  weekDay: WeekDay;
};

export type PreviousRecommendations = {
  breakfast: PreviousRecommendationDish[];
  lunch: PreviousRecommendationDish[];
  afternoonTea: PreviousRecommendationDish[];
};

export type MealPlan = {
  dateList: DayMealPlan[];
  previousRecommendation?: PreviousRecommendations;
};

type context = {
  readonly cookies: string;
};

export type AddOrderResponse = {
  readonly status: number;
};

export type AddOrderRequest = {
  readonly tabUid: string;
  readonly targetTime: string;
  readonly dishId: string;
  readonly context?: context;
};

export type LoginRequest = {
  readonly username: string;
  readonly password: string;
};

export type LoginResponse = {
  readonly cookie: string;
};

export type GetTabResponse = {
  readonly tab: Tab[]
};

export function splitDishName(fullName: string): { chineseName: string; englishName: string } {
  const match = fullName.match(/(.+?)\((.+?)\)/);
  if (match) {
    return {
      chineseName: match[1].trim(),
      englishName: match[2].trim()
    };
  }
  // 如果没有匹配到英文名，则整个字符串作为中文名
  return {
    chineseName: fullName.trim(),
    englishName: ''
  };
}
