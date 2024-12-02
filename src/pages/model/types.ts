export type Tab = {
  readonly id: string;
  readonly dishes: Dish[];
  readonly orderedDish?: Dish;
  readonly status: string;
};
export type Dish = {
  readonly id: string;
  readonly chineseName: string;
  readonly englishName: string;
  readonly restaurant: Restaurant;
};
export type Restaurant = {
  readonly id: string;
  readonly name: string;
};

export type Order = {
  readonly id: string;
  readonly time: string;
  readonly tab: Omit<Tab, "dishes">;
};
