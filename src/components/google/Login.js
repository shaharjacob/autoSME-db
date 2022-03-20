import React from 'react';

import { GoogleLogin } from 'react-google-login'
import LoginIcon from '@mui/icons-material/Login';
import IconButton from '@mui/material/IconButton';

import { refreshTokenSetup } from './RefreshToken'
import './Login.css'

const clientId = `${process.env.REACT_APP_GOOGLE_CLIENT_ID}.apps.googleusercontent.com`


const Login = ( {setUser, setEmail} ) => {

  const onSuccess = (res) => {
    setUser(res.profileObj.name)
    setEmail(res.profileObj.email)
    localStorage.setItem("user", res.profileObj.name)
    localStorage.setItem("email", res.profileObj.email)
    // set localStorage here
    console.log(`[Login success] currentUser: ${res.profileObj.email}`);
    let login_button = document.getElementById('google-login-button')
    let logout_button = document.getElementById('google-logout-button')

    if (login_button !== null && login_button !== undefined) {
      login_button.style.display = 'none'
    }
    if (logout_button !== null && logout_button !== undefined) {
      logout_button.style.display = 'block'
    }
    refreshTokenSetup(res);
  };

  const onFailure = (res) => {
    console.log(`[Login failed] error: ${res.error}`);
    console.log(`[Login failed] details: ${res.details}`);
  };

  return (
    <div id='google-login-button'>
      <GoogleLogin 
        clientId={clientId}
        render={renderProps => (
          <IconButton 
            sx={{flexDirection: 'column'}}
            onClick={renderProps.onClick}
          >
            <LoginIcon sx={{color: '#0c6e11'}} />
            <span className="login-logout-text">Login</span>
          </IconButton>
        )}
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        isSignedIn={true}
      />
    </div>
  );
}

export default Login;
