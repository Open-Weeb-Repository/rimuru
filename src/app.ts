import debug from 'debug';
import projectJobsRepo from './repository/project-jobs';

const log = debug('rimuru:app');

export class App {
    constructor() {
        log('App instance created.');
    }

    async start(){
        const activeJobs = await projectJobsRepo.getActiveJobs();
        log('%d active job found in database', activeJobs.length);
    }
}
