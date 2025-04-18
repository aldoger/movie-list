import { Document, model, ObjectId, Schema, SchemaTypes } from "mongoose";
import { User } from "./user";
import { Film_List } from "./film_list";
import { Film } from "./film";


export interface Likes {
    user_id: ObjectId;
    status: "like" | "dislike";
}


export interface Review extends Document {
    user_id: User;
    movie_list_id: Film_List;
    movie_id: Film;
    rating: number;
    reviewText: string;
    likes: Likes[];
}

const reviewSchema = new Schema<Review>({
    user_id: { type: SchemaTypes.ObjectId, ref: "User", required: true },
    movie_list_id: { type: SchemaTypes.ObjectId, ref: "Film-List", required: true },
    movie_id: { type: Schema.ObjectId, ref: "Film", required: true },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 10, 
    },
    reviewText: { type: String, required: true },
    likes: {
        type: [
            {
                user_id: { type: SchemaTypes.ObjectId, required: true },
                status: { type: String, enum: ["like", "dislike"], required: true },
            },
        ],
        default: [],
    }
});

const review = model<Review>("Review", reviewSchema);

export default review;
