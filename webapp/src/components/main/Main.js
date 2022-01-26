import React, { useState } from 'react';

import './Main.css'
import Login from '../google/Login'
import Logout from '../google/Logout'
import CreateAnalogy from '../analogy/CreateAnalogy';

const Main = () => {
    const [user, setUser] = useState("Guest")
    const [email, setEmail] = useState("")
    
    return (
        <div className='main-container'>
            <span className='welcome-message'>Hello {user}</span>
            <Login setUser={setUser} setEmail={setEmail} />
            <Logout setUser={setUser} setEmail={setEmail} />
            <CreateAnalogy email={email} />
        </div>
    );
}

export default Main;
