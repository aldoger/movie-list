import { Document, model, Schema, SchemaTypes } from "mongoose";
import { User } from "./user";
import { Film } from "./film";

export interface Film_List extends Document {
    movie_id: Film;
    user_id: User;
    status: "plan_to_watch" | "watching" | "completed" | "on_hold" | "dropped";
    visibility: "public" | "private";
}

const filmListSchema = new Schema<Film_List>({
    user_id: { type: SchemaTypes.ObjectId, ref: "User", required: true },
    movie_id: { type: SchemaTypes.ObjectId, ref: "Film", required: true },
    status: { type: String, enum: ["plan_to_watch", "watching", "completed", "on_hold", "dropped"] },
    visibility: { type: String, enum: ["public", "private"], default: "public" },
});

const filmList = model<Film_List>("Film-List", filmListSchema);

export default filmList;