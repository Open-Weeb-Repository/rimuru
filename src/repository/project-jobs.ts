import db from "../commons/db";
import {IProjectJob} from "project-jobs";
import {IDB} from "rimuru.commons";
import { FindResult } from "monk";

export const projectJobs = db.get<IProjectJob & IDB.HasLasRun>("projectScrapeJobs");
projectJobs.createIndex('state');
projectJobs.createIndex('malId provider');

export default {
    getActiveJobs () {
        return projectJobs.find({
            state: "active"
        }) as any as Promise<FindResult<IProjectJob & IDB.HasLasRun>>;
    },

    setJobToInactive (projectJob: IProjectJob) {
        return projectJobs.update({
            malId: projectJob.malId,
            provider: projectJob.provider
        }, {
            $set: {
                state: "inactive"
            }
        })
    }
}
