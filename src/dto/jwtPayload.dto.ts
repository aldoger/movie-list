import { ObjectId } from "mongoose";

export interface JWTPayload {
    userId: ObjectId;
    username: string;
    role: string;
}