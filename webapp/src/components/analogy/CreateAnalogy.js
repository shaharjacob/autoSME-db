import React, { useState } from 'react';

import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';

import './CreateAnalogy.css'
import { firebase  } from '../firebase/InitFirebase';
import BaseTargetPair from './BaseTargetPair'
import { isNull } from '../../utils'

const db = firebase.database()

const CreateAnalogy = ( { email } ) => {

    const [base, setBase] = useState(["", "", "", "", "", "", "", "", "", ""])
    const [target, setTarget] = useState(["", "", "", "", "", "", "", "", "", ""])
    const [analogyLength, setAnalogyLength] = useState(2)
    const analogiesRef = db.ref("analogies");

    function onAddEntry() {
        setAnalogyLength((prevState) => prevState + 1)
    }

    function validateAnalogy() {
        for (let i = 0; i < analogyLength; i++) {
            if (isNull(base[i])) {
                alert(`base[${i}] is empty!`)
                return false
            }
            if (isNull(target[i])) {
                alert(`target[${i}] is empty!`)
                return false
            }
        }
        return true
    }

    function onCreateAnalogy() {
        if (!validateAnalogy()) {
            return
        }

        let actual_base = []
        let actual_target = []
        for (let i = 0; i < analogyLength; i++) {
            actual_base.push(base[i])
            actual_target.push(target[i])
        }

        const newAnalogyRef = analogiesRef.push();
        newAnalogyRef.set({
            base: actual_base,
            target: actual_target,
            creator: email,
            comments: [],
            likes: 0
        })
    }
    
    return (
        <div id='create-analogy-container'>
            <BaseTargetPair base={base} setBase={setBase} target={target} setTarget={setTarget} idx={0} analogyLength={analogyLength} setAnalogyLength={setAnalogyLength} />
            <BaseTargetPair base={base} setBase={setBase} target={target} setTarget={setTarget} idx={1} analogyLength={analogyLength} setAnalogyLength={setAnalogyLength} />
            <BaseTargetPair base={base} setBase={setBase} target={target} setTarget={setTarget} idx={2} analogyLength={analogyLength} setAnalogyLength={setAnalogyLength} />
            <BaseTargetPair base={base} setBase={setBase} target={target} setTarget={setTarget} idx={3} analogyLength={analogyLength} setAnalogyLength={setAnalogyLength} />
            <BaseTargetPair base={base} setBase={setBase} target={target} setTarget={setTarget} idx={4} analogyLength={analogyLength} setAnalogyLength={setAnalogyLength} />
            <BaseTargetPair base={base} setBase={setBase} target={target} setTarget={setTarget} idx={5} analogyLength={analogyLength} setAnalogyLength={setAnalogyLength} />
            <BaseTargetPair base={base} setBase={setBase} target={target} setTarget={setTarget} idx={6} analogyLength={analogyLength} setAnalogyLength={setAnalogyLength} />
            <BaseTargetPair base={base} setBase={setBase} target={target} setTarget={setTarget} idx={7} analogyLength={analogyLength} setAnalogyLength={setAnalogyLength} />
            <BaseTargetPair base={base} setBase={setBase} target={target} setTarget={setTarget} idx={8} analogyLength={analogyLength} setAnalogyLength={setAnalogyLength} />
            <BaseTargetPair base={base} setBase={setBase} target={target} setTarget={setTarget} idx={9} analogyLength={analogyLength} setAnalogyLength={setAnalogyLength} />
            
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                marginTop={5}
            >

                <Button onClick={() => onAddEntry()} variant="outlined" startIcon={<AddIcon />}>
                    Add
                </Button>
                <Button onClick={() => onCreateAnalogy()} variant="contained" endIcon={<SendIcon />}>
                    Send
                </Button>
            </Stack>
        </div>
    );
}

export default CreateAnalogy;
