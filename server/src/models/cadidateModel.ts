import mongoose, { Schema, Document } from 'mongoose';
import { ICandidate } from '../types/cadidate';

const candidateSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    voters: {
        type: [mongoose.Types.ObjectId],
        required: false,
        default: [],
    },
}, { timestamps: true });


export default mongoose.model<ICandidate>('Candidate', candidateSchema);
