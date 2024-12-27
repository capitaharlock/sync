import axios, { AxiosRequestConfig } from 'axios';

export const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_API,
  // withCredentials: true,
  headers: { 
    'Content-Type': 'application/json',
    // this is a placeholder till login functionality is implemented
    'Authorization': process.env.NEXT_PUBLIC_APP_API_KEY,
  },
});

client.interceptors.request.use(request => {
  console.log(`Request URL: ${request.baseURL}${request.url}`);
  return request;
});

client.interceptors.response.use(
  res => res,
  err => {
    const { code, message } = err;
    if (code === 'ECONNABORTED' || message === 'Network Error') {
      console.log('error', 'Network timed out - refresh page to resume');
    }
    return Promise.reject(err);
  }
);

const request = async (options: AxiosRequestConfig) => {
  try {
    const { data } = await client(options);

    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error({
        status: err.response?.status,
        data: err.response?.data,
        Headers: err.response?.headers,
      });
      throw err?.response?.data || '';
    } else {
      console.error(err);
    }
  }
};

export default request;
