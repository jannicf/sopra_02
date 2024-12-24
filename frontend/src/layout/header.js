import React, { Component } from 'react';
import { Paper, Typography, Tabs, Tab } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ProfileDropDown from '../components/ProfileDropDown';

class Header extends Component {
    constructor(props) {
        super(props);
        // empty state initialisieren
        this.state = {
            tabindex: 0
        };
    }
    // Eventhandler für Auswahl eines neuen Tabs
    handleTabChange = (e, newIndex) => {
        this.setState({
            tabindex: newIndex
        })
    }
    render() {
        const { user } = this.props;

        return (
          <Paper variant='outlined' >
            <ProfileDropDown user={user} onLogout={this.props.onLogout} />
            <Typography variant='h3' component='h1' align='center'>
            Mein digitaler Kleiderschrank
            </Typography>
            <Typography variant='h4' component='h2' align='center'>
                SoPra 24/25 - Gruppe 02
            </Typography>
            {
              user ?
                <Tabs indicatorColor='primary' textColor='primary' centered value={this.state.tabindex} onChange={this.handleTabChange} >
                  <Tab label='Kleiderschrank' component={RouterLink} to='/kleiderschrank' />
                  <Tab label='Styles' component={RouterLink} to='/styles' />
                  <Tab label='Outfits' component={RouterLink} to='/outfits' />
                </Tabs>
                : null
            }
          </Paper>
        )
  }
}

export default Header;