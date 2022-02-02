import React, { useState, useEffect } from 'react';

import { useLocation } from 'react-router-dom'

import './CreateAnalogyWrapper.css'
import DisplayAnalogy from './DisplayAnalogy'

const DisplayAnalogyWrapper = ({ email }) => {

  let location = useLocation()
  const [analogyID, setAnalogyID] = useState("")

  useEffect(() => { 
    let params = new URLSearchParams(location.search)
    setAnalogyID(params.get('id'))
  }, [email, location])

  return (
    <div className='create-analogy-wrapper-container'>
        {analogyID !== ""
        ?
            <DisplayAnalogy id={analogyID} email={email} />
        :
            <></>
        }
    </div>
  );
}

export default DisplayAnalogyWrapper;
