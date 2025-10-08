import { NextFunction, Response, Request} from "express";
import { verifyToken } from "../Utils/Services/token.utils.js";
import { IUser, IRequest } from "../Common/index.js";
import { UserRepository } from "../DB/Repositories/user.repository.js";
import { JwtPayload } from "jsonwebtoken";
import { UserModel } from "../DB/Models/user.model.js"
import { BlackListedTokenRepository } from "../DB/Repositories/black-listed.repository.js";
import { BlackListedTokensModel } from "../DB/Models/index.js";
import process from "process";
import { BadRequestException } from "../Utils/Errors/excpetions.utils.js"

const userRepo = new UserRepository(UserModel)
const blackListedTokenRepo = new BlackListedTokenRepository(BlackListedTokensModel)

export const authenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const { authorization: accessToken } = req.headers;

    if (!accessToken) throw next(new BadRequestException('Please Login First'))

    const [prefix, token] = accessToken.split(' ')
    if (prefix !== process.env.JWT_PREFIX) return res.status(401).json({ message: "Invalid Token" })

    const decodedToken = verifyToken(token, process.env.JWT_ACCESS_SECRET as string);
    if (!decodedToken._id) return res.status(401).json({ message: "Invalid Payload" })

    const blackListedToken = await blackListedTokenRepo.findOneDocument({ tokenId: decodedToken.jti })
    if (blackListedToken) return res.status(401).json({ message: "Your Session is expired Please Login Again" })

    const user: IUser | null = await userRepo.findDocumentById(decodedToken._id, '-password')
    if (!user) return res.status(404).json({ message: "Please Login First" });
   
    (req as unknown as IRequest).loggedInUser = { user, token: decodedToken as JwtPayload }
    next()
}