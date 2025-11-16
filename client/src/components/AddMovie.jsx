import React, { useState } from 'react';
import api from '../utils/api';

export default function AddMovie({ onBack }) {
  const [title,setTitle] = useState('');
  const [director,setDirector] = useState('');
  const [releaseDate,setReleaseDate] = useState('');
  const [file,setFile] = useState(null);
  const [msg,setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) { setMsg('Please login first'); return; }
    const form = new FormData();
    form.append('title', title);
    form.append('director', director);
    form.append('releaseDate', releaseDate);
    if (file) form.append('poster', file);

    try {
      await api.post('/movies', form, { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }});
      setMsg('Movie added');
      setTimeout(()=> window.location='/', 800);
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Error');
    }
  };

  return (
    <div style={{padding:20, color:'#fff'}}>
      <button className="small-btn" onClick={()=> window.location='/'}>Back</button>
      <h2>Add Movie</h2>
      <form onSubmit={submit}>
        <div className="field"><input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required /></div>
        <div className="field"><input placeholder="Director" value={director} onChange={e=>setDirector(e.target.value)} /></div>
        <div className="field"><input type="date" value={releaseDate} onChange={e=>setReleaseDate(e.target.value)} /></div>
        <div className="field"><input type="file" onChange={e=>setFile(e.target.files[0])} /></div>
        <div style={{marginTop:10}}><button className="small-btn" type="submit">Submit</button></div>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}
