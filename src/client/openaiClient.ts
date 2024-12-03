import OpenAI from "openai";

const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
// Initialize OpenAI client
const openAIClient = new OpenAI({
    dangerouslyAllowBrowser: true,
    apiKey: API_KEY,
});

export default openAIClient;
