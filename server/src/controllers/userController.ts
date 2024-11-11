import { Request, Response } from "express";
import User from "../models/userModel";
import jwt from "jsonwebtoken";
import { DTO } from "../types/DTO";
export const login = async (req: any, res: Response): Promise<void> => {
  try{
  const { email, password } = req.body;
  // Find user by email and validate password
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    // Assume matchPassword is a method you created on the User model
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }

  // Create JWT token
  if(!user?._id)
  {
    throw new Error("Go fuck your _id")
  }
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  // Set token in cookies
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 hour
    sameSite: "none",
  });

  // Optional: Attach user info to the response
  const response :DTO ={
    user,
    auth:true,
    success:true,
    content: {token}
  }
  req.user = user; // If you want to attach user info to req during login
  res.status(200).json(response);
}
catch(err)
{
  res.status(500).json({message:err.message})
}
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    let { name, email, password } = req.body;
    if (password !== password.toString()) {
      throw new Error("go fuck yourself only string!");
    }
    const newUser = new User({
      name,
      email,
      password,
    });
    // Save user to the database
    await newUser.save();

    // Create JWT token
    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    // Set token in cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 hour
      sameSite: "none",
    });
    const responseDTO: DTO = {
      success: true,
      auth: true,
      content: {message:"User registered successfully", token},
      user: newUser,
    };
    res.status(201).json(responseDTO);
  } catch (error) {
    const responseDTO: DTO = {
      success: false,
      auth: false,
      content: error.message || "Error registering user",
    };
    res.status(400).json({ responseDTO });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    const responseDTO: DTO = {
      success: true,
      auth: true,
      content: users,
    };
    //  console.log(req.user)
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: "Failed to fetch users", error });
  }
};
