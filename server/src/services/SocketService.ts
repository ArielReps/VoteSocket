import { Server } from "socket.io";
import { Server as HTTPServer } from "http";
import { GiveTokenGetUser } from "../utils/auth";
import Candidate from "../models/cadidateModel";
interface IVoteDTOin {
  token: string;
  cadidateId: string;
}

export function initializeSocketServer(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    socket.on("vote", async (data: IVoteDTOin) => {
      try {
        const user = await GiveTokenGetUser(data.token);
        const candidate = await Candidate.findById(data.cadidateId);
    
        if (!candidate || !user) {
          socket.emit("error", "Error setting up vote, user or candidate not found.");
          return;
        }
    
        const userIndex = candidate.voters.findIndex(voterId => String(voterId) === String(user._id));
    
        if (userIndex !== -1) {
          // If user ID is found, remove it from voters
          candidate.voters.splice(userIndex, 1);
          user.voteTo = null; // Optionally clear the user's `voteTo`
        } else {
          // If user ID is not found, add it to voters
          candidate.voters.push(user._id);
          user.voteTo = candidate._id;
        }
    
        await user.save();
        await candidate.save();
    
        const candidates = await Candidate.find({});
    
        // Send to all other users
        socket.broadcast.emit("updatedCandidates", { candidates });
    
        // Send to the sender (the user who triggered the vote event)
        socket.emit("updatedCandidates", { candidates });
    
      } catch (error) {
        console.error("Error processing vote:", error);
        socket.emit("error", "An error occurred while processing the vote.");
      }
    });
    
    socket.on("disconnect", (reason) => {
      console.log("A user disconnected", socket.id, "reason:", reason);
    });
  });

  return io;
}
