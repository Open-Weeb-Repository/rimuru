import {FilterQuery, UpdateQuery, UpdateWriteOpResult, UpdateManyOptions} from "mongodb";

declare module "monk" {
    interface ICollection<T extends { [key: string]: any } = any> {
        update(
            query: FilterQuery<T>,
            update: UpdateQuery<T> | Partial<T>,
            options?: { multi: boolean } & UpdateManyOptions
        ): Promise<UpdateWriteOpResult>;
    }
}
