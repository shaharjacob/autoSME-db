import React, { useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import CircularProgress from '@mui/material/CircularProgress'

import './RandomAnalogy.css'
import DisplayAnalogy from '../analogy/display/DisplayAnalogy'
import { firebase  } from '../firebase/InitFirebase';

const db = firebase.database()

const RandomAnalogy = ({ email }) => {

  const [analogyID, setAnalogyID] = useState(null)
  const analogiesRef = db.ref(`analogies`);
  const [isLoading, setIsLoading] = useState(true);

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function generate() {
    async function fetchDatabase() {
      let dataset = await analogiesRef.once('value');
      let snapshot =  dataset.val();
      let numOfAnalogies = Object.keys(snapshot).length;
      let randomIndex = getRandomInt(numOfAnalogies);
      let i = 0;
      for (let key in snapshot) {
        if (i === randomIndex) {
          setAnalogyID(key)
          break;
        }
        i++;
      }
      setIsLoading(false)
    }
    fetchDatabase();
  }

  useEffect(() => { 
      generate();
  }, [])

  return (
    <div className='random-container'>
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoading}
            >
            <CircularProgress color="inherit" />
        </Backdrop>
        <div className='random-analogy'>
            {analogyID
            ? <DisplayAnalogy id={analogyID} email={email} showComments={false} />
            : <></>
            }
        </div>
        <div className='show-next'>
          <Button onClick={() => generate()} variant="contained" startIcon={<ShuffleIcon />}>
              Generate
          </Button>
        </div>
    </div>
  );
}

export default RandomAnalogy;
