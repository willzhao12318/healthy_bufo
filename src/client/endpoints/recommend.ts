import {HttpMethods, RecommendInput} from "@/utils/type";
const baseURL = '/api';
const categoryURL = baseURL + '/recommend';


export default async function recommend(recommendationInput: RecommendInput):Promise<string> {
  const response = await fetch(categoryURL, {
    method: HttpMethods.POST,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({recommendInput:recommendationInput}),
  })
  const result = await response.json();
  if (response.ok){
    return result;
  }else{
    throw new Error(response.statusText);
  }
}


