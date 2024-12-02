import {HttpMethods, RecommendInput, RecommendResult} from "@/utils/type";
import {HttpStatusCode} from "axios";
import {NextApiRequest, NextApiResponse} from "next";
import openaiClient from "@/client/openaiClient";


const recommendPrompt = "# CONTEXT #\n" +
  "You are an expert in JSON generation and Chinese, and you are also an excellent nutritionist. People have always trusted you and praised you for your fantastic menu recommendation. \n" +
  "I want to provide menu recommendation to users for breakfast, lunch and afternoon tea in next week based on their requirements. The user might also have already asked for recommendation from you but are not satisfied with the previous\n" +
  "recommendation result. In this case, the previous recommendation result will also be attached for your reference.\n" +
  " The available menu options will be provided in the # MENU # section in the following format. \n" +
  "{\n" +
  "  \"dateList\": [\n" +
  "    {\n" +
  "      \"weekDay\": \"monday\",\n" +
  "      \"breakfast\": [\n" +
  "        {\n" +
  "          \"id\": \"BSK001\",\n" +
  "          \"chineseName\": \"煎饼\",\n" +
  "          \"englishName\": \"Pancakes\",\n" +
  "          \"restaurant\": {\n" +
  "            \"id\": \"RST001\",\n" +
  "            \"name\": \"Sunny Side Cafe\"\n" +
  "          }\n" +
  "        },\n" +
  "        {\n" +
  "          \"id\": \"BSK002\",\n" +
  "          \"chineseName\": \"油条\",\n" +
  "          \"englishName\": \"Churro\",\n" +
  "          \"restaurant\": {\n" +
  "            \"id\": \"RST002\",\n" +
  "            \"name\": \"Rainy Side Cafe\"\n" +
  "          }\n" +
  "        }\n" +
  "      ],\n" +
  "      \"lunch\": [\n" +
  "        {\n" +
  "          \"id\": \"LCH001\",\n" +
  "          \"chineseName\": \"藜麦沙拉\",\n" +
  "          \"englishName\": \"Quinoa Salad\",\n" +
  "          \"restaurant\": {\n" +
  "            \"id\": \"RST003\",\n" +
  "            \"name\": \"Green Bowl\"\n" +
  "          }\n" +
  "        }\n" +
  "      ],\n" +
  "      \"afternoonTea\": [\n" +
  "        {\n" +
  "          \"id\": \"AT001\",\n" +
  "          \"chineseName\": \"果酱司康\",\n" +
  "          \"englishName\": \"Scones with Jam\",\n" +
  "          \"restaurant\": {\n" +
  "            \"id\": \"RST004\",\n" +
  "            \"name\": \"Tea Time\"\n" +
  "          }\n" +
  "        }\n" +
  "      ]\n" +
  "    },\n" +
  "   ],\n" +
  "   \"previousRecommendation\":{\n" +
  "     \"breakfast\":[\n" +
  "       {\n" +
  "         \"weekDay\":\"monday\", \n" +
  "         \"id\":\"BSK001\", \n" +
  "         \"chineseName\":\"煎饼\", \n" +
  "         \"englishName\":\"Pancakes\", \n" +
  "         \"restaurant\":{\n" +
  "           \"id\":\"RST001\", \n" +
  "           \"name\":\"Sunny Side Cafe\"\n" +
  "         }\n" +
  "       }\n" +
  "     ],\n" +
  "     \"lunch\":[\n" +
  "       {\n" +
  "         \"weekDay\":\"tuesday\", \n" +
  "         \"id\":\"LCH004\", \n" +
  "         \"chineseName\":\"\", \n" +
  "         \"englishName\":\"Tacos\", \n" +
  "         \"restaurant\":{\n" +
  "           \"id\":\"RST011\", \n" +
  "           \"name\":\"Taco Town\"\n" +
  "         }\n" +
  "       }\n" +
  "     ],\n" +
  "     \"afternoonTea\":[\n" +
  "       {\n" +
  "         \"weekDay\":\"wednesday\", \n" +
  "         \"id\":\"AT004\", \n" +
  "         \"chineseName\":\"\", \n" +
  "         \"englishName\":\"Croissant\", \n" +
  "         \"restaurant\":{\n" +
  "           id: 'RST012',\n" +
  "           name: 'Pastry Place'\n" +
  "         }\n" +
  "       }\n" +
  "     ]\n" +
  "   }\n" +
  "}"+
  "The user requirement will be provided in the # OBJECTIVE # section\n" +
  "# OBJECTIVE #\n" +
  "Based on your expertise and user requirement, recommend next week's menu option to users in the following JSON format. Return only the recommendationResult json and no any other things. " +
  "Please populate the emoji field with the emoji that you think is most appropriate for this dish\n" +
  "{" +
  "    \"recommendationResult\":" +
  "    {" +
  "        \"breakfast\":" +
  "        [{" +
  "            \"weekDay\":\"monday/tuesday...\"," +
  "            \"dishName\":\"\"," +
  "            \"restaurantName\":\"\"," +
  "            \"restaurantId\":\"\"," +
  "            \"dishId\":\"\"" +
  "            \"emoji\":\"\"" +
  "        }],\n" +
  "        \"lunch\":[{" +
  "            \"weekDay\":\"monday/tuesday...\"," +
  "            \"restaurantName\":\"\"," +
  "            \"restaurantId\":\"\"," +
  "            \"dishName\":\"\"," +
  "            \"dishId\":\"\"," +
  "            \"emoji\":\"\"" +
  "        }],\n" +
  "        \"afternoonTea\":[{\n" +
  "            \"weekDay\":\"monday/tuesday...\"," +
  "            \"restaurantName\":\"\"," +
  "            \"restaurantId\":\"\"," +
  "            \"dishName\":\"\"," +
  "            \"dishId\":\"\"" +
  "            \"emoji\":\"\"" +
  "        }]" +
  "    }" +
  "}\n" +
  "the user requirement is:\n"
 const menuPrompt = "# MENU #\n"


export default async function handler(req:NextApiRequest,res:NextApiResponse<RecommendResult>){
  if (req.method === HttpMethods.POST){
    const result = await recommend(req.body.recommendInput);
    res.json(result);
  }else{
    res.setHeader('Allow',[HttpMethods.POST]);
    res.status(HttpStatusCode.MethodNotAllowed);
  }
}

// Function to call OpenAI API and return an enum based on user input
export async function recommend(recommendInput: RecommendInput): Promise<RecommendResult> {
  try {
    // Call the OpenAI API with the user input
    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: recommendPrompt + recommendInput.userInput + "\n" + menuPrompt + JSON.stringify(recommendInput.mealPlan),
        },
      ],
      stream:false,
      response_format:{type:"json_object"}
    });

    // Parse the response to extract the necessary information
    if (!response || response.choices.length === 0 || !response.choices[0].message.content ) {
      console.log(response);
      throw new Error('No response from OpenAI')
    }

    const result = JSON.parse(response.choices[0].message.content);
    if (!result || !result.recommendationResult) {
      console.log(response);
      throw new Error('No valid response from OpenAI')
    }
    return result.recommendationResult as RecommendResult;

  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to recommend input');
  }
}
