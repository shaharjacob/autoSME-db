import React from 'react';

import FormLabel from '@mui/material/FormLabel';
import CheckIcon from '@mui/icons-material/Check';
import { useAutocomplete } from '@mui/base/AutocompleteUnstyled';

import { StyledTag } from './StyleTag'
import './FilterByKeywords.css'

const FilterByKeywords = ({ options, setFilteredDatabase, origDatabase, setFilteredDatabaseOnlyByKeywords, filteredDatabaseOnlyBySize }) => {

    function onChooseKeyword(event, val) {
        if (val.length < 1) {
            setFilteredDatabaseOnlyByKeywords(origDatabase)
            setFilteredDatabase(filteredDatabaseOnlyBySize)
            return
        }
        let _filtered_database_by_keywords = {}
        let _filtered_database = {}
        let _ids = new Set()
        for (let i = 0; i < val.length; i++) {
            for (let j = 0; j < val[i].analogies.length; j++) {
                _ids.add(val[i].analogies[j])
            }
        }
        for (const [k, v] of Object.entries(origDatabase)) {
            if (_ids.has(k)) {
                _filtered_database_by_keywords[k] = v
                if (k in filteredDatabaseOnlyBySize) {
                    _filtered_database[k] = v
                }

            }
        }
        setFilteredDatabaseOnlyByKeywords(_filtered_database_by_keywords)
        setFilteredDatabase(_filtered_database)
    }
  

    const { getInputProps, getTagProps, getListboxProps, getOptionProps, groupedOptions, value, focused, setAnchorEl } = useAutocomplete({
            id: 'search-by-keywords',
            multiple: true,
            options: options,
            getOptionLabel: (option) => option.label,
            isOptionEqualToValue: (option, value) => option.label === value.label,
            onChange: (event, val) => onChooseKeyword(event, val),
      });

    function isThereValue() {
        let element = document.getElementById('search-by-keywords') 
        if (element) {
            if (element.value.length > 0) {
                return true
            }
        }
        return false
    }


    return (
        <div className='search-by-keywords-container'>
            <FormLabel component="legend">Keywords</FormLabel>
            <div ref={setAnchorEl} className={focused ? 'input-wrapper focused' : 'input-wrapper'}>
                {value.map((option, index) => (
                    <StyledTag label={option.label} {...getTagProps({ index })} />
                ))}
                <input {...getInputProps()} />
            </div>
            {groupedOptions.length > 0
            ? 
                <div className='listbox' {...getListboxProps()}>
                    {groupedOptions.map((option, index) => (
                        <li {...getOptionProps({ option, index })}>
                            <span>{option.label}</span>
                            <CheckIcon fontSize="small" />
                        </li>
                    ))}
                </div>
            :  
                isThereValue()
                ?   <>No results found</>
                :   <></>
            }
        </div>
    );
}

export default FilterByKeywords;