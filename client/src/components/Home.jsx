import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function Home({ onAdd, onOpenLogin }) {
  const [movies, setMovies] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    api.get('/movies')
       .then(res => setMovies(res.data))
       .catch(err => console.error("MOVIE FETCH ERROR:", err));
  }, []);

  // LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload(); // refresh to update UI
  };

  // DELETE FUNCTION
  const handleDelete = async (movieId) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;
    
    try {
      await api.delete(`/movies/${movieId}`);
      setMovies(movies.filter(m => m._id !== movieId));
    } catch (err) {
      console.error("DELETE ERROR:", err);
      alert(err.response?.data?.msg || 'Failed to delete movie');
    }
  };

  return (
    <div>
      <header className="header">
        <div className="brand">MyStream</div>

        <div className="buttons">
          {user && (
            <div style={{ color: '#ddd', marginRight: '10px' }}>
              Hi, {user.name}
            </div>
          )}

          {/* Login or Add Movie */}
          <button className="btn" onClick={user ? onAdd : onOpenLogin}>
            {user ? 'Add Movie' : 'Login'}
          </button>

          {/* Logout button only if logged in */}
          {user && (
            <button className="btn" style={{ marginLeft: '10px' }} onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </header>

      <div className="hero">
        <div className="hero-text">
          <h1>Welcome, {user ? user.name : 'Guest'}!</h1>
          <p>Discover movies. Add and manage movies (login required).</p>
        </div>
      </div>

      <main className="container">
        <h3 className="section-title">Trending</h3>
        <div className="grid">
          {movies.map(m => (
            <div className="card" key={m._id}>
              <img
                className="poster"
                src={
                  m.posterUrl
                    ? `http://localhost:5001${m.posterUrl}`
                    : `https://picsum.photos/400/600?random=${m._id}`
                }
                alt={m.title}
              />
              <div className="card-body">
                <h4>{m.title}</h4>
                <div className="meta">
                  Year: {m.releaseDate ? new Date(m.releaseDate).getFullYear() : 'N/A'} •
                  Director: {m.director || 'N/A'}
                </div>
                {
                  user && m.createdBy && m.createdBy._id  === user._id &&(
                    <button
                      className='small-btn'
                      style={{
                        marginTop: '10px',
                        backgroundColor: '#dc3545',
                        width: '100%'
                      }}
                      onClick={() => handleDelete(m._id)}
                    >
                      Delete
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
