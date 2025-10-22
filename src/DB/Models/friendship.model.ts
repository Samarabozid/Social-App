import mongoose from "mongoose";
import { FriendshipStatusEnum ,IFriendship} from "../../Common";

const friendshipSchema = new mongoose.Schema<IFriendship>({

    requestFromId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    requestToId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status:{
        type: String,
        enum: FriendshipStatusEnum,
        default: FriendshipStatusEnum.PENDING
    }
})

export const FriendshipModel = mongoose.model<IFriendship>("Friendship", friendshipSchema);