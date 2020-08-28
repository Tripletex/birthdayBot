import { config } from 'firebase-functions';
import { makeTripletexRequest } from "./makeTripletexRequest";
export async function createTripletexSession(): Promise<string> {
  const CONSUMER_TOKEN = config().tripletex.consumertoken;
  const EMPLOYEE_TOKEN = config().tripletex.employeetoken;
  const expirationDate = getTokenExpirationDate();
  const response = await makeTripletexRequest(`/token/session/:create?consumerToken=${CONSUMER_TOKEN}&employeeToken=${EMPLOYEE_TOKEN}&expirationDate=${expirationDate}`, {
    'method': 'PUT'
  });

  if (response?.data.value && response.data.value.token) {
    return response.data.value.token;
  }

  throw new Error('Unable to create token!');
}

function getTokenExpirationDate() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const expirationDate = `${tomorrow.getFullYear()}-${tomorrow.getMonth() < 9 ? `0${tomorrow.getMonth() + 1}` : tomorrow.getMonth() + 1}-${tomorrow.getDate() < 9 ? `0${tomorrow.getDate()}` : tomorrow.getDate()}`;
  return expirationDate;
}