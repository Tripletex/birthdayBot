import { AxiosRequestConfig } from 'axios';
import { createTripletexSession } from './createTripletexSession';
import { deleteTripletexSession } from './deleteTripletexSession';
import { makeTripletexRequest } from './makeTripletexRequest';

export const executeTripletexRequest = async (endpoint: string, config: AxiosRequestConfig | undefined) => {
  try {
    const token: string = await createTripletexSession();
    const base64Session = Buffer.from(`0:${token}`).toString('base64');
    const requestConfig = {
      ...config,
      headers: {
        ...config?.headers,
        'authorization': `Basic ${base64Session}`
      }
    };

    const response = await makeTripletexRequest(endpoint, requestConfig);
    const tokenDeleted = await deleteTripletexSession(token, requestConfig);
    if (tokenDeleted) {
      console.log('token', token, 'was deleted sucessfully');
    }
    return response;
  }
  catch (error) {
    console.log('Something went very wrong!', error);
    return Promise.reject(error.message);
  }
};
