import { promiseHooks } from "v8";
import { z } from "zod";
import { GenderEnum } from "../../Common";

export const signUpValidator = {
    body: z.object({
        firstName: z.string().min(3).max(10),
        lastName: z.string().min(3).max(10),
        email: z.email(),
        password: z.string(),
        gender: z.enum(GenderEnum),
        //DOB: z.date(),
        phoneNumber: z.string().min(11).max(11)
    })
}
