import React, { useState, useEffect } from 'react';

import { useLocation } from 'react-router-dom'

import './EditAnalogyWrapper.css'
import EditAnalogy from './EditAnalogy';

const EditAnalogyWrapper = ({ email }) => {

  let location = useLocation()
  const [analogyID, setAnalogyID] = useState("")

  useEffect(() => { 
    let params = new URLSearchParams(location.search)
    setAnalogyID(params.get('id'))
  }, [location])

  return (
    <div className='edit-analogy-wrapper-container'>
        {email === "" || email === null || email === undefined
        ?
            <div className='login-first'>
                You should login first
            </div>
        :
            <EditAnalogy id={analogyID} email={email} />
        }
    </div>
  );
}

export default EditAnalogyWrapper;
