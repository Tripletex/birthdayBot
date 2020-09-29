import { AxiosRequestConfig } from 'axios'
import { config } from 'firebase-functions'
import { TripletexEmployee } from './types'
import * as moment from 'moment';
import { executeTripletexRequest } from './executeTripletexRequest';

export const TRIPLETEX_API_URL = config().tripletex.url


export async function fetchTripletexBirthdayEmployees(): Promise<TripletexEmployee[]> {
	const periodStart = '1970-01-01';
	const periodEnd = moment().format('YYYY-MM-DD');
	const fields = 'firstName,lastName,dateOfBirth,department(name)';
	const url = `/employee?periodStart=${periodStart}&periodEnd=${periodEnd}&fields=${fields}`;
	try {
		const response = await executeTripletexRequest(url, requestOptions)
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
