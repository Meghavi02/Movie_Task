import React, { useState } from 'react';
import api from '../utils/api';

export default function LoginModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  // const login = async () => {
  //   try {
  //     const res = await axios.post("http://localhost:5001/api/auth/login", { email, password });
  //     localStorage.setItem('token', res.data.token);
  //     localStorage.setItem('user', JSON.stringify(res.data.user));
  //     window.location.reload();
  //   } catch (err) {
  //     setMsg(err.response?.data?.msg || 'Login failed');
  //   }
  // };
  const login = () => {
  api.post("/auth/login", { email, password })
    .then(res => {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.reload();
    })
    .catch(err => {
      console.error("LOGIN ERROR:", err?.response?.data || err?.message || err);
      // setError("Login failed");
      setMsg(err.response?.data?.msg || "Login failed");
    });
};


  return (
    <div className="login-modal">
      <div className="modal-card">
        <h3>Login</h3>
        <div className="field"><input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div className="field"><input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <div style={{display:'flex', justifyContent:'flex-end'}}>
          <button className="small-btn" onClick={onClose}>Close</button>
          <button className="small-btn" onClick={login} style={{marginLeft:8}}>Login</button>
        </div>
        {msg && <p style={{color:'red'}}>{msg}</p>}
      </div>
    </div>
  );
}
