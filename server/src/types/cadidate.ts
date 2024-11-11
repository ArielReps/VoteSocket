import { Document, ObjectId } from 'mongoose';

export interface ICandidate extends Document {
  _id: ObjectId;
  name: string;
  image: string;
  voters: ObjectId[];
}
