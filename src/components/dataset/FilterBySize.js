import React, { useState } from 'react';

import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import structuredClone from '@ungap/structured-clone';
import FormControlLabel from '@mui/material/FormControlLabel';


const FilterBySize = ({ setFilteredDatabase, origDatabase, setFilteredDatabaseOnlyBySize, filteredDatabaseOnlyByKeywords }) => {

    const [checkboxes, setCheckboxes] = useState([false, false, false, false, false])

    function onFilterByAnalogySize(index) {
        let _checkboxes = structuredClone(checkboxes)
        _checkboxes[index] = !_checkboxes[index];
        setCheckboxes(_checkboxes)

        if (!_checkboxes[0] && !_checkboxes[1] && !_checkboxes[2] && !_checkboxes[3] && !_checkboxes[4]) {
            setFilteredDatabaseOnlyBySize(origDatabase)
            setFilteredDatabase(filteredDatabaseOnlyByKeywords)
            return
        }
        
        let _filtered_database_by_size = {}
        let _filtered_database = {}
        for (const [key, value] of Object.entries(origDatabase)) {
            let analogy_size = value.base.length;
            if (_checkboxes[analogy_size - 2]) {
                // this is the db depend only by the size
                _filtered_database_by_size[key] = value
                if (key in filteredDatabaseOnlyByKeywords) {
                    // this is the actual db
                    _filtered_database[key] = value
                }
            }
        }
        setFilteredDatabaseOnlyBySize(_filtered_database_by_size)
        setFilteredDatabase(_filtered_database)
    }

    return (
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
    );
}

export default FilterBySize;
