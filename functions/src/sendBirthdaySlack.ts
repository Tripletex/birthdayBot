import * as functions from 'firebase-functions';
import { WebClient } from '@slack/web-api'
import {TripletexEmployee} from "./tripletexapi/types";

export default async (employees: Array<TripletexEmployee>): Promise<void> => {
	const token = functions.config().slack.token;
	const web = new WebClient(token);
	try {
		employees.forEach((employee => {
			console.log(employee);
			web.chat.postMessage({
				channel: '#tripletex_sosialt',
				text: `Gratulerer med dagen *${employee.firstName} ${employee.lastName} (${employee.department.name})!* :birthday::gift::tada: `
			})
		}))
		return;
	} catch (error) {
		functions.logger.error(error)
		return;
	}
}
