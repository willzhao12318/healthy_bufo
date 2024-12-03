import {Category, HttpMethods} from "@/utils/type";


const baseURL = '/api';

const categoryURL = baseURL + '/category';

export type CategorizePayload = {
  readonly userInput: string;
}

export default async function categorize(userInput: string):Promise<{ category:Category, text: string }> {
  const response = await fetch(categoryURL, {
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


