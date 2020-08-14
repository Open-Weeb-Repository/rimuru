export interface IBaseArgs{}

export interface IStartArgs extends IBaseArgs{
    crontime: string,
    runOninit?: boolean
}
