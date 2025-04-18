import { ObjectId } from "mongoose";

export interface addFilmToListDto {
    movie_id: ObjectId;
    status: "plan_to_watch" | "watching" | "completed" | "on_hold" | "dropped";
}