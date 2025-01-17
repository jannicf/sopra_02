import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import KleiderschrankAPI from '../api/KleiderschrankAPI';

class OutfitDeleteDialog extends Component {
  constructor(props) {
    super(props);
  }

  handleClose = () => {
    this.props.onClose(null);
  };

  handleDelete = () => {
    const { outfit } = this.props;

    KleiderschrankAPI.getAPI().deleteOutfit(outfit.getID())
      .then(() => {
        this.props.onClose(outfit);
      })
      .catch(error => {
        console.error('Error:', error);
        this.props.onClose(null);
      });
  };

  render() {
    const { show } = this.props;

    return (
      <Dialog
        open={show}
        onClose={this.handleClose}
        maxWidth='xs'
        fullWidth
      >
        <DialogTitle>
          Outfit löschen
        </DialogTitle>
        <DialogContent>
          <Typography>
            Möchten Sie das Outfit wirklich löschen?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose}>
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