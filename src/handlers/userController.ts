import { Request, Response } from "express";
import { userSignInDto } from "../dto/userSignIn.dto";
import { userLogInDto } from "../dto/userLogIn.dto";
import user from "../Model/user";


export async function signIn(req: Request<any, any, userSignInDto>, res: Response) {
    const { email, username, password, role } = req.body;

    if(!email || !username || !password || !role){
        res.status(400).json(
            { msg: "Cannot send empty values." }
        );
        return;
    }

    try{
        const newUser = new user({
            email: email,
            username: username,
            password: password,
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

    }catch(e: unknown){

    }

}

