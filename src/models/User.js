import { model, Schema } from "mongoose";

export const UserSchema = new Schema({
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const UserModel = model("auth", UserSchema);
