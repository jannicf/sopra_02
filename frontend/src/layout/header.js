import React, { Component } from 'react';
import { Paper, Typography, Tabs, Tab, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ProfileDropDown from '../components/ProfileDropDown';
import HomeIcon from '@mui/icons-material/Home';
import StyleIcon from '@mui/icons-material/Style';
import CheckroomIcon from '@mui/icons-material/Checkroom';

class Header extends Component {
    constructor(props) {
        super(props);
        // empty state initialisieren
        this.state = {
            tabindex: 0
        };
    }
    // Eventhandler für Auswahl eines neuen Tabs
    handleTabChange = (newIndex) => {
        this.setState({
            tabindex: newIndex
        })
    }
    render() {
        const { user } = this.props;
        const maxWidth = user ? '1200px' : '400px';

        return (
            <Box sx={{
                maxWidth: maxWidth,
                margin: '0 auto',
                width: '100%'
            }}>
            <Paper
                elevation={0}
                sx={{
                    background: 'linear-gradient(45deg, #1a237e 30%, #3949ab 90%)',
                    color: 'white',
                    borderRadius: '10px',
                    maxWidth: maxWidth,
                    margin: '0 auto',
                    marginTop: '10px',
                    padding: '0 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    flexWrap: 'wrap',
                }}
            >
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    padding: 2,
                    gap: 2
                }}>
                     {/* Logo */}
                    <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '-10px',}}>
                        <img
                            src="/logo192.png"
                            alt="Logo"
                            style={{
                                width: 80,
                                height: 80,
                            }}
                        />
                    </Box>

                    {/* Navigation in der App */}
                    {user ? (
                        <Box sx={{
                        flexGrow: 1,
                        backgroundColor: 'rgba(158, 158, 158, 0.2)',
                        borderRadius: '25px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        padding: '8px',
                        justifyContent: 'space-evenly',
                    }}>

                        <Tabs
                            value={this.state.tabindex}
                            onChange={this.handleTabChange}
                            textColor="inherit"
                            TabIndicatorProps={{ sx: { display: 'none' } }}
                            sx={{
                                width: '100%',
                                '& .MuiTabs-flexContainer': {
                                    justifyContent: 'space-evenly',
                                },
                                '& .MuiTab-root': {
                                    flex: 1,
                                    maxWidth: 'none',
                                    minWidth: 0,
                                    fontSize: { xs: 0, md: '1.1rem' },
                                    '& .MuiSvgIcon-root': { // Icons werden kleiner bei kleinerem Bildschirm
                                        fontSize: { xs: '1.5rem', md: '2rem' },
                                    },
                                    '& .MuiTab-labelIcon .MuiTab-wrapper': {
                                        flexDirection: { xs: 'column', md: 'row' }
                                    }
                                }
                            }}
                        >
                            <Tab
                                icon={<HomeIcon />}
                                label={window.innerWidth > 600 ? "Kleiderschrank" : ""}  // Label ab 600px ausblenden
                                component={RouterLink}
                                to='/kleiderschrank'
                                disableRipple
                                sx={{
                                    borderRight: '1px solid rgba(255, 255, 255, 0.3)',
                                    padding: { xs: 1, md: 2 }
                                }}
                            />
                            <Tab
                                icon={<StyleIcon />}
                                label={window.innerWidth > 600 ? "Styles" : ""} // Label ab 600px ausblenden
                                component={RouterLink}
                                to='/styles'
                                disableRipple
                                sx={{
                                    padding: { xs: 1, md: 2 }
                                }}
                            />
                            <Tab
                                icon={<CheckroomIcon />}
                                label={window.innerWidth > 600 ? "Outfits" : ""} // Label ab 600px ausblenden
                                component={RouterLink}
                                to='/outfits'
                                disableRipple
                                sx={{
                                    borderLeft: '1px solid rgba(255, 255, 255, 0.3)',
                                    padding: { xs: 1, md: 2 }
                                }}
                            />
                        </Tabs>
                    </Box>
                        ):

                        (
                    <Box sx={{
                        flexGrow: 1,
                        display: { xs: 'none', md: 'block' },
                        textAlign: 'center'
                    }}>
                        <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
                            MEIN
                        </Typography>
                        <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
                            DIGITALER
                        </Typography>
                        <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
                            KLEIDERSCHRANK
                        </Typography>
                    </Box>
                    )}

                    {/* Profil-Button */}
                    {user && <ProfileDropDown user={user} onLogout={this.props.onLogout} />}
                </Box>
            </Paper>
        </Box>
        );
    }
}

export default Header;