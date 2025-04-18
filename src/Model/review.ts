import { Document, Schema, SchemaTypes } from "mongoose";
import { Likes } from "./likes";
import { User } from "./user";
import { Film_List } from "./film_list";

export interface Review extends Document {
    user_id: User;
    movie_list_id: Film_List;
    rating: number;
    review: string;
    likes: Likes[];
}

const reviewSchema = new Schema<Review>({
    user_id: { type: SchemaTypes.ObjectId, ref: "User", required: true },
    movie_list_id: { type: SchemaTypes.ObjectId, ref: "Film-List", required: true },
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
