import React, { useState, useEffect } from 'react';

import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import LaunchIcon from '@mui/icons-material/Launch';
import ReportIcon from '@mui/icons-material/Report';
import MessageIcon from '@mui/icons-material/Message';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

import './DisplayAnalogy.css'
import { firebase  } from '../firebase/InitFirebase';

const db = firebase.database()

const DisplayAnalogy = ( {id, email} ) => {

    const [base, setBase] = useState([])
    const [target, setTarget] = useState([])
    const [votes, setVotes] = useState(0)
    const [voteColor, setVoteColor] = useState("#646464")
    const [labels, setLabels] = useState([""])
    

    useEffect(() => { 
        async function fetchDatabaseWithID() {
            const analogiesRef = db.ref(`analogies/${id}`);
            let elementFromDB = await analogiesRef.once('value');
            let snapshot =  elementFromDB.val();
            setBase(snapshot.base);
            setTarget(snapshot.target);
            setLabels(snapshot.references);
            setVotes(snapshot.votes.length - 1); // -1 because of empty value in db
            if (snapshot.votes.includes(email)) {
                setVoteColor("#0c6e11")
            }
          }
        fetchDatabaseWithID();
    }, [id, email])

    function addComment() {
        return
    }

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


    return (
        <div id='display-analogy-container'>
            <div className='top'>
                <div className='align-left'>
                    <ThumbUpAltIcon color='primary' sx={{ fontSize: 18, paddingTop: '8px', paddingLeft: '8px' }}  /> 
                    <span style={{fontSize: "12px"}}>{votes}</span>
                </div>
                <div className='align-right'>
                    <Tooltip title="Report inappropriate content">
                        <IconButton>
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
            <div className='votes-buttons'>
                <Button onClick={() => updateVote()} sx={{color: voteColor}} startIcon={<ThumbUpAltIcon />}>
                    Vote
                </Button>
                <Button onClick={() => addComment()} sx={{color: "#646464"}} startIcon={<MessageIcon />} disabled>
                    Comment
                </Button>
            </div>
            <div className='references'>
                <span className='references-title'>References:</span> 
                <span className='references-content'>
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
