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
    password: { type: String, required: true },
    role: { type: String, enum: ["admin | user"], required: true },
    displayname: { type: String, required: false },
    bio: { type: String, required: false },
});

const user = model<User>("User", userSchema);

export default user;