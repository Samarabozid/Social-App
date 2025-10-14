import { BaseRepository } from "./base.repository";
import { Model } from "mongoose";
import { IBlackListedToken } from "../../Common/index";


export class BlackListedTokenRepository extends BaseRepository<IBlackListedToken>{

    constructor(protected _blackListedTokensModel: Model<IBlackListedToken>){
        super(_blackListedTokensModel)
    }
}
    
