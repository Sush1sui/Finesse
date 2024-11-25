import mongoose, { Schema } from "mongoose";
import {
  ColorTransitionDocument,
  ColorTransitionModel,
} from "./types/ColorTransitionMongooseType";

const colorTransitionSchema = new Schema({
  colorIndex: {
    type: Number,
    required: true,
    default: 0, // Start at index 0 (pink color)
  },
});

const ColorTransition = mongoose.model<
  ColorTransitionDocument,
  ColorTransitionModel
>("ColorTransition", colorTransitionSchema);

export default ColorTransition;
