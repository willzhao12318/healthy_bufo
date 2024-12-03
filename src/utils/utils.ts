import { OrderTab, TabType } from "@/utils/type";

export function compareTabType(a: OrderTab, b: OrderTab) {
  const tabTypeOrder = [TabType.Breakfast, TabType.Lunch, TabType.AfternoonTea];
  return tabTypeOrder.indexOf(a.type) - tabTypeOrder.indexOf(b.type);
}

export function getTabType(title: string): string {
  if (title.includes('早餐')) {
    return 'breakfast';
  } else if (title.includes('午餐')) {
    return 'lunch';
  } else if (title.includes('下午茶')) {
    return 'afternoonTea';
  }
  return '';
}

export function convertTimestampToDate(timestamp: number): string {
  // Create a Date object from the timestamp
  const beijingTime = new Date(timestamp+ (8 * 60 * 60 * 1000));
  return beijingTime.toISOString().slice(0, 19).replace('T', ' ');

}
