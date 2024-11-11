import User from "../models/userModel"
import { IUser } from "../types/user";
import { Request,Response,NextFunction } from "express";
import jwt, {JwtPayload} from 'jsonwebtoken';
export const generateToken = (user: IUser) => {
    return jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};


export const AuthUserByToken =async (req: any, res: Response, next: NextFunction): Promise<void>=> {
    const token = req.cookies.token; // Get token from cookie
    console.log("Recieved from user token ",token)

    if (!token) {
     res.status(401).json({ message: 'Not authorized, no token' });
     return;
    }

    try {
        // Verify token
        const decoded:any = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = await User.findById(decoded._id); // Attach user information to request object
        console.log(req.user)
        next();
    } catch (error) {
         res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

export const GiveTokenGetUser = async(token:string): Promise<IUser> =>{
    try {
        // Verify token
        const decoded:any = jwt.verify(token, process.env.JWT_SECRET!);
        return await User.findById(decoded._id); 
    } catch (error) {
       console.error(error.message)
       return;
    }
}