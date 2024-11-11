import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { ICandidate } from "../interfaces/ICandidate";
import axios from "axios";
import { DTO } from "../interfaces/DTO";

const SERVER_URL = import.meta.env.VITE_BASEURL;

type CallbackResponse = { status: string };
type Message = string | Record<string, any>;

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [token, setToken] = useState<string>("");
  const [candidates, setCandidates] = useState<ICandidate[]>([]);
  const [room, setRoom] = useState<string>("");
  useEffect(() => {
    const socketInstance = io(SERVER_URL);
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Connected:", socketInstance.id);
      setConnected(true);
    });

    socketInstance.on("disconnect", (reason: string) => {
      console.log("Disconnected:", reason);
      setConnected(false);
    });

    socketInstance.on(
      "updatedCandidates",
      (updatedCandidates: { message: string; candidates: ICandidate[] }) => {
        console.log(updatedCandidates);
        setCandidates(updatedCandidates.candidates);
      }
    );
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  function joinRoom(room: string) {
    if (socket) {
      socket.emit("join", room);
      setRoom(room); // Update the current room state
      console.log(`Joining room: ${room}`);
      setMessages([]); // clean the messages
    }
  }

  function leaveRoom(room: string) {
    if (socket) {
      socket.emit("leave", room);
      setRoom(""); // Reset room state when leaving
      console.log(`Leaving room: ${room}`);
      setMessages([]); // clean the messages
    }
  }

  function sendMessageToRoom(message: Message) {
    if (socket && room) {
      socket.emit("message-to-room", room, message);
      console.log(`Sending message to room ${room}:`, message);
    }
  }

  function Vote(cadidateId: string) {
    if (socket) {
      if (token) {
        socket.emit("vote", { cadidateId, token });
      } else alert("Token not verified! Please log in");
    }
  }

  function sendRequest(
    data: Message,
    callback: (response: CallbackResponse) => void
  ) {
    if (socket) {
      socket.emit("request", data, (response: CallbackResponse) => {
        console.log("Request response:", response);
        callback(response);
      });
    }
  }

  return {
    connected,
    messages,
    room,
    candidates,
    joinRoom,
    leaveRoom,
    sendMessageToRoom,
    Vote,
    setCandidates,
    setToken,
    sendRequest,
  };
}
