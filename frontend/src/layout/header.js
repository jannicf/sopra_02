import React, { Component } from 'react';
import { Paper, Typography, Tabs, Tab, Box, useTheme } from '@mui/material';
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
            <Paper
                elevation={0}
                sx={{
                    // Getauschte Blautöne im Verlauf
                    background: 'linear-gradient(45deg, #1a237e 30%, #3949ab 90%)',
                    color: 'white',
                    borderRadius: 0
                }}
            >
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%'
                }}>
                    {/* Oberer Teil mit Logo und Profil */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 2,
                        position: 'relative'
                    }}>
                        {/* Logo links */}
                        <Box sx={{
                            position: 'absolute',
                            left: 16,
                            zIndex: 1
                        }}>
                            <img
                                src="/logo192.png"
                                alt="Logo"
                                style={{
                                    width: 45,
                                    height: 45,
                                }}
                            />
                        </Box>

                        {/* Zentrierter Text */}
                        <Box sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            <Typography
                                variant='h4'
                                sx={{
                                    fontWeight: 'bold',
                                    color: '#90caf9',
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                                }}
                            >
                                Mein digitaler Kleiderschrank
                            </Typography>
                        </Box>

                        {/* Profile-Button rechts */}
                        <Box sx={{
                            position: 'absolute',
                            right: 16,
                            zIndex: 1
                        }}>
                            <ProfileDropDown user={user} onLogout={this.props.onLogout} />
                        </Box>
                    </Box>

                    {/* Tabs mit leicht transparentem Hintergrund */}
                    {user &&
                        <Paper
                            sx={{
                                background: 'rgba(255,255,255,0.95)',
                                borderRadius: 0
                            }}
                        >
                            <Tabs
                                indicatorColor='primary'
                                textColor='primary'
                                centered
                                value={this.state.tabindex}
                                onChange={this.handleTabChange}
                            >
                                <Tab label='Kleiderschrank' component={RouterLink} to='/kleiderschrank' />
                                <Tab label='Styles' component={RouterLink} to='/styles' />
                                <Tab label='Outfits' component={RouterLink} to='/outfits' />
                            </Tabs>
                        </Paper>
                    }
                </Box>
            </Paper>
        );
  }
}

export default Header;