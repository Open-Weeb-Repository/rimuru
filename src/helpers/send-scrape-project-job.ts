import { scrapJobQueue } from '../commons/amqp';
import {Message} from "amqp-ts";
import { RimuruMessage } from "rimuru.messages";

scrapJobQueue.prefetch(1);

export default function sendScrapeProjectJob (content: RimuruMessage.IScrapeMessage) {
    scrapJobQueue.send(new Message(content));
}
