import React, { Component } from 'react';
import { Alert } from '@mui/material';

class ErrorAlert extends Component {
    render() {
        const { message, onClose} = this.props;

        return (
            <Alert severity="error" onClose={onClose}>
                {/* Wenn keine message übergeben wird, kommt die Standrad-Fehlermeldung */}
                {message || 'Es ist ein Fehler aufgetreten.'}
            </Alert>
        );
    }
}

export default ErrorAlert;