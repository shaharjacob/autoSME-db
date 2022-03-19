import React, { useState, useEffect, forwardRef } from 'react';

import Button from '@mui/material/Button';
import MuiAlert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import LaunchIcon from '@mui/icons-material/Launch';
import ReportIcon from '@mui/icons-material/Report';
import MessageIcon from '@mui/icons-material/Message';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

import './DisplayAnalogy.css'
import { isNull } from '../../../utils'
import { firebase  } from '../../firebase/InitFirebase';
import structuredClone from '@ungap/structured-clone';

const db = firebase.database()

const DisplayAnalogy = ( {id, values, email, showComments} ) => {
    
    const mailTitle = "Report inappropriate content"
    const mailBody = `Analogy id ${id}`

    // required db fields
    const [base, setBase] = useState([])
    const [target, setTarget] = useState([])
    const [creator, setCreator] = useState("")

    // optional db fields
    const [story, setStory] = useState({base: "", target: ""})
    const [votes, setVotes] = useState([])
    const [voteColor, setVoteColor] = useState("#646464")
    const [sources, setSources] = useState([""])
    const [comments, setComments] = useState([])

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [currentComment, setCurrentComment] = useState("")
    const analogiesRef = db.ref(`analogies/${id}`);

    useEffect(() => { 
        function setStates(obj) {
            // required fields
            setBase(obj.base)
            setTarget(obj.target)
            setCreator(obj.creator)
    
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
            }
            fetchDatabaseWithID();
        }
    }, [id, values, email])

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
                        <IconButton onClick={() => window.open(`mailto:shahar.jacob@mail.huji.ac.il?subject=${mailTitle}&body=${mailBody}`)}>
                            <ReportIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Open in a new tab">
                        <IconButton onClick={() => window.open(`/analogy?id=${id}`)} disabled={showComments ? true : false}>
                            <LaunchIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Analogy">
                        <IconButton onClick={() => window.open(`/edit?id=${id}`)} disabled={creator !== email ? true : false}>
                            <EditIcon />
                        </IconButton>
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
                            <div></div>
                        </div>
                    )
                })}
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
