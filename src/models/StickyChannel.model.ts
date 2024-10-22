import mongoose from "mongoose";
import {
    StickyChannelDocument,
    StickyChannelModel,
} from "./types/StickyChannelMongooseType";

const stickyChannelSchema = new mongoose.Schema({
    channelId: {
        type: String,
        required: true,
        unique: true,
    },
    recentPostMessageId: {
        type: String,
        required: false,
        default: null,
    },
    stickyMessageId: {
        type: String,
        required: false,
        default: null,
    },
});

export default mongoose.model<StickyChannelDocument, StickyChannelModel>(
    "StickyChannel",
    stickyChannelSchema
);
