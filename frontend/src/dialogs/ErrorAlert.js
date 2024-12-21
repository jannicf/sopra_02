import React, { Component } from 'react';
import { Alert } from '@mui/material';

class ErrorAlert extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { message } = this.props;

        return (
            <Alert>
                {/* Wenn keine message übergeben wird, kommt die Standrad-Fehlermeldung */}
                {message || 'Es ist ein Fehler aufgetreten.'}
            </Alert>
        );
    }
}

export default ErrorAlert;