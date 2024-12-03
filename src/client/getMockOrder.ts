import {humanAIMealPlan} from "../utils/mockData";
import {useGetOrder} from "./controller";

type MenuItem = {
    name: string;
}
// eslint-disable-next-line react-hooks/rules-of-hooks

export default function getMockOrder(locale: string) {
    return humanAIMealPlan.dateList.map((date) => {
        const randomBreakfast = date.breakfast[Math.floor(Math.random() * date.breakfast.length)];
        const randomLunch = date.lunch[Math.floor(Math.random() * date.lunch.length)];
        const randomSnack = date.afternoonTea !== undefined ? date.afternoonTea[Math.floor(Math.random() * date.afternoonTea.length)] : undefined;
        return {
            "date": date.weekDay,
            "breakfast": locale === "zh" ? randomBreakfast.chineseName : randomBreakfast.englishName,
            "lunch": locale === "zh" ? randomLunch.chineseName : randomLunch.englishName,
            "snack": randomSnack !== undefined ? locale === "zh" ? randomSnack.chineseName : randomSnack.englishName : ""
        }
    })
}