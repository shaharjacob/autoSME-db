import React, { useState, forwardRef } from 'react';

import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TextareaAutosize from '@mui/material/TextareaAutosize';

import './CreateAnalogy.css'
import { firebase  } from '../../firebase/InitFirebase';
import BaseTargetPair from './BaseTargetPair'
import { isNull } from '../../../utils'
import { TextField } from '@mui/material';

const db = firebase.database()

const CreateAnalogy = ( { email } ) => {

    const [base, setBase] = useState(["", "", "", "", "", "", "", "", "", ""])
    const [target, setTarget] = useState(["", "", "", "", "", "", "", "", "", ""])
    const [analogyLength, setAnalogyLength] = useState(2)
    const analogiesRef = db.ref("analogies");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [story1, setStory1] = useState("")
    const [story2, setStory2] = useState("")

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
        if (story1 !== "" && story2 === "") {
            alert("You should add story for the second domain (or remove the story from the first domain)")
            return false
        }
        if (story1 === "" && story2 !== "") {
            alert("You should add story for the first domain (or remove the story from the second domain)")
            return false
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

        let sources_as_string = document.getElementById("standard-adornment-sources").value
        let sources = [""]
        if (sources_as_string !== "" && sources_as_string !== null && sources_as_string !== undefined ) {
            let sources_without_trim = sources_as_string.split(",");
            for (let i = 0; i < sources_without_trim.length; i++) {
                sources.push(sources_without_trim[i].trim())
            }
        }

        const newAnalogyRef = analogiesRef.push();
        newAnalogyRef.set({
            story: {
                base: story1,
                target: story2
            },
            base: actual_base,
            target: actual_target,
            creator: email,
            votes: [""],
            sources: sources,
            comments: [""]
        })
        setOpenSnackbar(true)
        setBase(["", "", "", "", "", "", "", "", "", ""])
        setTarget(["", "", "", "", "", "", "", "", "", ""])
        setAnalogyLength(2)
        document.getElementById("standard-adornment-sources").value = ""
    }

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenSnackbar(false);
    };

    const Alert = forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
    
    return (
        <div>
        <div id='create-analogy-container'>
            <div className='story'>
                <TextField
                    minRows={5}
                    label="Story 1 (Optional)"
                    style={{ width: '90%' }}
                    onChange={(e) => setStory1(e.target.value)}
                    multiline
                />
            </div>
            <div className='story'>
                <TextField
                    minRows={5}
                    label="Story 2 (Optional)"
                    style={{ width: '90%' }}
                    onChange={(e) => setStory2(e.target.value)}
                    multiline
                />
            </div>
            <div>
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
            </div>
            <div>
                <IconButton onClick={() => onAddEntry()}>
                    <AddIcon variant="outlined" sx={{color: "#315fc4"}} />
                </IconButton>
            </div>
            <div className='create-analogy-sources'>
            <FormControl fullWidth variant="standard">
                <InputLabel htmlFor="standard-adornment-sources">Sources (Optional)</InputLabel>
                <Input
                    id="standard-adornment-sources"
                    placeholder='For multiple sources seperate by comma'
                />
            </FormControl>
            </div>
        </div>
        <div className='submit-button'>
            <Button onClick={() => onCreateAnalogy()} variant="contained" startIcon={<SendIcon />} >
                Create
            </Button>
            <Snackbar 
                open={openSnackbar} 
                autoHideDuration={5000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center"
                }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    Analogy created successfully!
                </Alert>
            </Snackbar>
        </div>
        </div>
    );
}

export default CreateAnalogy;
