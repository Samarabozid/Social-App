import mongoose from "mongoose";
import { IBlackListedToken } from "../../Common/index.js";

const blackListedTokensSchema = new mongoose.Schema<IBlackListedToken>({
    tokenId: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
})

const BlackListedTokensModel = mongoose.model<IBlackListedToken>("BlackListedTokens", blackListedTokensSchema);

export {BlackListedTokensModel}
 