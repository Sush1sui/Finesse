import { Document, Model } from "mongoose";

export interface StickyMessageType {
    stickyMessage: string;
}

export interface StickyMessageDocument extends StickyMessageType, Document {}
export interface StickyMessageModel extends Model<StickyMessageDocument> {}
