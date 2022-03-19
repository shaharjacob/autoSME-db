import React, { useState, useEffect, forwardRef } from 'react';

import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import './EditAnalogy.css'
import { firebase  } from '../../firebase/InitFirebase';
import BaseTargetPair from '../create/BaseTargetPair'
import { isNull } from '../../../utils'

const db = firebase.database()
const ANALOGY_MAX_SIZE = 10

const EditAnalogy = ( { id, email } ) => {

    // required for db
    const [base, setBase] = useState(Array(ANALOGY_MAX_SIZE).fill(""))
    const [target, setTarget] = useState(Array(ANALOGY_MAX_SIZE).fill(""))

    // optional for db
    const [story1, setStory1] = useState("")
    const [story2, setStory2] = useState("")
    const [sourcesAsString, setSourcesAsString] = useState("")

    const [isLoading, setIsLoading] = useState(true)
    const [hasPermission, setHasPermission] = useState(true)
    const [analogyLength, setAnalogyLength] = useState(0)
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const analogiesRef = db.ref(`analogies/${id}`);

    useEffect(() => { 
        async function fetchDatabaseWithID() {
            let elementFromDB = await analogiesRef.once('value');
            let snapshot =  elementFromDB.val();
            let base_ = Array(ANALOGY_MAX_SIZE).fill("");
            let target_ = Array(ANALOGY_MAX_SIZE).fill("");
            if (snapshot.creator !== email) {
                setHasPermission(false)
                return
            }
            setAnalogyLength(snapshot.base.length)
            for (let i = 0; i < snapshot.base.length; i++) {
                base_[i] = snapshot.base[i]
                target_[i] = snapshot.target[i]
            }
            setBase(base_)
            setTarget(target_)
            setStory1(snapshot.story.base)
            setStory2(snapshot.story.target)
            if (snapshot.hasOwnProperty("sources")) {
                setSourcesAsString(snapshot.sources.join(','))
            }
            setIsLoading(false)
        }
        fetchDatabaseWithID();
    }, [email])

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

    async function onEditAnalogy() {
        if (!validateAnalogy()) {
            return
        }

        let actual_base = []
        let actual_target = []
        for (let i = 0; i < analogyLength; i++) {
            actual_base.push(base[i])
            actual_target.push(target[i])
        }

        let sources = []
        if (!isNull(sourcesAsString)) {
            let sources_without_trim = sourcesAsString.split(",");
            for (let i = 0; i < sources_without_trim.length; i++) {
                sources.push(sources_without_trim[i].trim())
            }
        }

        let analogy_to_update = {
            base: actual_base,
            target: actual_target,
            story: {
                base: story1,
                target: story2
            },
        }

        if (sources.length > 0) {
            analogy_to_update["sources"] = sources
        }

        let elementFromDB = await analogiesRef.once('value');
        elementFromDB.ref.update(analogy_to_update)
        setOpenSnackbar(true)
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
        <>
        {!isLoading
        ?
            <>
                <div id='edit-analogy-container'>
                    <div className='story'>
                        <TextField
                            minRows={5}
                            label="Story 1 (Optional)"
                            style={{ width: '90%' }}
                            value={story1}
                            onChange={(e) => setStory1(e.target.value)}
                            multiline
                        />
                    </div>
                    <div className='story'>
                        <TextField
                            minRows={5}
                            label="Story 2 (Optional)"
                            style={{ width: '90%' }}
                            value={story2}
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
                    <div className='edit-analogy-sources'>
                    <FormControl fullWidth variant="standard">
                        <InputLabel htmlFor="standard-adornment-sources">Sources (Optional)</InputLabel>
                        <Input
                            id="standard-adornment-sources"
                            value={sourcesAsString}
                            onChange={(e) => setSourcesAsString(e.target.value)}
                        />
                    </FormControl>
                    </div>
                </div>
                <div className='submit-button'>
                    <Button onClick={() => onEditAnalogy()} variant="contained" startIcon={<SendIcon />} >
                        Save
                    </Button>
                    <Snackbar 
                        open={openSnackbar} 
                        autoHideDuration={3000} 
                        onClose={handleCloseSnackbar}
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "center"
                        }}
                    >
                        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                            Analogy updated successfully!
                        </Alert>
                    </Snackbar>
                </div>
            </>
        :
        hasPermission
        ?
            <></>
        :
            <div className='has-permission'>
                You don't have permissions to edit this analogy!
            </div>
        }
        </>
    );
}

export default EditAnalogy;
