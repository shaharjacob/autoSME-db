import React, { useState, useEffect } from 'react';

import './About.css'
import DisplayAnalogy from '../analogy/display/DisplayAnalogy'
import { firebase  } from '../firebase/InitFirebase';

const db = firebase.database()

const About = ({ email }) => {

  const [analogyID, setAnalogyID] = useState(null);
  const analogiesRef = db.ref(`analogies`);

  useEffect(() => { 
    async function fetchDatabase() {
      let _dataset = await analogiesRef.once('value');
      let _snapshot =  _dataset.val();
      let _chosen_id = Object.keys(_snapshot)[0]
      let _max_voted = -1000000
      
      for (const [analogyID, analogyValues] of Object.entries(_snapshot)) {
        if (analogyValues.votes.length - 1 > _max_voted) {
          _max_voted = analogyValues.votes.length - 1;
          _chosen_id = analogyID
        }
      }
      setAnalogyID(_chosen_id)
    }
    fetchDatabase();
  }, [analogiesRef])

  return (
    <div className='about-container'>
        <div className='about-title'>
            About
        </div>
        <div className='about-content'>
          This analogy database is an aggregation of various sources described in the paper [link].
          It can be used for fun, research and inspiration (data is available for download).
          This is an interactive database – <b>users can add analogies and vote!</b><br/><br/>

          This database was created and is being maintained by <b>Hyadata Lab</b>.<br/><br/>
          
          Hyadata Lab ("Did you know?" in Hebrew) is a research lab within the School of Computer Science and Engineering at the Hebrew University of Jerusalem. 
          Our goal is to use data to make sense of the world, and in particular -- allow computers to augment human cognition in novel ways.
        </div>
        <div className='analogy-example'>
            {analogyID
            ? <DisplayAnalogy id={analogyID} email={email} />
            : <></>
            }
        </div>
    </div>
  );
}

export default About;
