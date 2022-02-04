import React, { useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import ShuffleIcon from '@mui/icons-material/Shuffle';

import './RandomAnalogy.css'
import DisplayAnalogy from '../analogy/DisplayAnalogy'
import { firebase  } from '../firebase/InitFirebase';

const db = firebase.database()

const RandomAnalogy = ({ email }) => {

  const [analogyID, setAnalogyID] = useState(null)
  const analogiesRef = db.ref(`analogies`);

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
      }
    }
    fetchDatabase();
  }

  useEffect(() => { 
    generate();
}, [])

  return (
    <div className='random-container'>
        <div className='analogy-example'>
            {analogyID
            ? <DisplayAnalogy id='-Mv57uhOvSQ8TCQmSVFv' email={email} />
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
