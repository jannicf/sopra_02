import React, { Component } from 'react';
import { Button, Menu, MenuItem, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

class ProfileDropDown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null
        };
    }

    handleClick = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    handleLogout = () => {
        this.handleClose();
        this.props.onLogout();
    };

    handleProfileClick = () => {
        this.handleClose(); // Menü schließen
        this.props.navigate('/profile'); // Zur Profilseite navigieren
    };

    render() {
        const { user } = this.props;
        const { anchorEl } = this.state;

        return (
            <div>
                <Button onClick={this.handleClick}>
                    <Avatar src={user?.photoURL} />
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={this.handleProfileClick}>Profil</MenuItem>
                    <MenuItem onClick={this.handleLogout}>Ausloggen</MenuItem>
                </Menu>
            </div>
        );
    }
}

// Wrapper für den Router-Hook
function ProfileDropDownWithRouter(props) {
    const navigate = useNavigate();
    return <ProfileDropDown {...props} navigate={navigate} />;
}

export default ProfileDropDownWithRouter;