import React from 'react';

import { GoogleLogin } from 'react-google-login'

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
    let create_analogy = document.getElementById('create-analogy-container')
    if (login_button !== null && login_button !== undefined) {
      login_button.style.display = 'none'
    }
    if (logout_button !== null && logout_button !== undefined) {
      logout_button.style.display = 'block'
    }
    if (create_analogy !== null && create_analogy !== undefined) {
      create_analogy.style.display = 'block'
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
