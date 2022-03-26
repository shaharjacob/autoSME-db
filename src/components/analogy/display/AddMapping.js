import React from 'react';

import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';

// icons
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import HomeIcon from '@mui/icons-material/Home';

import './AddMapping.css'

const AddMapping = ({ setBase, setTarget, baseError, targetError }) => {

    return (
        <div className='base-target-pair'>
            <FormControl variant="standard" error={baseError}>
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
			        onChange={(e) => setBase(e.target.value)}
                />
            </FormControl>
            <span className='arrow-alignment'>&nbsp;&nbsp;&nbsp;&nbsp;&rarr;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <FormControl variant="standard" error={targetError}>
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
			        onChange={(e) => setTarget(e.target.value)}
                />
            </FormControl>
        </div>
    );
}

export default AddMapping;
