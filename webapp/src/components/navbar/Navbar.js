import React from 'react';

import Login from '../google/Login'
import Logout from '../google/Logout'
import Logo from '../../assets/hyadata.png'
import './Navbar.css'

const Navbar = ( { user, setUser, setEmail } ) => {

  return (
    <div className='navbar-container'>
        <div className='left-side'>
          <img src={Logo} className='logo' alt="hyadata lab" />
        </div>
        <div></div>
        <div className='right-side'>
          <span className='hello-user'>
            {user}
          </span>
          <Login setUser={setUser} setEmail={setEmail} />
          <Logout setUser={setUser} setEmail={setEmail} />
        </div>
    </div>
  );
}

export default Navbar;
