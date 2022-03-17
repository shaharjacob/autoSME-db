import React, { useState, useEffect } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom'

import './App.css'
import About from './components/about/About'
import Navbar from './components/navbar/Navbar'
import Background from './components/background/Background';
import RandomAnalogy from './components/random/RandomAnalogy';
import DisplayDataset from './components/dataset//DisplayDataset';
import DownloadPage from './components/download//DownloadPage';
import CreateAnalogyWrapper from './components/analogy/create/CreateAnalogyWrapper';
import DisplayAnalogyWrapper from './components/analogy/display/DisplayAnalogyWrapper';

const App = () => {

  const [user, setUser] = useState("Guest")
  const [email, setEmail] = useState("")

  useEffect(() => { 
    let user_ = localStorage.getItem("user")
    let email_ = localStorage.getItem("email")
    if (user_ && email_) {
      setUser(user_)
      setEmail(email_)
    }
  }, [])
  // useState with localStorage here...

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
            <Route path='/analogy' element={<DisplayAnalogyWrapper email={email} />} />
            <Route path='/dataset' element={<DisplayDataset email={email} />} />
            <Route path='/create' element={<CreateAnalogyWrapper email={email} />} />
            <Route path='/download' element={<DownloadPage email={email} />} />
          </Routes>
          <Background />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
