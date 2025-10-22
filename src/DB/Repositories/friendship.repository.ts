import { BaseRepository } from "./base.repository";
import { IFriendship } from "../../Common";
import { Model } from "mongoose";
import { FriendshipModel } from "../Models";



export class FriendshipRepository extends BaseRepository<IFriendship>{
    constructor(){
        super(FriendshipModel)
    }
}
    
