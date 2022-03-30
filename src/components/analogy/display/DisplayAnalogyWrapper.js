import React, { useState, useEffect } from 'react';

import { useLocation } from 'react-router-dom'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import './DisplayAnalogyWrapper.css'
import DisplayAnalogy from './DisplayAnalogy'

const DisplayAnalogyWrapper = ({ email }) => {

  let location = useLocation()
  const [analogyID, setAnalogyID] = useState("")
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { 
    let params = new URLSearchParams(location.search)
    setAnalogyID(params.get('id'))
  }, [location])

  return (
    <div className='display-analogy-wrapper-container'>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        {analogyID !== ""
        ?
            <DisplayAnalogy id={analogyID} email={email} showComments={true} setIsLoading={setIsLoading} />
        :
            <></>
        }
    </div>
  );
}

export default DisplayAnalogyWrapper;
