import { Request, Response } from "express";
import { editProfileDto } from "../dto/editProfil.dto";
import user from "../Model/user";
import { ObjectId } from "mongoose";
import jwt from "jsonwebtoken";


export async function editProfile(req: Request<any, any, editProfileDto>, res: Response) {
    const { bio, display_name, username } = req.body;
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({ msg: "No authorization header provided" });
    }
  
  
    const token = authHeader.split(' ')[1];

    try{

        const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as { userId: ObjectId };
        
        if (!decoded || !decoded.userId) {
          return res.status(401).json({ msg: "Invalid token or userId" });
        }
        
        const id = decoded.userId;
        const User = await user.findById(id).exec();

        if(User){
            User.bio = bio;
            User.displayname = display_name;
            User.username = username;

            User.save();

            res.status(200).json({ msg: "Succesfully change user profile"});
            return;
        }else{
            res.status(400).json({ msg: "Cannot change user profile"});
        }
    }catch (e: unknown) {
        if (e instanceof Error) {
          console.error(e.message);
        } else {
          console.error("Unknown error", e);
        }
        res.status(500).json({ msg: "Something went wrong" });
        return;
      }
}