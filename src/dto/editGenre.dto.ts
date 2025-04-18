import { ObjectId } from "mongoose";


export interface editGenreDto {
    genreId: ObjectId;
    genre: string;
}