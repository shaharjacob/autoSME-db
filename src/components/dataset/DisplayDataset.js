import React, {useState, useEffect} from 'react';

import './DisplayDataset.css'
import { firebase  } from '../firebase/InitFirebase';
import DisplayAnalogy from '../analogy/display/DisplayAnalogy';
import FilterBySize from './FilterBySize';
import FilterByKeywords from './FilterByKeywords';

const db = firebase.database()

const DisplayDataset = ({ email }) => {

    const [origDatabase, setOrigDatabase] = useState({})
    const [filteredDatabase, setFilteredDatabase] = useState({})
    const [keywordsToIDs, setKeywordsToIDs] = useState([])


    useEffect(() => { 
        const analogiesRef = db.ref("analogies");
        async function fetchDatabase() {
            let _dataset = await analogiesRef.once('value');
            let _snapshot =  _dataset.val()
            let _database = {}
            let _keywords = {} // we use dictionary in the first step for quick 'in' check
            for (const [analogyID, analogyValues] of Object.entries(_snapshot)) {
                _database[analogyID] = analogyValues

                // analogy keywords (base and target)
                for (let i = 0; i < analogyValues.base.length; i++) {
                    // base
                    if (!(analogyValues.base[i] in _keywords)) {
                        _keywords[analogyValues.base[i]] = []
                    }
                    _keywords[analogyValues.base[i]].push(analogyID)

                    // target
                    if (!(analogyValues.target[i] in _keywords)) {
                        _keywords[analogyValues.target[i]] = []
                    }
                    _keywords[analogyValues.target[i]].push(analogyID)
                }
                
                // references keywords (for example 'green eval')
                for (let i = 0; i < analogyValues.references.length; i++) {
                    // the first value should be empty because of firebase issue with empty arrays..
                    if (analogyValues.references[i] !== "" && analogyValues.references[i] !== null && analogyValues.references[i] !== undefined) {
                        if (!(analogyValues.references[i] in _keywords)) {
                            _keywords[analogyValues.references[i]] = []
                        }
                        _keywords[analogyValues.references[i]].push(analogyID)
                    } 
                }
            }
            // now we will convert the dictionary to array options format for the keywords search
            let _keywords_as_array = []
            for (const [k, v] of Object.entries(_keywords)) {
                _keywords_as_array.push({
                    label: k,
                    analogies: v
                })
            }
            setKeywordsToIDs(_keywords_as_array)
            setOrigDatabase(_database)
            setFilteredDatabase(_database)
          }
          fetchDatabase()
    }, [])

    return (
        <div id='display-dataset-container'>
            <div className='filter'>
                <div className='filter-by-size'>
                    <FilterBySize 
                        setFilteredDatabase={setFilteredDatabase} 
                        origDatabase={origDatabase}  
                    />
                </div>
                <div className='filter-by-keywords'>
                    <FilterByKeywords 
                        options={keywordsToIDs} 
                        filteredDatabase={filteredDatabase}
                        setFilteredDatabase={setFilteredDatabase}
                    />
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
