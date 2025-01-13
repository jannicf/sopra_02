import React, { Component } from 'react';
import { Avatar, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';

class ProfileDropDown extends Component {
    state = {
        menuOpen: false
    };

    // Einfaches Toggle für das Menü
    toggleMenu = () => {
        this.setState(prevState => ({
            menuOpen: !prevState.menuOpen
        }));
    };

    // Logout Handler
    handleLogout = () => {
        this.setState({ menuOpen: false });
        this.props.onLogout();
    };

    render() {
        const { user } = this.props;
        const { menuOpen } = this.state;

        return (
            <Box>
                {/* Avatar Button */}
                <IconButton
                    onClick={this.toggleMenu}
                    ref={button => this.buttonRef = button}
                >
                    <Avatar
                        src={user?.photoURL}
                        sx={{
                            width: 60,
                            height: 60,
                            border: '2px solid white'
                        }}
                    />
                </IconButton>

                {/* Dropdown Menü */}
                <Menu
                    open={menuOpen}
                    onClose={this.toggleMenu}
                    anchorEl={this.buttonRef}
                >
                    <MenuItem component={Link} to="/profile" onClick={this.toggleMenu}>
                        Profil
                    </MenuItem>
                    <MenuItem onClick={this.handleLogout}>
                        Ausloggen
                    </MenuItem>
                </Menu>
            </Box>
        );
    }
}

export default ProfileDropDown;