import React, { useEffect } from 'react';
import structuredClone from '@ungap/structured-clone';

import Input from '@mui/material/Input';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';

// icons
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import HomeIcon from '@mui/icons-material/Home';
import DeleteIcon from '@mui/icons-material/Delete';

import './BaseTargetPair.css'

const BaseTargetPair = ({ base, setBase, target, setTarget, idx, analogyLength, setAnalogyLength }) => {

    function handleChangeBase(value) {
        let base_clone = structuredClone(base);
        base_clone[idx] = value;
        setBase(base_clone);
    }

    function handleChangeTarget(value) {
        let target_clone = structuredClone(target);
        target_clone[idx] = value;
        setTarget(target_clone);
    }

    function removeEntry() {
        let target_clone = structuredClone(target);
        target_clone.splice(idx, 1)
        target_clone.push("")

        let base_clone = structuredClone(base);
        base_clone.splice(idx, 1)
        base_clone.push("")

        setTarget(target_clone);
        setBase(base_clone);
        setAnalogyLength((prevState) => prevState - 1)
    }

    useEffect(() => {
        let display = 'none'
        if (idx < analogyLength) {
            display = 'flex'
        }
        document.getElementsByClassName('base-target-pair')[idx].style.display = display
    }, [analogyLength, idx])


    return (
        <div className='base-target-pair'>
            <FormControl variant="standard">
                <InputLabel htmlFor="base">
                    base
                </InputLabel>
                <Input
                    className="base"
                    startAdornment={
                        <InputAdornment position="start">
                            <HomeIcon className='blue' />
                        </InputAdornment>
                    }
                    value={base[idx]} 
			        onChange={(e) => handleChangeBase(e.target.value)}
                />
            </FormControl>
            <span className='arrow-alignment'>&nbsp;&nbsp;&nbsp;&nbsp;&rarr;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <FormControl variant="standard">
                <InputLabel htmlFor="target">
                    target
                </InputLabel>
                <Input
                    className="target"
                    startAdornment={
                        <InputAdornment position="start">
                            <TrackChangesIcon className='red' />
                        </InputAdornment>
                    }
                    value={target[idx]} 
			        onChange={(e) => handleChangeTarget(e.target.value)}
                />
            </FormControl>
            {analogyLength > 2
            ?
                <IconButton onClick={() => removeEntry()}>
                    <DeleteIcon sx={{color: "#555555"}} />
                </IconButton>
            :
                <></>
            }
        </div>
    );
}

export default BaseTargetPair;
