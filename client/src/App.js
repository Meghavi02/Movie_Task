import React, { useState } from 'react';
import Home from './components/Home';
import AddMovie from './components/AddMovie';
import LoginModal from './components/LoginModal';

export default function App(){
  const [page, setPage] = useState('home');
  const [showLogin, setShowLogin] = useState(false);
  return (
    <>
      <Home onAdd={()=> setPage('add')} onOpenLogin={()=> setShowLogin(true)} />
      {page==='add' && <AddMovie onBack={()=> setPage('home')} />}
      {showLogin && <LoginModal onClose={()=> setShowLogin(false)} />}
    </>
  );
}
