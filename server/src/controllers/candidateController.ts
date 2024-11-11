import { DTO } from "../types/DTO";
import Candidate from "../models/cadidateModel";
import { Response, response } from "express";

export const getCandidates = async (req: any, res: Response): Promise<void> => {
    try{
        const response :DTO ={
            auth:false,
            success:true,
            content:{
                candidates: await Candidate.find({})
            }
            
        }
        res.status(200).json(response)
        
    }catch(error)
    {
        res.status(500).json(response || {content:{message:error.message}})
    }
  };
  