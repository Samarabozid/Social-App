import { Request, Response } from "express";
import { IRequest } from "../../../Common/index";
import { BadRequestException, S3ClientService } from "../../../Utils/index";
import { SuccessResponse } from "../../../Utils/Response/response-helper.utils";
import { UserRepository } from "../../../DB/Repositories/user.repository";
import { UserModel } from "../../../DB/Models";
import mongoose from "mongoose";

export class ProfileService {

    private s3Clients = new S3ClientService();
    private userRepository = new UserRepository(UserModel)

    uploadProfilePicture = async (req: Request, res: Response) => {
        const { file } = req
        const { user} = (req as unknown as IRequest).loggedInUser
        if (!file) throw new BadRequestException("Please upload a file")

        //const {key , url} = await this.s3Clients.uploadFileOnS3(file, `${user._id}/profile`)
        const uploaded = await this.s3Clients.uploadLargeFileOnS3(file, `${user._id}/profile`)

        //user.profilePicture = key
        //await user.save()

        //res.json(SuccessResponse<unknown>("Profile picture uploaded successfully", 200, {key, url}))
        res.json(SuccessResponse<unknown>("Profile picture uploaded successfully", 200, uploaded))

    }


    renewSignedUrl = async (req: Request, res: Response) => {
        const { user} = (req as unknown as IRequest).loggedInUser
        const {key, keyType}: {key: string, keyType: 'profilePicture' | 'coverPicture'} = req.body

        if (user[keyType] !== key) throw new BadRequestException("Invalid Key")

        const url = await this.s3Clients.getFileWithSignedUrl(key)

        res.json(SuccessResponse<unknown>("Signed url renewed successfully", 200, {key,url}))
    }

    deleteAccount = async (req: Request, res: Response) => {
        const { user} = (req as unknown as IRequest).loggedInUser
        const deleteDocument  = await this.userRepository.findByIdAndDeleteDocument(user._id as mongoose.Schema.Types.ObjectId)

        if (!deleteDocument) throw new BadRequestException("User not found")
        const deleteResponse = await this.s3Clients.deleteFileFromS3(deleteDocument?.profilePicture as string)
        res.json(SuccessResponse<unknown>("Account deleted successfully", 200, deleteResponse))
    }
}

export default new ProfileService()