import React from 'react';

import FormLabel from '@mui/material/FormLabel';
import CheckIcon from '@mui/icons-material/Check';
import { useAutocomplete } from '@mui/base/AutocompleteUnstyled';

import { StyledTag } from './StyleTag'
import './FilterByKeywords.css'

const FilterByKeywords = ({ options, filteredDatabase, setFilteredDatabase }) => {

    function onChooseKeyword(event, val) {
        if (val.length < 1) {
            return
        }
        let _filteredDatabase = {}
        let _ids = new Set()
        for (let i = 0; i < val.length; i++) {
            for (let j = 0; j < val[i].analogies.length; j++) {
                _ids.add(val[i].analogies[j])
            }
        }
        for (const [k, v] of Object.entries(filteredDatabase)) {
            if (_ids.has(k)) {
                _filteredDatabase[k] = v
            }
        }
        setFilteredDatabase(_filteredDatabase)
    }
  

    const { getInputProps, getTagProps, getListboxProps, getOptionProps, groupedOptions, value, focused, setAnchorEl } = useAutocomplete({
            id: 'search-by-keywords',
            multiple: true,
            options: options,
            getOptionLabel: (option) => option.label,
            isOptionEqualToValue: (option, value) => option.label === value.label,
            onChange: (event, val) => onChooseKeyword(event, val)
      });


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
            :  <></>
            }
        </div>
    );
}

export default FilterByKeywords;