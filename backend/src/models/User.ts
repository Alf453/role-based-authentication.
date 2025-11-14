import { Schema, model, Document } from "mongoose";

export type Role = "User" | "Admin";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  toClient(): { id: string; name: string; email: string; role: Role };
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["User", "Admin"], default: "User" },
  },
  { timestamps: true }
);

userSchema.method("toClient", function thisToClient() {
  return {
    id: String(this._id),
    name: this.name,
    email: this.email,
    role: this.role,
  };
});

export default model<IUser>("User", userSchema);
