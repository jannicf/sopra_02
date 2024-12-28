import React, { Component } from 'react';
import { Paper, Typography, Tabs, Tab } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabindex: 0
        };
    }

    // Event-Handler für Tab-Änderungen
    handleTabChange = (e, newIndex) => {
        this.setState({
            tabindex: newIndex
        });
    };

    render() {
        const { user } = this.props;

        return (
            <Paper
                variant='outlined'
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    marginTop: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    px: 2
                }}
            >
                {/* Footer erst Anzeigen wenn User eingeloggt ist */}
                {
                user ?
                <Typography variant='h6' align='center'>
                    SoPra WS 24/25 - Gruppe 02
                </Typography>
                : null
                }
            {
              user ?
                <Tabs indicatorColor='primary' textColor='primary' value={this.state.tabindex} onChange={this.handleTabChange} >
                  <Tab label='Über uns' component={RouterLink} to='/about' />
                </Tabs>
                : null
            }
          </Paper>
        )
  }
}

export default Footer;

