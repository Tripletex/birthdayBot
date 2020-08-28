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
                channel: '#birthdaybot',
                text: `Gratulerer med dagen *${employee.firstName} ${employee.lastName}!* :birthday::gift::tada: `
            })
        }))
        return;
    } catch (error) {
        console.log("Error: ", error);
        return;
    }
}
