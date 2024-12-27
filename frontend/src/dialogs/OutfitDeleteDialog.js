import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

class OutfitDeleteDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Da Outfits keine weiteren Abhängigkeiten haben, die gelöscht werden müssen,
            // brauchen wir hier keinen zusätzlichen State wie bei KleidungsstueckDeleteDialog
        };
    }

    handleClose = () => {
        // Dialog schließen ohne Aktion & dies der übergeordneten Komponente zeigen
        this.props.onClose(null);
    };

    handleDelete = () => {
        // Outfit löschen und Dialog schließen
        this.props.onClose(this.props.outfit);
    };

    render() {
        const { show, outfit } = this.props;

        return (
            <Dialog
                open={show}
                onClose={this.handleClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Outfit löschen
                </DialogTitle>
                <DialogContent>
                    <p>Möchten Sie das Outfit "{outfit?.get_style()?.get_name()}" wirklich löschen?</p>
                    <p style={{ color: 'orange' }}>Achtung: Diese Aktion kann nicht rückgangig gemacht werden!</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose}>
                        Abbrechen
                    </Button>
                    <Button
                        onClick={this.handleDelete}
                        color="error"
                        variant="contained"
                    >
                        Löschen
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default OutfitDeleteDialog;