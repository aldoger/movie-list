import { ObjectId } from "mongoose";


export interface editReviewDto {
    movie_list_id: ObjectId;
    rating: number;
    reviewText: string;
}