import { Request, Response } from "express";
import { IRequest } from "../../../Common/index";
import { BadRequestException, S3ClientService } from "../../../Utils/index";
import { SuccessResponse } from "../../../Utils/Response/response-helper.utils";

export class ProfileService {

    private s3Clients = new S3ClientService();

    uploadProfilePicture = async (req: Request, res: Response) => {
        const { file } = req
        const { user} = (req as unknown as IRequest).loggedInUser
        if (!file) throw new BadRequestException("Please upload a file")

        const {key , url} = await this.s3Clients.uploadFileOnS3(file, `${user._id}/profile`)

        user.profilePicture = key
        await user.save()

        res.json(SuccessResponse<unknown>("Profile picture uploaded successfully", 200, {key, url}))
    }


    renewSignedUrl = async (req: Request, res: Response) => {
        const { user} = (req as unknown as IRequest).loggedInUser
        const {key, keyType}: {key: string, keyType: 'profilePicture' | 'coverPicture'} = req.body

        if (user[keyType] !== key) throw new BadRequestException("Invalid Key")

        const url = await this.s3Clients.getFileWithSignedUrl(key)

        res.json(SuccessResponse<unknown>("Signed url renewed successfully", 200, {key,url}))
    }

}

export default new ProfileService()