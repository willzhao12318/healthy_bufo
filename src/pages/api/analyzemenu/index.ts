import OpenAiClient from "@/client/openaiClient";
import {NextApiRequest, NextApiResponse} from "next";
import {HttpMethods} from "@/utils/type";
import {HttpStatusCode} from "axios";

export type AnalyzeMenuItem = {
    name: string;
    protein: number;
    fat: number;
    carbohydrate: number;
    healthIndex: number;
    healthAnalysis: string;
    calories: number;
};

const menuAnalyzePrompt = "You are now a nutrition expert. I will give you some recipes, including breakfast and" +
    " lunch for several days a week. The days are not fixed. Please help me analyze this recipe. The analysis includes " +
    "the recipe name, protein content, fat content, carbohydrate content, health index, health analysis, and calories " +
    "of each meal. The health index is a full score of 100 points. Please score based on a full score of 100. The health" +
    " analysis is the health analysis result you get based on the recipe composition, and gives " +
    "healthy suggestions. The output recipe name needs to contain an emoji pattern representing this recipe at the " +
    "beginning. I hope you can use humorous language in the analysis process to give users higher clarity value." +
    "It would be better if you can randomly add some emoticons to the generated content" +
    "Please format and output a json, the json format is as follows:\n" +
    "```{\"meals\":[\"name\": \"emoji食谱名称\", \"protein\": 0, \"fat\": 0, \"carbohydrate\": 0, \"healthIndex\": 0, \"healthAnalysis\": \"健康分析\", \"calories\": 0]}```";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ analyzeResult: AnalyzeMenuItem[] }>
) {
    if (req.method === HttpMethods.POST) {
        const analyzeResult = await analyze(req.body.userInput);
        res.json({
            analyzeResult: analyzeResult
        });
        return;
    } else {
        res.setHeader('Allow', [HttpMethods.POST]);
        res.status(HttpStatusCode.MethodNotAllowed);
    }
}

async function analyze(menuMessage: string) {
    console.log("analyzing");
    const completion = await OpenAiClient.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: menuAnalyzePrompt,
            },
            {role: "user", content: menuMessage},
        ],
        response_format: {type: "json_object"}
    });
    const event = JSON.parse(completion.choices[0].message.content!);
    if(!event.meals) {
        return [];
    }
    return event.meals as AnalyzeMenuItem[];
}