import React from 'react';

import { GoogleLogout } from 'react-google-login'

import './Logout.css'

const clientId = `${process.env.REACT_APP_GOOGLE_CLIENT_ID}.apps.googleusercontent.com`


const Logout = ( {setUser, setEmail} ) => {

  const onSuccess = () => {
    setUser("Guest")
    setEmail("")
    // set localStorage here
    console.log('Logout made successfully!');
    let login_button = document.getElementById('google-login-button')
    let logout_button = document.getElementById('google-logout-button')
    let create_analogy = document.getElementById('create-analogy-container')
    if (login_button !== null && login_button !== undefined) {
      login_button.style.display = 'block'
    }
    if (logout_button !== null && logout_button !== undefined) {
      logout_button.style.display = 'none'
    }
    if (create_analogy !== null && create_analogy !== undefined) {
      create_analogy.style.display = 'none'
    }
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
