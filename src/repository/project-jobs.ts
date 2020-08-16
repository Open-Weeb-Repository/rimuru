import db from "../commons/db";
import {IProjectJob} from "project-jobs";
import {IDB} from "rimuru.commons";
import {FindResult, FindOptions, WithID} from "monk";

type IDBType = WithID<IProjectJob & IDB.HasLasRun>;

export const projectJobs = db.get<IDBType>("projectScrapeJobs");
projectJobs.createIndex('state');
projectJobs.createIndex('malId provider');

export default {
    getActiveJobs(options?: FindOptions): Promise<FindResult<IDBType>> {
        return projectJobs.find({
            state: "active"
        }, options);
    },

    setJobToInactive(projectJob: IProjectJob) {
        return projectJobs.update({
            malId: projectJob.malId,
            provider: projectJob.provider
        }, {
            $set: {
                state: "inactive"
            }
        })
    },

    async walkInActiveJob(process: (projectJob: WithID<IDBType>) => Promise<boolean>, fetchSize = 100) {
        const collectionCount = await projectJobs.count({
            state: "active",
        });
        let now = 0;
        const inactiveJobIds = [];
        do {
            const activeJobs = await this.getActiveJobs({
                limit: fetchSize,
                skip: now
            });
            now += activeJobs.length;
            for (const activeJob of activeJobs) {
                if (!await process(activeJob)) {
                    // add to inactive
                    inactiveJobIds.push(activeJob._id);
                }
            }
        } while (collectionCount > now);
        // todo: this is stupid, time to change from monk to mongodb driver or other
        await Promise.all(
            inactiveJobIds.map(
                _id => projectJobs.update(
                    {
                        _id
                    },
                    {
                        $set: {
                            state: "inactive"
                        }
                    }
                )
            )
        )

        return {
            totalSize: collectionCount,
            processFail: inactiveJobIds.length,
            processSuccess: collectionCount - inactiveJobIds.length
        }
    }
}
