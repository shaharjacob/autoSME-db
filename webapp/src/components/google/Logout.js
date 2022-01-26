import React from 'react';

import { GoogleLogout } from 'react-google-login'

import './Logout.css'

const clientId = `${process.env.REACT_APP_GOOGLE_CLIENT_ID}.apps.googleusercontent.com`


const Logout = ( {setUser, setEmail} ) => {

  const onSuccess = () => {
    setUser("Guest")
    setEmail("")
    console.log('Logout made successfully!');
    document.getElementById('google-logout-button').style.display = 'none'
    document.getElementById('create-analogy-container').style.display = 'none'
    document.getElementById('google-login-button').style.display = 'block'
  };

  return (
    <div id='google-logout-button'>
      <GoogleLogout 
        clientId={clientId}
        buttonText="Logout"
        onLogoutSuccess={onSuccess}
      />
    </div>
  );
}

export default Logout;
