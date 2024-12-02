import { Document, Model } from "mongoose";

export interface ExemptedUsersType {
  userId: string;
  expiration: Date;
}

export interface ExemptedUsersDocument extends ExemptedUsersType, Document {}
export interface ExemptedUsersModel extends Model<ExemptedUsersDocument> {}
