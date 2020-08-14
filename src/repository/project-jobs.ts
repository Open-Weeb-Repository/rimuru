import db from "../commons/db";
import {IProjectJob} from "project-jobs";
import {IDB} from "rimuru.commons";
import { FindResult } from "monk";

export const projectJobs = db.get<IProjectJob & IDB.HasLasRun>("projectScrapeJobs");
projectJobs.createIndex('state');

export default {
    getActiveJobs () {
        return projectJobs.find({
            state: "active"
        }) as any as Promise<FindResult<IProjectJob & IDB.HasLasRun>>;
    }
}
