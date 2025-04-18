import { ObjectId } from "mongoose";

export interface likeReviewDto{
    review_id: ObjectId;
    status: "like" | "dislike";
}