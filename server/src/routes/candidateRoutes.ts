import express from 'express';
import { getCandidates } from '../controllers/candidateController';


const router = express.Router();

router.route('/').get(getCandidates)
export default router;
