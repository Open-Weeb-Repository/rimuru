import yargs from "yargs";
import {CronJob} from "cron";
import debug from 'debug';
import config from "config";
import db from "./commons/db";
import { closeConnection as closeAmqp } from "./commons/amqp";
import {IStartArgs} from "app.args";
import {App} from "./app";

const log = debug('rimuru:main');

yargs
    .command('start [crontime]', 'Start rimuru using on cron format', yargs => {
        yargs.positional('crontime', {
            describe: 'Cron format (* * * * * *)',
            default: config.get("defaultCronTime")
        })
        yargs.option('run-oninit', {
            type: "boolean",
            description: "Run on init"
        })
    }, start)
    .command('once', 'Start rimuru only once', () => {
    }, once)
    .argv;

function start(argv: IStartArgs) {
    log('creating cronjob with %s', argv.crontime);
    new CronJob({
        cronTime: argv.crontime,
        onTick: () => once(),
        runOnInit: argv.runOninit,
        start: true
    });
}

function once() {
    log('Start process');
    const app = new App();
    return app.start()
        .then(() => {
            log('process success');
            console.log((new Date()).toISOString() + '::Process Done');
        }).catch(err => {
            log('process fail');
            console.error((new Date()).toISOString() + '::Process Error');
            console.error(err);
        }).finally(() => {
            if (db._state !== 'closed') {
                log('closing DB');
                db.close();
            }
            closeAmqp();
            return;
        });
}
