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
                    background: 'linear-gradient(45deg, #1a237e 30%, #3949ab 90%)',
                    color: 'white',
                    borderRadius: '10px',
                    maxWidth: '1200px',
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
                        padding: '8px'
                    }}>

                            <Tabs
                                value={this.state.tabindex}
                                onChange={this.handleTabChange}
                                textColor="inherit"
                                TabIndicatorProps={{ sx: { display: 'none' } }} // keine blaue Leiste mehr unten dran
                            >
                                <Tab
                                    icon={<HomeIcon />}
                                    label="Kleiderschrank"
                                    component={RouterLink}
                                    to='/kleiderschrank'
                                    disableRipple
                                />
                                <Tab
                                    icon={<StyleIcon />}
                                    label="Styles"
                                    component={RouterLink}
                                    to='/styles'
                                    disableRipple
                                />
                                <Tab
                                    icon={<CheckroomIcon />}
                                    label="Outfits"
                                    component={RouterLink}
                                    to='/outfits'
                                    disableRipple
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

                    {/* Profile-Button */}
                    {user && <ProfileDropDown user={user} onLogout={this.props.onLogout} />}
                </Box>
            </Paper>
        );
    }
}

export default Header;