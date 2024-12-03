export interface CalendarResponse {
  startDate: string;
  endDate: string;
  dateList: DateItem[];
}

export interface DateItem {
  date: string;
  calendarItemList: CalendarItem[];
}

export interface CalendarItem {
  targetTime: number;
  title: string;
  userTab: UserTab;
  openingTime: OpeningTime;
  corpOrderUser: CorpOrderUser | null;
  status: 'CLOSED' | 'AVAILABLE' | 'ORDER';
  reason: string;
}

export interface UserTab {
  corp: Corp;
  latitude: number | null;
  longitude: number | null;
  name: string;
  lastUsedTime: number;
  uniqueId: string;
}

export interface Corp {
  uniqueId: string;
  useCloset: boolean;
  name: string;
  namespace: string;
  priceVisible: boolean;
  showPrice: boolean;
  priceLimit: number;
  priceLimitInCent: number;
  acceptCashPaymentToMeican: boolean;
  alwaysOpen: boolean;
  addressList: unknown[];
  isAdmin: boolean;
}

export interface OpeningTime {
  uniqueId: string;
  name: string;
  openTime: string;
  closeTime: string;
  defaultAlarmTime: string;
  postboxOpenTime: string;
}

export interface CorpOrderUser {
  isLegacyPay: boolean;
  isShut: boolean;
  payStatus: string;
  monopolyPaymentVersion: string;
  restaurantItemList: RestaurantItem[];
  corp: CorpDetail;
  readyToDelete: boolean;
  actionRequiredLevel: string;
  corpOrderStatus: string;
  showPrice: boolean;
  unpaidUserToMeicanPrice: string;
  unpaidUserToMeicanPriceInCent: number;
  paidUserToMeicanPrice: string;
  paidUserToMeicanPriceInCent: number;
  timestamp: number;
  uniqueId: string;
}

export interface RestaurantItem {
  uniqueId: string;
  dishItemList: DishItem[];
}

export interface DishItem {
  dish: Dish;
  count: number;
}

export interface Dish {
  name: string;
  priceInCent: number;
  priceString: string;
  originalPriceInCent: number;
  isSection: boolean;
  actionRequiredLevel: string;
  actionRequiredReason: string;
  id: number;
}

export interface CorpDetail {
  openingTimeList: OpeningTime[];
  hasMealPointGroup: boolean;
  mealPointList: unknown[];
  alwaysOpen: boolean;
  useMultiCorpAddress: boolean;
  useCorpAddressRemark: boolean;
  useSpecialAccount: boolean;
  namespace: string;
  useCloset: boolean;
  name: string;
  remarkEnabled: boolean;
  includedPayments: string[];
  excludedPayments: string[];
}
