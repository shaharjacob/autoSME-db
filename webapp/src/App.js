import React, { useState } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom'

import './App.css'
import Main from './components/main/Main'
import Navbar from './components/navbar/Navbar'
import Background from './components/background/Background';


const App = () => {

  const [user, setUser] = useState("Guest")
  const [email, setEmail] = useState("")

  return (
    <BrowserRouter>
      <div className='container'>
        <Navbar user={user} setUser={setUser} setEmail={setEmail} />
        <div className='content'>
          <Background />
          <Routes>
            <Route path='/' element={<Main email={email} />} />
          </Routes>
          <Background />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
