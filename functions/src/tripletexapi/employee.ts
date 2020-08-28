import axios, { AxiosRequestConfig } from 'axios'
import * as functions from 'firebase-functions';
import { TripletexEmployee } from './types'

const TRIPLETEX_API_URL = functions.config().tripletex.url
const employeeEndpoint = '/employee?includeContacts=false&from=0&count=1000'

export async function fetchEmployeeData(): Promise<TripletexEmployee[]> {
  try {
    const response = await axios.get(`${TRIPLETEX_API_URL}${employeeEndpoint}`)
    const employees: TripletexEmployee[] = response.data
    return employees
  } catch (error) {
    return []
  }
}

export const requestOptions: AxiosRequestConfig = {
  method: 'GET',
  headers: {
    'content-type': 'application/json',
  }
}

export const tripletexWrapper = async (endpoint: string, config: AxiosRequestConfig | undefined) => {
  try {
    const token: string = await createTripletexSession()
    const base64Session = Buffer.from(`0:${token}`).toString('base64')
    const requestConfig = {
      ...config,
      headers: {
        ...config?.headers,
        'authorization': `Basic ${base64Session}`
      }
    }

    const response = await makeTripletexRequest(endpoint, requestConfig)
    const tokenDeleted = await deleteTripletexSession(token, requestConfig)
    if (tokenDeleted) {
      console.log('token', token, 'was deleted sucessfully')
    }
    return response
  } catch (error) {
    console.log('Something went very wrong!', error)
    return Promise.reject(error.message)
  }
}



async function createTripletexSession(): Promise<string> {
  // DO NOT COMMIT THIS
  const CONSUMER_TOKEN = functions.config().tripletex.consumertoken;
  const EMPLOYEE_TOKEN = functions.config().tripletex.employeetoken;
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const expirationDate = `${tomorrow.getFullYear()}-${tomorrow.getMonth() < 9 ? `0${tomorrow.getMonth() + 1}` : tomorrow.getMonth() + 1}-${tomorrow.getDate() < 9 ? `0${tomorrow.getDate()}` : tomorrow.getDate()}`
  const response = await makeTripletexRequest(`/token/session/:create?consumerToken=${CONSUMER_TOKEN}&employeeToken=${EMPLOYEE_TOKEN}&expirationDate=${expirationDate}`, {
    'method': 'PUT'
  })

  if (response?.data.value && response.data.value.token) {
    return response.data.value.token
  }

  throw new Error('Unable to create token!')
}

async function deleteTripletexSession(token: string, requestConfig: AxiosRequestConfig | undefined): Promise<boolean> {
  if (!token) {
    throw new Error('Token missing')
  }

  const deleteConfig: AxiosRequestConfig = {
    ...requestConfig,
    method: 'DELETE'
  }
  const response = await makeTripletexRequest(`/token/session/${token}`, deleteConfig)
  return response!.status === 204
}

async function makeTripletexRequest(endpoint: string, config: AxiosRequestConfig | undefined = {
  method: 'GET',
  headers: {
    'content-type': 'application/json'
  }
}) {
  try {
    const { method, headers } = config
    const requestHeaders = { ...headers, 'content-type': 'application/json' }
    const response = await axios({ method, headers: requestHeaders, url: `${TRIPLETEX_API_URL}${endpoint}`})
    if (response.status >= 400) {
      console.log('Hey, something went wrong!', response.data)
      throw new Error('Something went wrong processing the response')
    }

    return {
      data: response.data,
      status: response.status
    }
  } catch (error) {
    return Promise.reject(error.message)
  }
}
