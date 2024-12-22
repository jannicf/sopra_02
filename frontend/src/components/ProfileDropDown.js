import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import {
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Box,
  ListItemIcon
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';

const ProfileDropDown = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [person, setPerson] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (user) {
      fetchPersonData();
    }
  }, [user]);

  const fetchPersonData = async () => {
    try {
      const response = await fetch(`/wardrobe/persons-by-google-id/${user.uid}`);
      if (response.ok) {
        const personData = await response.json();
        setPerson(personData);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Person:', error);
    }
  };

  const getInitials = (person) => {
    return `${person.vorname.charAt(0)}${person.nachname.charAt(0)}`.toUpperCase();
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    const auth = getAuth();
    auth.signOut()
      .then(() => {
        document.cookie = 'token=;path=/';
        window.location.href = '/';
      })
      .catch((error) => {
        console.error('Fehler beim Ausloggen:', error);
      });
  };

  if (!user || !person) {
    return null;
  }

  return (
    <Box sx={{ position: 'absolute', top: '1rem', right: '1rem' }}>
      <IconButton
        onClick={handleClick}
        size="small"
        aria-controls={open ? 'profile-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          {getInitials(person)}
        </Avatar>
      </IconButton>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
      >
        <MenuItem disabled>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <div>
            <Typography variant="body2">
              {person.vorname} {person.nachname}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              @{person.nickname}
            </Typography>
          </div>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <Typography>Ausloggen</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ProfileDropDown;