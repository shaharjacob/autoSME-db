import React, { useRef, useState, useEffect } from 'react';

import Link from '@mui/material/Link';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import InfoIcon from '@mui/icons-material/Info';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import DownloadIcon from '@mui/icons-material/Download';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';

import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import IconButton from '@mui/material/IconButton';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import './Navbar.css'
import Login from '../google/Login'
import Logout from '../google/Logout'
import Logo from '../../assets/hyadata.png'


const Navbar = ( { user, setUser, setEmail } ) => {

  const [openMenu, setOpenMenu] = useState(false);
  const anchorRef = useRef(null)

  const handleToggle = () => {
    setOpenMenu((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpenMenu(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpenMenu(false);
    } else if (event.key === 'Escape') {
      setOpenMenu(false);
    }
  }

  const prevOpen = useRef(openMenu);
  useEffect(() => {
    if (prevOpen.current === true && openMenu === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = openMenu;
  }, [openMenu]);

  return (
    <div className='navbar-container'>
        <div className='grid-menu'>
          <IconButton
            ref={anchorRef}
            id="composition-button"
            aria-controls={openMenu ? 'composition-menu' : undefined}
            aria-expanded={openMenu ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}>
              <MenuIcon />
          </IconButton>
          <Popper
            open={openMenu}
            anchorEl={anchorRef.current}
            role={undefined}
            placement="bottom-start"
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === 'bottom-start' ? 'left top' : 'left bottom',
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList
                      autoFocusItem={openMenu}
                      id="composition-menu"
                      aria-labelledby="composition-button"
                      onKeyDown={handleListKeyDown}
                    >
                      <Link href="/dataset" color='inherit' underline='none'>
                        <MenuItem>
                          <ListItemIcon><AutoAwesomeMotionIcon fontSize="small" /></ListItemIcon>
                          <ListItemText>All analogies</ListItemText>
                        </MenuItem>
                      </Link>

                      <Link href="/random" color='inherit' underline='none'>
                        <MenuItem>
                          <ListItemIcon><ShuffleIcon fontSize="small" /></ListItemIcon>
                          <ListItemText>Random analogy</ListItemText>
                        </MenuItem>
                      </Link>

                      <Link href="/create" color='inherit' underline='none'>
                        <MenuItem>
                          <ListItemIcon><AddIcon fontSize="small" /></ListItemIcon>
                          <ListItemText>Create analogy</ListItemText>
                        </MenuItem>
                      </Link>

                      <Link href="/about" color='inherit' underline='none'>
                        <MenuItem>
                          <ListItemIcon><DownloadIcon fontSize="small" /></ListItemIcon>
                          <ListItemText>Download data</ListItemText>
                        </MenuItem>
                      </Link>

                      <Link href="/about" color='inherit' underline='none'>
                        <MenuItem>
                          <ListItemIcon><InfoIcon fontSize="small" /></ListItemIcon>
                          <ListItemText>About</ListItemText>
                        </MenuItem>
                      </Link>

                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
        <div className='grid-logo'>
          <a href="http://www.hyadatalab.com/" style={{textDecoration: "none"}} rel="noreferrer" target="_blank">
            <img src={Logo} className='logo' alt="hyadata lab" />
          </a>
        </div>
        <div></div>
        <div className='right-side'>
          <span className='hello-user'>
            {user}
          </span>
          <Login setUser={setUser} setEmail={setEmail} />
          <Logout setUser={setUser} setEmail={setEmail} />
        </div>
    </div>
  );
}

export default Navbar;