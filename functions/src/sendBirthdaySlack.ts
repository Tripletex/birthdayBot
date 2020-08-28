import * as express from 'express';
import { https } from 'firebase-functions';
import * as functions from 'firebase-functions';
import { WebClient } from '@slack/web-api'

export default async (req: https.Request, res: express.Response): Promise<void> => {
    const token = functions.config().SLACK_TOKEN;
    const web = new WebClient(token);
    try {
        await web.chat.postMessage({
            channel: '#birthdaybot',
            text: 'Test message'
        })

        res.status(200).send({ message: "Message send ok." });
        return;
    } catch (error) {
        console.log("Error: ", error);
        res.status(400).send({ message: "Error" });
        return;
    }
}
