import { BaseRepository } from "./base.repository.js";
import { IUser } from "../../Common/index.js";
import { Model } from "mongoose";



export class UserRepository extends BaseRepository<IUser> {
    constructor(protected _usermodel:Model<IUser>) {
        super(_usermodel);
    }


    // findUserByEmail

    

} 