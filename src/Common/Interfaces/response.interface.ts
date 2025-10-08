

export interface IMetaResponse{
    status: number,
    success:boolean
}

export interface IDataResponse{
    message:string,
    data:unknown
}

export interface IErrorDataReponse{
    message:string,
    context?:object
}

export interface ISuccessReponse{
    meta:IMetaResponse,
    data?:IDataResponse
}

export interface IFailureReponse{
    meta:IMetaResponse,
    error?:IErrorDataReponse
}