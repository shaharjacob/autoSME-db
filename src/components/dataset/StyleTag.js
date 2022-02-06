import React from 'react';
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';

import './StyleTag.css'

function Tag(props) {
  const { label, onDelete } = props;
  return (
    <div className='tag-wrapper'>
      <span className='tag-label'>{label}</span>
      <CloseIcon sx={{fontSize: 10}} onClick={onDelete} />
    </div>
  );
}

Tag.propTypes = {
  label: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export const StyledTag = Tag;