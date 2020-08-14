export namespace RimuruMessage {
    export interface IScrapeMessage {
        _id: string
        provider: string;
        malId: string;
        searchParam: string[];
    }
}
