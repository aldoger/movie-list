import { Document, model, Schema, SchemaTypes } from "mongoose";
import { User } from "./user";
import { Film } from "./film";

export interface Film_List extends Document {
    movie_id: User;
    user_id: Film;
    status: "plan_to_watch" | "watching" | "completed" | "on_hold" | "dropped";
}

const filmListSchema = new Schema<Film_List>({
    user_id: { type: SchemaTypes.ObjectId, ref: "User", required: true },
    movie_id: { type: SchemaTypes.ObjectId, ref: "Film", required: true },
    status: { type: String, enum: ["plan_to_watch", "watching", "completed", "on_hold", "dropped"] }
});

const filmList = model<Film_List>("film-list", filmListSchema);

export default filmList;