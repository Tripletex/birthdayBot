import * as functions from 'firebase-functions';
import * as express from 'express';
import {https} from 'firebase-functions';
import sendBirthdaySlack from "./sendBirthdaySlack";
import {fetchTripletexBirthdayEmployees} from "./tripletexapi/employee";
import {TripletexEmployee} from "./tripletexapi/types";


export const testFunction = functions.region('europe-west3').https.onRequest((req: https.Request, res: express.Response) =>{
	fetchTripletexBirthdayEmployees().then((response:Array<TripletexEmployee>) =>{
		sendBirthdaySlack(response);
		res.status(200).send({ message: "Message send ok." });
	}).catch(() => {
		res.status(500).send({ message: "Error" });
	});
});

export const demo = functions.region('europe-west3').https.onRequest((req: https.Request, res: express.Response) =>{
	fetchTripletexBirthdayEmployees().then((response:Array<TripletexEmployee>) =>{
		sendBirthdaySlack(response);
		res.status(200).send({ message: "Message send ok." });
	}).catch(() => {
		res.status(500).send({ message: "Error" });
	});
});

export const scheduledMorningFunctions = functions.region('europe-west3').pubsub.schedule('0 7 * * *').timeZone('Europe/Oslo').onRun(() => {
	return fetchTripletexBirthdayEmployees().then((response:Array<TripletexEmployee>) =>{
		return sendBirthdaySlack(response);
	}).catch((e) => {
		functions.logger.error(e);
	});
});
