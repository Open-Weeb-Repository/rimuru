import debug from 'debug';
import config from 'config';
import projectJobsRepo from './repository/project-jobs';

const log = debug('rimuru:app');

export class App {
    constructor() {
        log('App instance created.');
    }

    async start(){
        const activeJobs = await projectJobsRepo.getActiveJobs();
        log('%d active job found in database', activeJobs.length);
        const task: Promise<any>[] = [];
        for (const activeJob of activeJobs) {
            if ( activeJob.n_done === 0 && activeJob.n_fail > config.get('projectNeverThreshold') ) {
                // project not taken by provider
                task.push(projectJobsRepo.setJobToInactive(activeJob));
            } else if (activeJob.n_done > 0 && activeJob.n_fail > config.get('projectInactiveThreshold')) {
                // project no longer active
                task.push(projectJobsRepo.setJobToInactive(activeJob));
            } else {
                // send job to worker
                log("send job %s to worker", activeJob._id.toString());
            }
        }
        await Promise.all(task);
    }
}
