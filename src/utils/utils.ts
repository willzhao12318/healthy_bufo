import { OrderTab, TabType } from "@/utils/type";

export function compareTabType(a: OrderTab, b: OrderTab) {
  const tabTypeOrder = [TabType.Breakfast, TabType.Lunch, TabType.AfternoonTea];
  return tabTypeOrder.indexOf(a.type) - tabTypeOrder.indexOf(b.type);
}
