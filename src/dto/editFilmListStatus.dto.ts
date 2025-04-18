import { ObjectId } from "mongoose";


export interface editFilmListStatusDto {
    movie_list_id: ObjectId;
    status: "plan_to_watch" | "watching" | "completed" | "on_hold" | "dropped";
    visibilty: "public" | "private";
}