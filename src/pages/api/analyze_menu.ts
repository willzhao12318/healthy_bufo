import OpenAiClient from "../../client/openaiClient";

export type AnalyzeMenuItem = {
    name: string;
    protein: number;
    fat: number;
    carbohydrate: number;
    healthIndex: number;
    healthAnalysis: string;
    calories: number;
};

export async function analyze(menuMessage: string) {
    console.log("analyzing");
    const completion = await OpenAiClient.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: "你现在是一个营养专家，我会给你一个一天的食谱，包含早餐和午饭。请你帮我分析这个食谱。分析中包含每一餐的食谱名称，蛋白质含量，脂肪含量，碳水" +
                    "含量，健康指数，健康分析，卡路里。健康指数满分100分，请基于满分100分打分。健康分析是你根据食谱组成得到的健康分析结果， 并给出" +
                    "健康建议。输出的食谱名称中需要在最前面包含一个代表这个食谱的emoji图案。请格式化输出一个json, json格式如下：\n" +
                    "```{\"meals\":[\"name\": \"emoji食谱名称\", \"protein\": 0, \"fat\": 0, \"carbohydrate\": 0, \"healthIndex\": 0, \"healthAnalysis\": \"健康分析\", \"calories\": 0]}```",

            },
            {role: "user", content: menuMessage},
        ],
        response_format: {type: "json_object"}
    });
    const event = JSON.parse(completion.choices[0].message.content!);
    return event;
}