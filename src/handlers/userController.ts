import {  Request, Response } from "express";
import { userSignInDto } from "../dto/userSignIn.dto";
import { userLogInDto } from "../dto/userLogIn.dto";
import user from "../Model/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";
import { getUserProfileDto } from "../dto/getUserProfile.dto";
import review from "../Model/review";


export async function signIn(req: Request<any, any, userSignInDto>, res: Response) {
    const { email, username, password, role } = req.body;

    if(!email || !username || !password || !role){
        res.status(400).json(
            { msg: "Cannot send empty values." }
        );
        return;
    }

    try{

        const salt = bcrypt.genSaltSync(10);
        const hashpassword = bcrypt.hashSync(password, salt);

        const newUser = new user({
            email: email,
            username: username,
            password: hashpassword,
            role: role,
            displayname: null,
            bio: null,
        });

        const result = await newUser.save();

        if(result){
            res.status(200).json(
                { msg: "User created" }
            );
            return;
        }
    }catch(e: unknown){
        if (e instanceof Error) {
            console.error(e.message);
        } else {
            console.error("Unknown error", e);
        }
        res.status(500).json({ msg: "Something went wrong" });
        return;
    }
}

export async function logIn(req: Request<any, any, userLogInDto>, res: Response) {
    const { username, password } = req.body;

    if(!username || !password){
        res.status(400).json(
            { msg: "Cannot send empty values, please fill the username and password" }
        );
        return;
    }

    try{
        const User = await user.findOne({ username: username }).exec();

        if(User){
            const verifyPasword = bcrypt.compareSync(password, User.password);

            if(verifyPasword){

                const token = jwt.sign({username: User.username, role: User.role, userId: User._id}, process.env.SECRET_KEY as string, {
                    expiresIn: '1h',
                    algorithm: 'HS256',

                });

                res.status(200).header('Authorization', `Bearer ${token}`).json({ msg: "Authentication successful" });
                return;
            }else{
                res.status(400).json({ msg: "Incorrect password"});
                return;
            }
        }else{
            res.status(400).json({ msg: "User not found"});
        }
    }catch(e: unknown){
        if (e instanceof Error) {
            console.error(e.message);
        } else {
            console.error("Unknown error", e);
        }
        res.status(500).json({ msg: "Something went wrong" });
        return;
    }

}


export async function getUserById(req: Request, res: Response) {
    const id = (req as any).userId as ObjectId;

    try{
        const User = await user.findById(id);
        if(User){
            res.status(200).json( { User });
            return;
        }else{
            res.status(400).json({ msg: "Cannot found user"});
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


export async function getAllUser(req: Request, res: Response){
    try{
        const users = await user.find({}, '_id username displayname bio');

        if(users.length > 0){
            res.status(200).json({ users: users});
            return;
        }else{
            res.status(400).json({ msg: "No users found"});
            return;
        }
    }catch(e: unknown){
        if (e instanceof Error) {
            console.error(e.message);
          } else {
            console.error("Unknown error", e);
          }
          res.status(500).json({ msg: "Something went wrong" });
          return;
    }
}

export async function getUserProfile(req: Request<any, any, any, getUserProfileDto>, res: Response) {
    const userId = req.query.userId;

    try {
        const userProfile = await user.findOne({ _id: userId }).select('email username role displayname bio');

        const userReviews = await review.find({ user_id: userId })
            .populate({
                path: 'movie_id',
                select: 'title status total_episode'
            })
            .select('rating reviewText');

        if (userProfile) {
            if (userReviews.length > 0) {
                res.status(200).json({ userProfile, userReviews });
            } else {
                res.status(200).json({ userProfile, msg: "no reviews yet" });
            }
        } else {
            res.status(400).json({ msg: "Cannot find user" });
        }
    } catch (e: unknown) {
        if (e instanceof Error) {
            console.error(e.message);
        } else {
            console.error("Unknown error", e);
        }
        res.status(500).json({ msg: "Something went wrong" });
    }
}
