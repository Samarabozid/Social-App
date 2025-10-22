import { Request, Response } from "express";
import { FriendshipStatusEnum, IFriendship, IRequest, IUser } from "../../../Common/index";
import { BadRequestException, S3ClientService } from "../../../Utils/index";
import { SuccessResponse } from "../../../Utils/Response/response-helper.utils";
import { UserRepository } from "../../../DB/Repositories/user.repository";
import { UserModel } from "../../../DB/Models";
import { FriendshipRepository } from "../../../DB/Repositories/friendship.repository";
import mongoose, { FilterQuery } from "mongoose";

export class ProfileService {

    private s3Clients = new S3ClientService();
    private userRepository = new UserRepository(UserModel)
    private friendshipRepository = new FriendshipRepository()

    uploadProfilePicture = async (req: Request, res: Response) => {
        const { file } = req
        const { user } = (req as unknown as IRequest).loggedInUser
        if (!file) throw new BadRequestException("Please upload a file")

        const { key, url } = await this.s3Clients.uploadFileOnS3(file, `${user._id}/profile`)
        //const uploaded = await this.s3Clients.uploadLargeFileOnS3(file, `${user._id}/profile`)

        user.profilePicture = key
        await user.save()

        res.json(SuccessResponse<unknown>("Profile picture uploaded successfully", 200, { key, url }))
        //res.json(SuccessResponse<unknown>("Profile picture uploaded successfully", 200, uploaded))

    }


    renewSignedUrl = async (req: Request, res: Response) => {
        const { user } = (req as unknown as IRequest).loggedInUser
        const { key, keyType }: { key: string, keyType: 'profilePicture' | 'coverPicture' } = req.body

        if (user[keyType] !== key) throw new BadRequestException("Invalid Key")

        const url = await this.s3Clients.getFileWithSignedUrl(key)

        res.json(SuccessResponse<unknown>("Signed url renewed successfully", 200, { key, url }))
    }

    deleteAccount = async (req: Request, res: Response) => {
        const { user } = (req as unknown as IRequest).loggedInUser
        const deleteDocument = await this.userRepository.findByIdAndDeleteDocument(user._id as unknown as mongoose.Schema.Types.ObjectId)

        if (!deleteDocument) throw new BadRequestException("User not found")
        //const deleteResponse = await this.s3Clients.deleteFileFromS3(deleteDocument?.profilePicture as string)
        //res.json(SuccessResponse<unknown>("Account deleted successfully", 200, deleteResponse))
        res.json(SuccessResponse<unknown>("Account deleted successfully", 200))

    }

    updateProfile = async (req: Request, res: Response) => {
        // const { user: { _id } } = (req as unknown as IRequest).loggedInUser
        const { firstName, lastName, email, password, gender, phoneNumber }: IUser = req.body

        // const user = await this.userRepository.findDocumentById(req.params._id as unknown as mongoose.Schema.Types.ObjectId)
        // if (!user) throw new BadRequestException("User not found")

        // if (firstName) user.firstName = firstName
        // if (lastName) user.lastName = lastName
        // if (email) user.email = email
        // if (password) user.password = password
        // if (gender) user.gender = gender
        // if (phoneNumber) user.phoneNumber = phoneNumber

        // await user.save()

        // res.json(SuccessResponse<unknown>("Profile updated successfully", 200, user))

        await this.userRepository.updateOneDocument(
            { _id: req.params._id, email },
            { $set: { firstName, lastName, password, gender, phoneNumber } },
            { new: true }
        )

        res.json(SuccessResponse<unknown>("Profile updated successfully", 200))
    }

    getProfile = async (req: Request, res: Response) => {
        const user = await this.userRepository.findDocumentById(req.params._id as unknown as mongoose.Schema.Types.ObjectId)
        if (!user) throw new BadRequestException("User not found")
        res.json(SuccessResponse<unknown>("Profile fetched successfully", 200, user))
    }


    listUsers = async (req: Request, res: Response) => {
        const users = await this.userRepository.findDocuments()
        res.json(SuccessResponse<IUser[]>("Users fetched successfully", 200, users))
    }

    // sendFriendshipRequest
    sendFriendshipRequest = async (req: Request, res: Response) => {
        const { user: { _id } } = (req as unknown as IRequest).loggedInUser
        if (!_id) throw new BadRequestException("User not found")

        const { requestToId } = req.body

        const user = await this.userRepository.findDocumentById(requestToId)

        if (!user) throw new BadRequestException("User not found")

        this.friendshipRepository.createNewDocument({ requestFromId: _id, requestToId })

        res.json(SuccessResponse<unknown>("Friendship request sent successfully", 200))
    }

    // listFriendshipRequests
    listFriendshipRequests = async (req: Request, res: Response) => {
        const { user: { _id } } = (req as unknown as IRequest).loggedInUser
        if (!_id) throw new BadRequestException("User not found")
        const { status } = req.query

        const filters: FilterQuery<IFriendship> = { status: status ? status : FriendshipStatusEnum.PENDING }
        if (filters.status === FriendshipStatusEnum.ACCEPTED) filters.$or = [{ requestFromId: _id }, { requestToId: _id }]
        else filters.requestToId = _id


        const friendshipRequests = await this.friendshipRepository.findDocuments(
            filters,
            undefined,
            {
                populate: [
                    {
                        path: "requestFromId",
                        select: "firstName lastName profilePicture"
                    },
                    {
                        path: "requestToId",
                        select: "firstName lastName profilePicture"
                    }
                ]
            })

        res.json(SuccessResponse<IFriendship[]>("Friendship requests fetched successfully", 200, friendshipRequests))
    }

    // respondToFriendshipRequest

    respondToFriendshipRequest = async (req: Request, res: Response) => {
        const { user: { _id } } = (req as unknown as IRequest).loggedInUser
        const { friendRequestId, response } = req.body

        const friendRequest = await this.friendshipRepository.findOneDocument({ _id: friendRequestId, requestToId: _id, status: FriendshipStatusEnum.PENDING })
        if (!friendRequest) throw new BadRequestException("Friendship request not found")

        friendRequest.status = response
        await friendRequest.save()
        res.json(SuccessResponse<IFriendship>("Request response sent successfully", 200, friendRequest))
    }

}

export default new ProfileService()