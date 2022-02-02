import React, { useState } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom'

import './App.css'
import About from './components/about/About'
import Navbar from './components/navbar/Navbar'
import Background from './components/background/Background';
import RandomAnalogy from './components/random/RandomAnalogy';
import DisplayAnalogy from './components/analogy/DisplayAnalogy';
import DisplayDataset from './components/analogy/DisplayDataset';


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
            <Route path='/' element={<About email={email} />} />
            <Route path='/about' element={<About email={email} />} />
            <Route path='/random' element={<RandomAnalogy email={email} />} />
            <Route path='/analogy' element={<DisplayAnalogy email={email} />} />
            <Route path='/dataset' element={<DisplayDataset email={email} />} />
          </Routes>
          <Background />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
