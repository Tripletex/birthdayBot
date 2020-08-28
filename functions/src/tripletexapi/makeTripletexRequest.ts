import axios, { AxiosRequestConfig } from 'axios';
import { TRIPLETEX_API_URL } from './employee';
import {  TripletexResponse } from './types';

export async function makeTripletexRequest(endpoint: string, config: AxiosRequestConfig | undefined = {
  method: 'GET',
  headers: {
    'content-type': 'application/json'
  }
}): Promise<TripletexResponse> {
  try {
    const { method, headers } = config;
    const requestHeaders = { ...headers, 'content-type': 'application/json' };
    const response = await axios({ method, headers: requestHeaders, url: `${TRIPLETEX_API_URL}${endpoint}` });
    if (response.status >= 400) {
      console.log('Hey, something went wrong!', response.data);
      throw new Error('Something went wrong processing the response');
    }

    return {
      data: response.data,
      status: response.status
    };
  }
  catch (error) {
    return Promise.reject(error.message);
  }
}
