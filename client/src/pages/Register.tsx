import axios from 'axios';
import React, { useState } from 'react';
import { DTO, IUser } from '../interfaces/DTO';

interface IRegister{
    setToken: (token:string) => void
    setUser: (user:IUser) =>void
}

  

const Register = ({setToken,setUser}:IRegister) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = (event: React.FormEvent) => {
    axios.post<DTO>(`${import.meta.env.VITE_BASEURL}/api/users/register`, {name, email,password}).then(res=> {setToken(res.data.content.token); if(res.data.user)setUser(res.data.user)});
console.log(import.meta.env.VITE_BASEURL);

    event.preventDefault();
    console.log('Registering with:', { name, email, password });
    
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
