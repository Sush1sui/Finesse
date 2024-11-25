import { Document, Model } from "mongoose";

export interface ColorTransitionType {
  colorIndex: number;
}

export interface ColorTransitionDocument
  extends ColorTransitionType,
    Document {}
export interface ColorTransitionModel extends Model<ColorTransitionDocument> {}
