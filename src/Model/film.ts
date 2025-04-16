import { Genre } from "./genre";
import { Document, Schema, SchemaTypes, model } from "mongoose";

export interface Film extends Document {
    title: string;
    synopsis: string;
    images: string[];
    genres: Genre[];
    status: "not_yet_aired" | "airing" | "finished_airing";
    total_episode: number;
    release_date: Date;
}

const filmSchema = new Schema<Film>({
    title: { type: String, required: true, unique: true },
    synopsis: { type: String, required: true },
    images: [{ type: String }],
    genres: [{ type: SchemaTypes.ObjectId, ref: 'Genre' }],
    status: { type: String, enum: ["not_yet_aired", "airing", "finished_airing"], required: true },
    total_episode: { type: Number, required: true },
    release_date: { type: Date, required: true, immutable: true },
});


const film = model<Film>("Film", filmSchema);

export default film;
