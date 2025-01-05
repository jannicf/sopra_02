import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import KleiderschrankAPI from '../api/KleiderschrankAPI';

class OutfitDeleteDialog extends Component {
    handleClose = () => {
        this.props.onClose(null);
    };

    handleDelete = async () => {
        try {
            const { outfit } = this.props;
            await KleiderschrankAPI.getAPI().deleteOutfit(outfit.getID());
            this.props.onClose(outfit);
        } catch (error) {
            console.error('Fehler beim Löschen:', error);
            this.props.onClose(outfit);
        }
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
                    <p>Möchten Sie das Outfit "#{outfit?.getID()}" wirklich löschen?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} disabled={false}>
                        Abbrechen
                    </Button>
                    <Button
                        onClick={this.handleDelete}
                        color="error"
                    >
                        Löschen
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default OutfitDeleteDialog;