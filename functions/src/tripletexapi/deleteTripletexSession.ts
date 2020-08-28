import { AxiosRequestConfig } from 'axios';
import { makeTripletexRequest } from "./makeTripletexRequest";
export async function deleteTripletexSession(token: string, requestConfig: AxiosRequestConfig | undefined): Promise<boolean> {
  if (!token) {
    throw new Error('Token missing');
  }

  const deleteConfig: AxiosRequestConfig = {
    ...requestConfig,
    method: 'DELETE'
  };
  const response = await makeTripletexRequest(`/token/session/${token}`, deleteConfig);
  return response!.status === 204;
}
