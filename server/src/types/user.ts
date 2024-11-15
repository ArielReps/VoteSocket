import { Document, ObjectId } from 'mongoose';

export interface IUser extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  voteTo: ObjectId | null;
  matchPassword(enteredPassword: string): Promise<boolean>; 
}