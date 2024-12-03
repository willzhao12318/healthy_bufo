export enum TabType {
  Breakfast = "breakfast",
  Lunch = "lunch",
  AfternoonTea = "afternoonTea",
}

export type Tab  = {
  readonly id: string;
  readonly dishes: Dish[];
  readonly orderedDish?: Dish;
  readonly status: string;
  readonly type: TabType;
}

export type Dish = {
  readonly id: string;
  readonly chineseName: string;
  readonly englishName: string;
  readonly restaurant: Restaurant;
}
export type Restaurant = {
  readonly id: string;
  readonly name: string;
}

export type OrderTab = Omit<Tab, "dishes">;

export type Order = {
  readonly id: string;
  readonly time: string;
  readonly tab: OrderTab;
}

// Define an enum for the categories
export enum Category {
  CategoryRequestMenuRecommendation = 1,
  CategoryRequestNutritionAnalyze,
  CategoryUnrelated,
  CategoryMaliciousInput,
}

export enum HttpMethods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

type context = {
  readonly cookies: string;
}

export type AddOrderResponse = {
  readonly status: number;
}

export type AddOrderRequest = {
  readonly tabUid: string, 
  readonly targetTime: string, 
  readonly dishId: string,
  readonly context?: context
}

export type LoginRequest = {
  readonly username: string;
  readonly password: string;
}

export type LoginResponse = {
  readonly cookie: string;
}
