import { AxiosRequestConfig } from 'axios'
// import * as functions from 'firebase-functions';
import { config } from 'firebase-functions'
import { TripletexEmployee } from './types'
import { executeTripletexRequest } from './executeTripletexRequest';

export const TRIPLETEX_API_URL = config().tripletex.url


export async function fetchTripletexBirthdayEmployees(): Promise<TripletexEmployee[]> {
	try {
		const response = await executeTripletexRequest('/employee?includeContacts=true&fields=firstName,lastName,dateOfBirth,department(name)', requestOptions)
		const employees: TripletexEmployee[] = response.data.values ?? []
		return employeesThatHaveBirthdayToday(employees)
	} catch (error) {
		throw error
	}
}

export const requestOptions: AxiosRequestConfig = {
	method: 'GET',
	headers: {
		'content-type': 'application/json',
	}
}

export function employeesThatHaveBirthdayToday(employees: TripletexEmployee[]): TripletexEmployee[] {
	return employees.filter((employee) => {
		const theEmpDate = new Date(employee.dateOfBirth)
		const employeeBirthdayMonth = theEmpDate.getMonth() + 1
		const employeeBirthdayDay = theEmpDate.getDate()

		const todayDate = new Date()
		const todayMonth = todayDate.getMonth() + 1
		const todayDay = todayDate.getDate()

		const doesEmployeeHaveBirthdayToday = employeeBirthdayDay === todayDay && todayMonth === employeeBirthdayMonth
		return doesEmployeeHaveBirthdayToday
	})
}
