import React, { useState, useEffect, forwardRef } from 'react';

import Button from '@mui/material/Button';
import MuiAlert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';
import LaunchIcon from '@mui/icons-material/Launch';
import ReportIcon from '@mui/icons-material/Report';
import MessageIcon from '@mui/icons-material/Message';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import TextareaAutosize from '@mui/material/TextareaAutosize'

import './DisplayAnalogy.css'
import { firebase  } from '../../firebase/InitFirebase';

const db = firebase.database()

const DisplayAnalogy = ( {id, values, email, showComments} ) => {

    const [base, setBase] = useState([])
    const [target, setTarget] = useState([])
    const [votes, setVotes] = useState(0)
    const [voteColor, setVoteColor] = useState("#646464")
    const [labels, setLabels] = useState([""])
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [comments, setComments] = useState([])
    const [currentComment, setCurrentComment] = useState("")
    const analogiesRef = db.ref(`analogies/${id}`);
    
    function setStates(obj) {
        setBase(obj.base);
        setTarget(obj.target);
        setLabels(obj.sources);
        setVotes(obj.votes.length - 1); // -1 because of empty value in db
        setComments(obj.comments.slice(1))
        if (obj.votes.includes(email)) {
            setVoteColor("#0c6e11")
        }
    }

    useEffect(() => { 
        if (values !== null && values !== undefined && Object.keys(values).length > 0) {
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
        let snapshot =  elementFromDB.val();
        let comments = snapshot.comments;
        if (!comments) {
            comments = []
        }
        let comment = {
            user: email,
            comment: currentComment
        }
        comments.push(comment)
        elementFromDB.ref.update({
            comments: comments
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
        const analogiesRef = db.ref(`analogies/${id}`);
        async function _updateVote() {
            let elementFromDB = await analogiesRef.once('value');
            let snapshot =  elementFromDB.val();
            let refVotes = snapshot.votes;
            const refVotesIndex = refVotes.indexOf(email);
            let votesToAdd = 0
            let color = ""

            if (refVotesIndex >= 0) {
                refVotes.splice(refVotesIndex, 1);
                votesToAdd = -1
                color = "#646464"
            }
            else {
                refVotes.push(email)
                votesToAdd = 1
                color = "#0c6e11"
            }

            elementFromDB.ref.update({
                votes: refVotes
            });
            setVoteColor(color)
            setVotes((prevState) => prevState + votesToAdd);
          }
          _updateVote();
    }

    const mailTitle = "Report inappropriate content"
    const mailBody = `Analogy id ${id}`

    return (
        <div id='display-analogy-container'>
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
                            {votes}
                        </span>
                    </span>
                    <span>
                        <ChatBubbleIcon 
                            onClick={() => window.open(`/analogy?id=${id}`)} 
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
                        <IconButton onClick={() => window.open(`/analogy?id=${id}`)}>
                            <LaunchIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
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
                    <TextareaAutosize
                        aria-label="minimum height"
                        minRows={3}
                        placeholder="Add your comment here ..."
                        style={{ width: '90%' }}
                        onChange={(e) => setCurrentComment(e.target.value)}

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
                    {labels.map((val, index) => {
                        return (
                            <span key={`${val}_${index}`}>
                                {val}
                                {(index === labels.length - 1) || (val === "") ? "" : ", "} 
                            </span>
                        )
                    })}
                </span>
            </div>
        </div>
    );
}

export default DisplayAnalogy;
