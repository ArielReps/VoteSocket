import React, { useEffect, useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import { useSocket } from './services/useSocket';
import { DTO, IUser } from './interfaces/DTO';
import axios from 'axios';
import { ICandidate } from './interfaces/ICandidate';
const App = () => {
  const {
    connected,
    messages,
    room,
    candidates,
    joinRoom,
    leaveRoom,
    sendMessageToRoom,
    Vote,
    setToken,
    setCandidates,
    sendRequest,
  } = useSocket();
  const [user,setUser] = useState<IUser>();
  useEffect(() => {
    console.log("Request URL:", `${import.meta.env.VITE_BASEURL}/api/candidates/`);

    axios.get<DTO>(`${import.meta.env.VITE_BASEURL}/api/candidates/`)
      .then(res => {
        setCandidates(res.data.content.candidates);
        console.log("candidates", res.data.content.candidates);
      })
      .catch(err => console.error("Error fetching candidates:", err));
  }, []);
  return (
    <div>
      <h1>Welcome to the App</h1>
      <div>
        <Login setToken={setToken} setUser={setUser}/>
      </div>
      <div>
        <Register  setToken={setToken} setUser={setUser}/>
      </div>
      {candidates.map((element:ICandidate, index:number) => (
        <div key={index}>
          <h1>{element.name}</h1>
          <img src={element.image} alt={element.name} />
          <h3>Votes: {element.voters.length}</h3>
          <button 
  className={`${element.voters.find((voterId) => voterId === user?._id) ? 'voted' : ''}`} 
  onClick={() => {Vote(element._id)}}
>
  VOTE
</button>
        </div>
      ))}
    </div>
  );
};

export default App;
