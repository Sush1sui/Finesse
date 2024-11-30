import mongoose from "mongoose";
import {
  NicknameRequestDocument,
  NicknameRequestModel,
} from "./types/NicknameRequestMongooseType";

const nicknameRequestSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userMessageId: { type: String, required: true },
  userChannelId: { type: String, required: true },
  channelId: { type: String, required: true },
  messageId: { type: String, required: true, unique: true },
  nickname: { type: String, required: true },
  reactions: [
    {
      emoji: {
        type: String,
        required: true,
      },
    },
  ],
});

export default mongoose.model<NicknameRequestDocument, NicknameRequestModel>(
  "NicknameRequest",
  nicknameRequestSchema
);
