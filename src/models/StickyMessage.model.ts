import mongoose from "mongoose";
import {
    StickyMessageDocument,
    StickyMessageModel,
} from "./types/StickyMessageMongooseType";

const stickyMessageSchema = new mongoose.Schema({
    stickyMessage: {
        type: String,
        required: false,
        default: "",
    },
});

export default mongoose.model<StickyMessageDocument, StickyMessageModel>(
    "StickyMessage",
    stickyMessageSchema
);
