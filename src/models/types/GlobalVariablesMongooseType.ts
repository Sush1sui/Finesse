import { Document, Model } from "mongoose";

export interface GlobalVariablesType {
    stickyMessage: string | null;
}

export interface GlobalVariablesDocument
    extends GlobalVariablesType,
        Document {}
export interface GlobalVariablesModel extends Model<GlobalVariablesDocument> {}
