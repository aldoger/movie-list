import { Document, Schema, SchemaTypes } from "mongoose";
import { Likes } from "./likes";
import { User } from "./user";
import { Film } from "./film";

export interface Review extends Document {
    user_id: User;
    movie_id: Film;
    rating: number;
    review: string;
    likes: Likes[];
}

const reviewSchema = new Schema<Review>({
    user_id: { type: SchemaTypes.ObjectId, ref: "User", required: true },
    movie_id: { type: SchemaTypes.ObjectId, ref: "Film", required: true },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 10, 
    },
    review: { type: String, required: true },
    likes: [{ type: SchemaTypes.ObjectId, ref: "Likes" }], 
});

export default reviewSchema;
