import * as functions from 'firebase-functions';
import * as express from 'express';
import { https } from 'firebase-functions';
import sendBirthdaySlack from "./sendBirthdaySlack";


export const testFunction = functions.region('europe-west1').https.onRequest((req: https.Request, res: express.Response) =>{
	sendBirthdaySlack(req, res);
});

/*
export const resetLogged = functions.region('europe-west1').pubsub.schedule('7 30 * * *').timeZone('Europe/Oslo').onRun(() => {
	//TODO DO bot stuff
	return null;
});
*/
