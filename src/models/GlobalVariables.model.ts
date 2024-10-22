import mongoose from "mongoose";
import {
    GlobalVariablesDocument,
    GlobalVariablesModel,
} from "./types/GlobalVariablesMongooseType";

const globalVariablesSchema = new mongoose.Schema({
    stickyMessage: {
        type: String,
        required: false,
        default: null,
    },
});

export default mongoose.model<GlobalVariablesDocument, GlobalVariablesModel>(
    "GlobalVariable",
    globalVariablesSchema
);
