import React, { Component } from 'react';
import { Button, Grid, Typography } from '@mui/material';

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
				<Typography align='center' variant='h2'>Wilkommen beim digitalen Kleiderschrank</Typography>
				<br />
				<Typography align='center' variant='h6'>Bitte loggen Sie sich zur Nutzung der App ein</Typography>
				<br />
				<Grid container justify='center'>
					<Button variant='contained' color='primary'
							onClick={this.props.handleLoginButtonClicked}>Mit Google einloggen
					</Button>
				</Grid>
				<br/>
			</div>
		);
	}
}

export default Login;