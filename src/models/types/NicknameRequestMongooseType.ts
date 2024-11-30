import { Document, Model } from "mongoose";

export interface NicknameRequestType {
  userId: string;
  userMessageId: string;
  channelId: string;
  messageId: string;
  nickname: string;
  reactions: [
    {
      emoji: string;
    }
  ];
}

export interface NicknameRequestDocument
  extends NicknameRequestType,
    Document {}
export interface NicknameRequestModel extends Model<NicknameRequestDocument> {}
