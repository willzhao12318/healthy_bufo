import {HttpMethods} from "../../utils/type";
import {AnalyzeMenuItem} from "../../pages/api/analyzemenu";

const baseURL = '/api';

const analyzeURL = baseURL + '/analyzemenu';

export type AnalyzePayload = {
    readonly userInput: string;
    readonly locale: string;
}

export default async function analyze(userInput: string, locale: string):Promise<{ analyzeResult: AnalyzeMenuItem[] }> {
    const response = await fetch(analyzeURL, {
        method: HttpMethods.POST,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({userInput:userInput, locale: locale}),
    })
    const result = await response.json();
    if (response.ok){
        return result;
    }else{
        throw new Error(response.statusText);
    }
}