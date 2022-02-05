import React from 'react';

import './CreateAnalogyWrapper.css'
import CreateAnalogy from './CreateAnalogy';

const CreateAnalogyWrapper = ({ email }) => {

  return (
    <div className='create-analogy-wrapper-container'>
        {email === "" || email === null || email === undefined
        ?
            <div className='login-first'>
                You should login first
            </div>
        :
            <CreateAnalogy email={email} />
        }
    </div>
  );
}

export default CreateAnalogyWrapper;
