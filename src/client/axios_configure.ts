import axios from 'axios';

export const nextjsApi = axios.create({
  baseURL:
      process.env.NEXT_PUBLIC_AXIOS_BASE_URL,
});
