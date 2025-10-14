import { BaseRepository } from "./base.repository";
import { IUser } from "../../Common/index";
import { Model } from "mongoose";



export class UserRepository extends BaseRepository<IUser> {
    constructor(protected _usermodel:Model<IUser>) {
        super(_usermodel);
    }


    // findUserByEmail

    

}  