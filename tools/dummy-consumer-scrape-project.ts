import { scrapJobQueue } from '../src/commons/amqp';
import { RimuruMessage } from "../src/types/rimuru.messages";

scrapJobQueue.prefetch(1);

scrapJobQueue.activateConsumer(async (msg) => {
    const content = msg.getContent() as RimuruMessage.IScrapeMessage;
    console.log('received ', content.provider, content.malId);
    const waittime = Math.floor(Math.random()* 3000);
    await wait(waittime);
    console.log(`done with wait: ${waittime}ms`)
    msg.ack();
});

console.log('listening: press ctrl+c to exit');

const wait = (ms : number) => new Promise(resolve => {
    setTimeout(() => resolve(), ms);
})
