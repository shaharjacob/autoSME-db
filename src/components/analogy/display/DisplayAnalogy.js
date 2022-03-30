import React, { useState, useEffect, forwardRef } from 'react';
import structuredClone from '@ungap/structured-clone';

import Button from '@mui/material/Button';
import MuiAlert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import LaunchIcon from '@mui/icons-material/Launch';
import ReportIcon from '@mui/icons-material/Report';
import MessageIcon from '@mui/icons-material/Message';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import './DisplayAnalogy.css'
import AddMapping from './AddMapping';
import { isNull } from '../../../utils'
import { firebase  } from '../../firebase/InitFirebase';

const db = firebase.database()

const DisplayAnalogy = ( {id, values, email, showComments, setIsLoading} ) => {
    
    const mailTitle = "Report inappropriate content"
    const mailBody = `Analogy id ${id}`

    // required db fields
    const [base, setBase] = useState([])
    const [target, setTarget] = useState([])
    const [creator, setCreator] = useState("")
    const [mappingCreators, setMappingCreators] = useState([])

    // optional db fields
    const [story, setStory] = useState({base: "", target: ""})
    const [votes, setVotes] = useState([])
    const [voteColor, setVoteColor] = useState("#646464")
    const [sources, setSources] = useState([""])
    const [comments, setComments] = useState([])

    // edit mode
    const [baseToAdd, setBaseToAdd] = useState("")
    const [targetToAdd, setTargetToAdd] = useState("")
    const [baseToAddError, setBaseToAddError] = useState(false)
    const [targetToAddError, setTargetToAddError] = useState(false)

    const [openDialogExtendAnalogy, setOpenDialogExtendAnalogy] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [currentComment, setCurrentComment] = useState("")
    const analogiesRef = db.ref(`analogies/${id}`);

    useEffect(() => { 
        function setStates(obj) {
            // required fields
            setBase(obj.base)
            setTarget(obj.target)
            setCreator(obj.creator)
            setMappingCreators(obj.mapping_creators)
    
            // optional fields
            if (obj.hasOwnProperty("story")) {
                setStory(obj.story)
            }
            if (obj.hasOwnProperty("votes")) {
                setVotes(obj.votes)
            }
            if (obj.hasOwnProperty("sources")) {
                setSources(obj.sources)
            }
            if (obj.hasOwnProperty("comments")) {
                setComments(obj.comments)
            }
            if (!isNull(email)) {
                if (obj.hasOwnProperty("votes")) {
                    if (obj.votes.includes(email)) {
                        setVoteColor("#0c6e11")
                    }
                }
            }
        }
        
        if (!isNull(values) && Object.keys(values).length > 0) {
            setStates(values);
        }
        else {
            async function fetchDatabaseWithID() {
                let elementFromDB = await analogiesRef.once('value');
                let snapshot =  elementFromDB.val();
                setStates(snapshot);
                setIsLoading(false)
            }
            fetchDatabaseWithID();
        }
    }, [id, values, email])

    async function onAddNewMappingToExistingAnalogy() {
        if (!baseToAdd || !targetToAdd) {
            if (!baseToAdd) {
                setBaseToAddError(true)
            }
            if (!targetToAdd) {
                setTargetToAddError(true)
            }
            return
        }
        let elementFromDB = await analogiesRef.once('value');
        elementFromDB.ref.update({
            base: [...base, baseToAdd],
            target: [...target, targetToAdd],
            mapping_creators: [...mappingCreators, email]
        });
        setBase(prevState => [...prevState, baseToAdd])
        setTarget(prevState => [...prevState, targetToAdd])
        setMappingCreators(prevState => [...prevState, email])
        setOpenDialogExtendAnalogy(false)
    }

    async function onConfirmMapping(idx) {
        let mappingCreatorsClone = structuredClone(mappingCreators);
        mappingCreatorsClone[idx] = email;

        let elementFromDB = await analogiesRef.once('value');
        elementFromDB.ref.update({
            mapping_creators: mappingCreatorsClone
        });
        setMappingCreators(mappingCreatorsClone)
    }

    function expandComment() {
        let elem = document.getElementById(id)
        if (elem.style.display !== 'none') {
            document.getElementById(id).style.display = 'none'
        }
        else {
            document.getElementById(id).style.display = 'block'
        }
    }

    async function addComment() {
        let elementFromDB = await analogiesRef.once('value');
        let comment = {
            user: email,
            comment: currentComment
        }
        elementFromDB.ref.update({
            comments: [...comments, comment]
        });
        document.getElementById(id).style.display = 'none'
        setCurrentComment("")
        setComments(prevState => [...prevState, comment])
        setOpenSnackbar(true);
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

    function updateVote() {
        if (email === "" || email === null || email === undefined) {
            return
        }
        async function _updateVote() {
            let elementFromDB = await analogiesRef.once('value');
            let refVotes = structuredClone(votes)
            const refVotesIndex = refVotes.indexOf(email);
            let color = ""

            if (refVotesIndex >= 0) {
                refVotes.splice(refVotesIndex, 1);
                color = "#646464"
            }
            else {
                refVotes.push(email)
                color = "#0c6e11"
            }

            elementFromDB.ref.update({
                votes: refVotes
            });
            setVoteColor(color)
            setVotes(refVotes);
          }
          _updateVote();
    }

    const IsVerifiedMapping = (idx) => {
        if (mappingCreators[idx] !== creator) {
            if (creator !== email) {
                return (
                    <Tooltip title="This mapping not verified by the analogy creator!">
                        <GppMaybeIcon 
                            color='warning' 
                            sx={{fontSize: '14px'}} 
                        />
                    </Tooltip>
                )
            }
            else {
                return (
                    <Tooltip title="Click here to confirm this mapping">
                        <span>
                            <GppMaybeIcon 
                                color='warning' 
                                sx={{fontSize: '14px', cursor: 'pointer'}} 
                                onClick={() => onConfirmMapping(idx)}
                            />
                        </span>
                    </Tooltip>
                )
            }
            
        }
        else {
            return (
                <Tooltip title="Verified by the analogy creator!">
                    <VerifiedUserIcon 
                        color='primary' 
                        sx={{fontSize: '14px'}} 
                    />
                </Tooltip>
            )
        }
    }

    return (
        <div id='display-analogy-container'>
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
                    Comment sent successfully!
                </Alert>
            </Snackbar>
            <div className='top'>
                <div className='align-left'>
                    <span>
                        <ThumbUpAltIcon 
                            color='primary' 
                            sx={{ fontSize: 18, paddingTop: '8px', paddingLeft: '8px' }}  
                        /> 
                        <span style={{fontSize: "12px"}}>
                            {votes.length}
                        </span>
                    </span>
                    <span>
                        <ChatBubbleIcon 
                            onClick={() => showComments ? console.log("") : window.open(`/analogy?id=${id}`)} 
                            color='primary' 
                            sx={{ fontSize: 16, paddingTop: '8px', paddingLeft: '8px', cursor: 'pointer' }}  
                            className="comments-icon"
                        /> 
                        <span style={{fontSize: "12px"}}>
                            {comments.length}
                        </span>
                    </span>
                </div>
                <div className='align-right'>
                    <Tooltip title="Report inappropriate content">
                        <span>
                            <IconButton onClick={() => window.open(`mailto:shahar.jacob@mail.huji.ac.il?subject=${mailTitle}&body=${mailBody}`)}>
                                <ReportIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="Open in a new tab">
                        <span>
                            <IconButton onClick={() => window.open(`/analogy?id=${id}`)} disabled={showComments ? true : false}>
                                <LaunchIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="Edit Analogy">
                        <span>
                            <IconButton onClick={() => window.open(`/edit?id=${id}`)} disabled={creator !== email ? true : false}>
                                <EditIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                </div>
            </div>
            {story.base !== ""
            ?  
                <div className='display-analogy-story border-bottom'>
                    <div className='display-analogy-story-title'>
                        Story 1:
                    </div>
                    <div className='display-analogy-story-content'>
                        {story.base}
                    </div>
                    <div className='display-analogy-story-title'>
                        Story 2:
                    </div>
                    <div className='display-analogy-story-content'>
                        {story.target}
                    </div>
                </div>
            : 
                <></>
            }
            <div className='display-analogy-unit'>
                {base.map((b, idx) => {
                    return (
                        <div className='entries' key={`display_analogy_${idx}`}>
                            <div></div>
                            <div className='align-left'>
                                {base[idx]}
                            </div>
                            <div className='arrow'>
                                &rarr;
                            </div>
                            <div className='entry-right'>
                                {target[idx]}
                            </div>
                            <div>
                                {IsVerifiedMapping(idx)}
                                
                            </div>
                        </div>
                    )
                })}
                <div className='extend-analogy'>
                    <IconButton onClick={() => setOpenDialogExtendAnalogy(true)}>
                        <AddIcon variant="outlined" sx={{fontSize: '14px'}} />
                    </IconButton>
                    <Dialog
                        open={openDialogExtendAnalogy}
                        onClose={() => setOpenDialogExtendAnalogy(false)}
                        aria-labelledby="extend-analogy-title"
                        aria-describedby="extend-analogy-body"
                    >
                        <DialogTitle id="extend-analogy-title">
                            Extend existing analogy
                        </DialogTitle>
                        <DialogContent id="extend-analogy-body">
                            <AddMapping 
                                setBase={setBaseToAdd} 
                                setTarget={setTargetToAdd} 
                                baseError={baseToAddError}
                                targetError={targetToAddError}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDialogExtendAnalogy(false)}>
                                Cancel
                            </Button>
                            <Button onClick={() => onAddNewMappingToExistingAnalogy()} autoFocus>
                                Add
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
            <div className='vote-and-comment'>
                <div className='vote-and-comment-buttons'>
                    <Tooltip title={email === "" ? "You should login first" : ""}>
                        <span>
                            <Button 
                                onClick={() => updateVote()} 
                                sx={{color: voteColor}} 
                                startIcon={<ThumbUpAltIcon />} 
                                disabled={email === "" ? true : false}
                            >
                                Vote
                            </Button>
                        </span>
                    </Tooltip>
                    <Tooltip title={email === "" ? "You should login first" : ""}>
                        <span>
                            <Button 
                                onClick={() => expandComment()} 
                                sx={{color: "#646464"}} 
                                startIcon={<MessageIcon />} 
                                disabled={email === "" ? true : false}
                            >
                                Comment
                            </Button>
                        </span>
                    </Tooltip>
                </div>
                <div id={id} style={{display: 'none', paddingTop: '8px', paddingBottom: '10px'}}>
                    <TextField
                        minRows={5}
                        label="Comment"
                        style={{ width: '90%' }}
                        onChange={(e) => setCurrentComment(e.target.value)}
                        multiline
                    />
                    <Button sx={{marginTop: '15px'}} onClick={() => addComment()} variant="contained" startIcon={<SendIcon />} >
                        Send
                    </Button>
                </div>
            </div>
            {showComments
            ?
                <>
                    {comments.map((val, idx) => {
                        // TODO: option to remove comments
                        return (
                            <div key={`comments_${idx}`} className='comment border-bottom'>
                                <div className='comment-content'>{val.comment}</div>
                                <div className='comment-creator'>By {val.user}</div>
                            </div>
                        )
                    })}
                </>
            : 
                <></>
            }
            <div className='sources'>
                <span className='sources-title'>Sources:</span> 
                <span className='sources-content'>
                    {sources.map((val, index) => {
                        return (
                            <span key={`${val}_${index}`}>
                                {val}
                                {(index === sources.length - 1) ? "" : ", "} 
                            </span>
                        )
                    })}
                </span>
            </div>
        </div>
    );
}

export default DisplayAnalogy;
