import mongoose from "mongoose";
import {
  ExemptedUsersDocument,
  ExemptedUsersModel,
} from "./types/ExemptedUsersMongooseType";

const exemptedSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  expiration: {
    type: Number,
    required: true,
  },
});

exemptedSchema.index({ expiration: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<ExemptedUsersDocument, ExemptedUsersModel>(
  "ExemptedModel",
  exemptedSchema
);
