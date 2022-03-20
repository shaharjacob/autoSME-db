import React from 'react';

import { GoogleLogout } from 'react-google-login'
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';

import './Logout.css'
import './Login.css'

const clientId = `${process.env.REACT_APP_GOOGLE_CLIENT_ID}.apps.googleusercontent.com`


const Logout = ( {setUser, setEmail} ) => {

  const onSuccess = () => {
    setUser("Guest")
    setEmail("")
    localStorage.clear()
    console.log('Logout made successfully!');
    let login_button = document.getElementById('google-login-button')
    let logout_button = document.getElementById('google-logout-button')
    if (login_button !== null && login_button !== undefined) {
      login_button.style.display = 'block'
    }
    if (logout_button !== null && logout_button !== undefined) {
      logout_button.style.display = 'none'
    }
  };

  return (
    <div id='google-logout-button'>
      <GoogleLogout 
        clientId={clientId}
        render={renderProps => (
          <IconButton 
            sx={{flexDirection: 'column'}}
            onClick={renderProps.onClick}
          >
            <LogoutIcon sx={{color: '#9b1515'}} />
            <span className="login-logout-text">Logout</span>
          </IconButton>
        )}
        onLogoutSuccess={onSuccess}
      />
    </div>
  );
}

export default Logout;
