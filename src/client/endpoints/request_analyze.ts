import {HttpMethods} from "../../utils/type";
import {AnalyzeMenuItem} from "../../pages/api/analyzemenu";

const baseURL = '/api';

const analyzeURL = baseURL + '/analyzemenu';

export type AnalyzePayload = {
    readonly userInput: string;
}

export default async function analyze(userInput: string):Promise<{ analyzeResult: AnalyzeMenuItem[] }> {
    const response = await fetch(analyzeURL, {
        method: HttpMethods.POST,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({userInput:userInput}),
    })
    const result = await response.json();
    if (response.ok){
        return result;
    }else{
        throw new Error(response.statusText);
    }
}