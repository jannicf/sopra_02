import React, { Component } from 'react';
import {Box, Button, Grid, Typography} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

/**
 * Renders a landing page for users who are not logged in. Provides a log in button
 * for using an existing google account to log in. The component uses firebase to
 * do redirect based signin process.
 *
 */
class Login extends Component {

	constructor(props) {
		super(props)
	}

	handleLoginButtonClicked = () => {
        this.props.onSignIn();
    }
	// rendert die Login Page
	render() {
		return (
			<div>
				<Typography sx={{marginTop: 4}} align='center' variant='h2'>Herzlich Wilkommen</Typography>
				<Typography sx={{marginTop: 2}} align='center' variant='h2'>bei Ihrem digitalen Kleiderschrank</Typography>
				<Typography sx={{marginTop: 4}} align='center' variant='h6'>Bitte loggen Sie sich zur Nutzung der App ein</Typography>
				<br/>
				<Grid container justifyContent='center'>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleLoginButtonClicked}
                        sx={{
							marginTop: 2,
                            width: 300,
                            p: 2,
                            textAlign: 'center',
                            borderRadius: 2,
                            boxShadow: 2,
                            bgcolor: 'primary.main',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                transition: 'all 0.2s'
                            }
                        }}
                        disableRipple
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <GoogleIcon sx={{ color: 'white', fontSize: '2rem' }} />
                            <Typography sx={{ mt: 1, color: 'white' }}>
                                Mit Google einloggen
                            </Typography>
                        </Box>
                    </Button>
                </Grid>
                <br/>
            </div>
        );
    }
}

export default Login;