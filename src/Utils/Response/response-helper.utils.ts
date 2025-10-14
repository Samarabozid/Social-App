import { IFailureReponse, ISuccessReponse } from "../../Common/index"


export function SuccessResponse<T>(
    message:string =  'Your Request is processed successfully',
    status = 200,
    data?:T
): ISuccessReponse{
    return {
        meta:{
            status,
            success:true
        },
        data:{
            message,
            data
        }
    }
}

export function FailedResponse(
    message: string = 'Your Request is failed',
    status = 500,
    error?:object
): IFailureReponse{
    return {
        meta:{
            status,
            success:false
        },
        error:{
            message,
            context:error
        }
    }
}