import React, { useState, useEffect } from 'react';

import TranslateIcon from '@mui/icons-material/Translate';

import './DisplayAnalogy.css'
import { firebase  } from '../firebase/InitFirebase';

const db = firebase.database()

const DisplayAnalogy = ( {id} ) => {
    const [base, setBase] = useState([])
    const [target, setTarget] = useState([])

    useEffect(() => { 
        const analogiesRef = db.ref(`analogies/${id}`);
        async function fetchDatabaseWithID() {
            let elementFromDB = await analogiesRef.once('value');
            let snapshot =  elementFromDB.val()
            setBase(snapshot.base)
            setTarget(snapshot.target)
          }
        fetchDatabaseWithID()
        // return () => analogiesRef.off()
    }, [])

    return (
        <div id='display-analogy-container'>
            <div className='border-bottom'></div>
            <div className='border-bottom'></div>
            <div className='top border-bottom'>
                <TranslateIcon className='lang-icon' />
            </div>
            <div></div>
            <div className='display-analogy-unit'>
                {base.map((b, idx) => {
                    return (
                        <div className='entries' key={`display_analogy_${idx}`}>
                            <div className='entry-right'>
                                {base[idx]}
                            </div>
                            <div className='arrow'>
                                &rarr;
                            </div>
                            <div className='entry-left'>
                                {target[idx]}
                            </div>
                        </div>
                    )
                })}
            </div>
            <div></div>
        </div>
    );
}

export default DisplayAnalogy;
