import React from 'react';

import { GoogleLogin } from 'react-google-login'

import { refreshTokenSetup } from './RefreshToken'
import './Login.css'

const clientId = `${process.env.REACT_APP_GOOGLE_CLIENT_ID}.apps.googleusercontent.com`


const Login = ( {setUser, setEmail} ) => {

  const onSuccess = (res) => {
    setUser(res.profileObj.name)
    setEmail(res.profileObj.email)
    console.log(`[Login success] currentUser: ${res.profileObj.email}`);
    document.getElementById('google-login-button').style.display = 'none'
    document.getElementById('google-logout-button').style.display = 'block'
    document.getElementById('create-analogy-container').style.display = 'block'
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
        buttonText='Login'
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        isSignedIn={true}
      />
    </div>
  );
}

export default Login;
