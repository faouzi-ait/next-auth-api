import { Schema, model, models } from "mongoose";

export interface User {
  email: string;
  username: string;
  password: string;
}

const UserSchema = new Schema<User>(
  {
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const Users = models.User || model<User>("User", UserSchema);

export default Users;
