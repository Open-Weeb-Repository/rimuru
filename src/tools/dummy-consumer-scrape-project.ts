import { scrapJobQueue } from '../commons/amqp';
import {RimuruMessage} from "rimuru.messages";

scrapJobQueue.prefetch(1);

scrapJobQueue.activateConsumer(async (msg) => {
    const content = msg.getContent() as RimuruMessage.IScrapeMessage;
    console.log('received ', content.provider, content.malId);
    const waittime = Math.floor(Math.random()* (content.provider === 'anime_samehadaku' ? 3000 : 1000));
    await wait(waittime);
    console.log(`done with wait: ${waittime}ms`)
    msg.ack();
});

console.log('listening: press ctrl+c to exit');

const wait = (ms : number) => new Promise(resolve => {
    setTimeout(() => resolve(), ms);
})
