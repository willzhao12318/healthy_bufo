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
