import { Document, model, Schema } from "mongoose";

export interface User extends Document {
    email: string;
    username: string;
    password: string;
    role: "admin" | "user";
    displayname: string | null;
    bio: string | null
}

const userSchema = new Schema<User>({
    email: { type: String, required: true, immutable: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], required: true, default: "user" },
    displayname: { type: String, required: false, default: null },
    bio: { type: String, required: false, default: null },
});

const user = model<User>("User", userSchema);

export default user;