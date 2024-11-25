import mongoose from "mongoose";
import {
  NicknameRequestDocument,
  NicknameRequestModel,
} from "./types/NicknameRequestMongooseType";

const nicknameRequestSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  messageId: { type: String, required: true },
  nickname: { type: String, required: true },
});

export default mongoose.model<NicknameRequestDocument, NicknameRequestModel>(
  "NicknameRequest",
  nicknameRequestSchema
);
