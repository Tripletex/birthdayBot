import * as express from 'express';
import { https } from 'firebase-functions';

const { WebClient } = require('@slack/web-api');
const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);

export default async (req: https.Request, res: express.Response): Promise<void> => {
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
