import React from 'react';

import './Main.css'
import CreateAnalogy from '../analogy/CreateAnalogy';
import DisplayDataset from '../analogy/DisplayDataset';

const Main = ( { email } ) => {
    
    return (
        <div className='main-container'>
            <div className='main-content'>
                <CreateAnalogy email={email} />
                <DisplayDataset />
            </div>
        </div>
    );
}

export default Main;
