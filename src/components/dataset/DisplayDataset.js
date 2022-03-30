import React, {useState, useEffect} from 'react';

import { CSVLink } from 'react-csv';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Backdrop from '@mui/material/Backdrop';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
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
    const [isLoading, setIsLoading] = useState(true);

    // download
    const [anchorEl, setAnchorEl] = useState(null);
    const openDownloadMenu = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };


    useEffect(() => { 
        async function fetchDatabase() {
            const analogiesRef = db.ref("analogies");
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
                
                // sources keywords (for example 'green eval')
                if (analogyValues.hasOwnProperty("sources")) {
                    for (let i = 0; i < analogyValues.sources.length; i++) {
                        if (!(analogyValues.sources[i] in _keywords)) {
                            _keywords[analogyValues.sources[i]] = []
                        }
                        _keywords[analogyValues.sources[i]].push(analogyID)
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
            setIsLoading(false)
          }
          fetchDatabase()
    }, [])

    function get_headers_for_csv() {
        let headers = []

        for (let i = 0; i < 2; i++) {
            headers.push({ label: `Story ${i+1}`, key: `story_${i+1}` })
        }

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
        for (const value of Object.values(filteredDatabase)) {
            let row = {}

            row[`story_1`] = value.story.base;
            row[`story_2`] = value.story.target;

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

    function get_data_for_json() {
        let data = []
        for (const value of Object.values(filteredDatabase)) {
            let entry = {}
            entry["story"] = {
                "base": value.story.base,
                "target": value.story.target
            }
            entry["base"] = value.base
            entry["target"] = value.target
            data.push(entry)
        }
        return encodeURIComponent(JSON.stringify(data))
    }

    return (
        <div id='display-dataset-container'>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
                >
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className='download-csv'>
            <IconButton
                id="basic-button"
                aria-controls={openDownloadMenu ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openDownloadMenu ? 'true' : undefined}
                onClick={handleClick}
            >
                <Tooltip title="Download the currently displayed database">
                    <FileDownloadIcon sx={{color: '#868686'}} />
                </Tooltip>
                <span style={{fontSize: '9px'}}>Download</span>
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={openDownloadMenu}
                onClose={() => setAnchorEl(null)}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem>
                    <CSVLink
                        headers={get_headers_for_csv()}
                        data={get_data_for_csv()}
                        filename="autosme_db.csv"
                        className='download-label'
                    >
                        .csv
                    </CSVLink>
                </MenuItem>
                <MenuItem>
                    <a 
                        href={`data:text/json;charset=utf-8,${get_data_for_json()}`} 
                        download="filename.json"
                        className='download-label'
                    >
                        .json
                    </a>
                </MenuItem>
            </Menu>
                
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
                    <div key={id}>
                        <DisplayAnalogy id={id} values={val} email={email} showComments={false} />
                    </div>
                )
            })}
        </div>
    );
}

export default DisplayDataset;
