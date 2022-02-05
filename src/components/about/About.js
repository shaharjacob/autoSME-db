import React from 'react';

import './About.css'
import DisplayAnalogy from '../analogy/display/DisplayAnalogy'

const About = ({ email }) => {

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
            {/* TODO: display the analogy with the most votes */}
            <DisplayAnalogy id='-Mv57uhOvSQ8TCQmSVFv' email={email} />
        </div>
    </div>
  );
}

export default About;
