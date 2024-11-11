import React, { useState } from 'react';
import { DTO, IUser } from '../interfaces/DTO';
import axios from 'axios';
interface ILogin{
    setToken: (token:string) => void
    setUser: (user:IUser)=> void
}

const Login = ({setToken,setUser}:ILogin) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(import.meta.env.VITE_BASEURL)
    axios.post<DTO>(`${import.meta.env.VITE_BASEURL}/api/users/login`, {email,password}).then(res=> {console.log(res.data.content.token);setToken(res.data.content.token); if(res.data.user)setUser(res.data.user)});

  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
