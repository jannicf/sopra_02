// ProfileDropDown.js
import React, { Component } from 'react';
import { Button, Menu, MenuItem, Avatar } from '@mui/material';

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
                    <MenuItem onClick={this.handleClose}>Profil</MenuItem>
                    <MenuItem onClick={this.handleClose}>Ausloggen</MenuItem>
                </Menu>
            </div>
        );
    }
}

export default ProfileDropDown;