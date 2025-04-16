import { Document, model, Schema, SchemaTypes } from "mongoose";
import { User } from "./user";

export interface Likes extends Document {
    user_id: User;
    status: "like" | "dislike";
}

const likesSchema = new Schema<Likes>({
    user_id: { type: SchemaTypes.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["like", "dislike"], required: true },
});

const likes = model<Likes>("Likes", likesSchema);

export default likes;

