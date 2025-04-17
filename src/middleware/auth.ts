import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWTPayload } from "../dto/jwtPayload.dto";


export function roleAdminCheck(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        res.status(401).json({ message: "No authorization header provided" });
        return;
    }

    const token = authHeader.split(' ')[1]; 

    console.log("Extracted token:", token);

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as JWTPayload;

        console.log("Username:", decoded.username);
        console.log("Role:", decoded.role);

        if(decoded.role == "admin"){
            next();
        }else{
            res.status(401).json({ msg: "Unauthorized"});
        }
    } catch (err) {
        res.status(403).json({ message: "Invalid token" });
        return;
    }

}

export function roleUserCheck(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        res.status(401).json({ message: "No authorization header provided" });
        return;
    }

    const token = authHeader.split(' ')[1]; 

    console.log("Extracted token:", token);

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as JWTPayload;

        console.log("Username:", decoded.username);
        console.log("Role:", decoded.role);

        if(decoded.role == "admin" || decoded.role == "user"){
            next();
        }else{
            res.status(401).json({ msg: "Unauthorized"});
        }
    } catch (err) {
        res.status(403).json({ message: "Invalid token" });
        return;
    }
}