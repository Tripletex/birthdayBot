import * as functions from 'firebase-functions';
import * as express from 'express';
import { https } from 'firebase-functions';
import sendBirthdaySlack from "./sendBirthdaySlack";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


export const testFunction = functions.region('europe-west1').https.onRequest((req: https.Request, res: express.Response) =>{
	sendBirthdaySlack(req, res);
});

export const resetLogged = functions.region('europe-west1').pubsub.schedule('7 30 * * *').timeZone('Europe/Oslo').onRun(() => {
	//TODO DO bot stuff
	return null;
});
