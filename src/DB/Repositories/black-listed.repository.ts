import { BaseRepository } from "./base.repository.js";
import { Model } from "mongoose";
import { IBlackListedToken } from "../../Common/index.js";


export class BlackListedTokenRepository extends BaseRepository<IBlackListedToken>{

    constructor(protected _blackListedTokensModel: Model<IBlackListedToken>){
        super(_blackListedTokensModel)
    }
}
    
