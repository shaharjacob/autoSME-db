import React, {useState, useEffect} from 'react';

import { CSVLink } from 'react-csv';
import Tooltip from '@mui/material/Tooltip';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import './DisplayDataset.css'
import FilterBySize from './FilterBySize';
import FilterByKeywords from './FilterByKeywords';
import { firebase  } from '../firebase/InitFirebase';
import DisplayAnalogy from '../analogy/display/DisplayAnalogy';

const db = firebase.database()


const DisplayDataset = ({ email }) => {

    const [origDatabase, setOrigDatabase] = useState({})
    const [filteredDatabase, setFilteredDatabase] = useState({})
    const [filteredDatabaseOnlyBySize, setFilteredDatabaseOnlyBySize] = useState({})
    const [filteredDatabaseOnlyByKeywords, setFilteredDatabaseOnlyByKeywords] = useState({})
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
            setFilteredDatabaseOnlyBySize(_database)
            setFilteredDatabaseOnlyByKeywords(_database)
          }
          fetchDatabase()
    }, [])

    function get_headers_for_csv() {
        let headers = []
        // the order is important
        for (let i = 0; i < 10; i++) {
            headers.push({ label: `Base ${i+1}`, key: `base_${i+1}` })
        }
        for (let i = 0; i < 10; i++) {
            headers.push({ label: `Target ${i+1}`, key: `target_${i+1}` })
        }
        return headers
    }

    function get_data_for_csv() {
        let data = []
        for (const [key, value] of Object.entries(filteredDatabase)) {
            let row = {}
            for (let i = 0; i < 10; i++) {
                let b = (i < value.base.length) ? value.base[i] : ""
                row[`base_${i+1}`] = b
            }
            for (let i = 0; i < 10; i++) {
                let t = (i < value.target.length) ? value.target[i] : ""
                row[`target_${i+1}`] = t
            }
            data.push(row)
        }
        return data
    }

    return (
        <div id='display-dataset-container'>
            <div className='download-csv'>
                <CSVLink
                    headers={get_headers_for_csv()}
                    data={get_data_for_csv()}
                    filename="autosme_db.csv"
                >
                    <Tooltip title="Download the currently displayed database as CSV">
                        <FileDownloadIcon sx={{color: '#868686'}} />
                    </Tooltip>
                </CSVLink>
            </div>
            <div className='filter'>
                <div className='filter-by-size'>
                    <FilterBySize 
                        setFilteredDatabase={setFilteredDatabase} 
                        origDatabase={origDatabase}  
                        setFilteredDatabaseOnlyBySize={setFilteredDatabaseOnlyBySize}
                        filteredDatabaseOnlyByKeywords={filteredDatabaseOnlyByKeywords}
                    />
                </div>
                <div className='filter-by-keywords'>
                    <FilterByKeywords 
                        options={keywordsToIDs} 
                        setFilteredDatabase={setFilteredDatabase}
                        origDatabase={origDatabase}  
                        setFilteredDatabaseOnlyByKeywords={setFilteredDatabaseOnlyByKeywords}
                        filteredDatabaseOnlyBySize={filteredDatabaseOnlyBySize}
                    />
                </div>
            </div>
            {Object.entries(filteredDatabase).map(([id, val]) => {
                return (
                    <div key={id} className='analogy-entry'>
                        <DisplayAnalogy id={id} values={val} email={email} />
                    </div>
                )
            })}
        </div>
    );
}

export default DisplayDataset;
