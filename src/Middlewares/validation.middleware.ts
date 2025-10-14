import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { BadRequestException } from "../Utils";

type RequestKeyType = keyof Request
type SchemaType = Partial<Record<RequestKeyType, ZodType>>
type validationErrorType = {
    key: RequestKeyType,
    issues: {
        path: PropertyKey[],
        message: string
    }[]
}

export const validationMiddleware = (schema: SchemaType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const reqKeys: RequestKeyType[] = ['body', 'params', 'query', 'headers']

        const validationErrors: validationErrorType[] = []
        for (const key of reqKeys) {
            if (schema[key]) {
                const result = schema[key].safeParse(req[key])
                console.log(`The validation result for`, { key, result })
                if (!result.success) {
                    const issues = result.error?.issues.map(issue => ({
                        path: issue.path,
                        message: issue.message
                    }))
                    validationErrors.push({ key, issues })
                }
            }
        }

        if(validationErrors.length){
            throw new BadRequestException("Validation Error", {validationErrors})
        }

        next()
    }
}