import { Document, model, Schema } from "mongoose";


export interface Genre extends Document {
    genre: string;
}

const genreSchema = new Schema<Genre>({
    genre: { type: String, required: true, unique: true }
});

const genre = model<Genre>("Genre", genreSchema);

export default genre;