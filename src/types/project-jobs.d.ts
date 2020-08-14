export interface IProjectJob {
    provider: string;
    malId: string;
    n_fail: number;
    n_done: number;
    searchParam: string[];
    state: 'active' | 'inactive'
}
