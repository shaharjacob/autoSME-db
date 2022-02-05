import React, {useState, useEffect} from 'react';

import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import structuredClone from '@ungap/structured-clone';

import './DisplayDataset.css'
import { firebase  } from '../firebase/InitFirebase';
import DisplayAnalogy from '../analogy/display/DisplayAnalogy';

const db = firebase.database()

const DisplayDataset = ({ email }) => {

    const [origDatabase, setOrigDatabase] = useState({})
    const [filteredDatabase, setFilteredDatabase] = useState({})
    const [checkboxes, setCheckboxes] = useState([false, false, false, false, false])


    useEffect(() => { 
        const analogiesRef = db.ref("analogies");
        async function fetchDatabase() {
            let dataset = await analogiesRef.once('value');
            let snapshot =  dataset.val()
            let _database = {}
            for (const [analogyID, analogyValues] of Object.entries(snapshot)) {
                _database[analogyID] = analogyValues
            }
            setOrigDatabase(_database)
            setFilteredDatabase(_database)
          }
          fetchDatabase()
    }, [])

    function onFilterByAnalogySize(index) {
        let _checkboxes = structuredClone(checkboxes)
        _checkboxes[index] = !_checkboxes[index];
        setCheckboxes(_checkboxes)

        if (!_checkboxes[0] && !_checkboxes[1] && !_checkboxes[2] && !_checkboxes[3] && !_checkboxes[4]) {
            setFilteredDatabase(origDatabase);
            return
        }
        
        let newDatasetKeys = {}
        for (const [key, value] of Object.entries(origDatabase)) {
            let analogy_size = value.base.length;
            if (_checkboxes[analogy_size - 2]) {
                newDatasetKeys[key] = value
            }
        }
        setFilteredDatabase(newDatasetKeys)
    }

    return (
        <div id='display-dataset-container'>
            <div className='filter'>
                <div className='filter-by-size'>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Filter by analogy size</FormLabel>
                        <FormGroup aria-label="position" row>
                            <FormControlLabel
                                control={<Checkbox />}
                                label="2x2"
                                labelPlacement="bottom"
                                onChange={() => onFilterByAnalogySize(0)}
                            />
                            <FormControlLabel
                                id="checkbox-3x3"
                                control={<Checkbox />}
                                label="3x3"
                                labelPlacement="bottom"
                                onChange={() => onFilterByAnalogySize(1)}
                            />
                            <FormControlLabel
                                id="checkbox-4x4"
                                control={<Checkbox />}
                                label="4x4"
                                labelPlacement="bottom"
                                onChange={() => onFilterByAnalogySize(2)}
                            />
                            <FormControlLabel
                                id="checkbox-5x5"
                                control={<Checkbox />}
                                label="5x5"
                                labelPlacement="bottom"
                                onChange={() => onFilterByAnalogySize(3)}
                            />
                            <FormControlLabel
                                id="checkbox-6"
                                control={<Checkbox />}
                                label="6+"
                                labelPlacement="bottom"
                                onChange={() => onFilterByAnalogySize(4)}
                            />
                        </FormGroup>
                    </FormControl>
                </div>
            </div>
            {Object.keys(filteredDatabase).map((id) => {
                return (
                    <div key={id} className='analogy-entry'>
                        <DisplayAnalogy id={id} email={email} />
                    </div>
                )
            })}
        </div>
    );
}

export default DisplayDataset;
