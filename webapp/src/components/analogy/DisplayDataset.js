import React, {useState, useEffect} from 'react';

import './DisplayDataset.css'
import { firebase  } from '../firebase/InitFirebase';
import DisplayAnalogy from './DisplayAnalogy';

const db = firebase.database()

const DisplayDataset = () => {

    const [datasetKeys, setDatasetKeys] = useState([])

    useEffect(() => { 
        const analogiesRef = db.ref("analogies");
        async function fetchDatabase() {
            let dataset = await analogiesRef.once('value');
            let snapshot =  dataset.val()
            let keys = []
            for (let key in snapshot) {
                keys.push(key)
            }
            setDatasetKeys(keys)
          }
          fetchDatabase()
        // return () => analogiesRef.off()
    }, [])

    return (
        <div id='display-dataset-container'>
            {datasetKeys.map((id) => {
                return <DisplayAnalogy key={id} id={id} />
            })}
        </div>
    );
}

export default DisplayDataset;
