import debug from 'debug';
import config from 'config';
import projectJobsRepo from './repository/project-jobs';
import sendScrapeProjectJob from "./helpers/send-scrape-project-job";

const log = debug('rimuru:app');

export class App {
    constructor() {
        log('App instance created.');
    }

    async start(){
        log("Start sending job in batch");
        const result = await projectJobsRepo.walkInActiveJob(async activeJob => {
            if ( activeJob.n_done === 0 && activeJob.n_fail > config.get('projectNeverThreshold') ) {
                // project not taken by provider
                return false;
            } else if (activeJob.n_done > 0 && activeJob.n_fail > config.get('projectInactiveThreshold')) {
                // project no longer active
                return false;
            } else {
                // send job to worker
                const _id = activeJob._id.toString();
                log("send job %s to worker", _id);
                sendScrapeProjectJob({
                    _id,
                    malId: activeJob.malId,
                    provider: activeJob.provider,
                    searchParam: activeJob.searchParam
                })
                return true;
            }
        });
        log("Done with: %o", result);
    }
}
