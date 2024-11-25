import { Document, Model } from "mongoose";

export interface NicknameRequestType {
  userId: string;
  messageId: string;
  nickname: string;
}

export interface NicknameRequestDocument
  extends NicknameRequestType,
    Document {}
export interface NicknameRequestModel extends Model<NicknameRequestDocument> {}
