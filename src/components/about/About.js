import React from 'react';

import './About.css'
import DisplayAnalogy from '../analogy/DisplayAnalogy'

const About = ({ email }) => {

  return (
    <div className='about-container'>
        <div className='about-title'>
            About
        </div>
        <div className='about-content'>
          Hyadata Lab ("Did you know?" in Hebrew) is a research lab within the School of Computer Science and Engineering at the Hebrew University of Jerusalem. 
          Our goal is to use data to make sense of the world, and in particular -- allow computers to augment human cognition in novel ways.
        </div>
        <div className='analogy-example'>
            {/* TODO: display the analogy with the most votes */}
            <DisplayAnalogy id='-MuIZF5PikmxBRtqtVEE' email={email} />
        </div>
    </div>
  );
}

export default About;
