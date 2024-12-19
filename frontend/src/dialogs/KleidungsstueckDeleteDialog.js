import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

class KleidungsstueckDeleteDialog extends Component {
  render() {
    const { show, onClose, kleidungsstueck } = this.props;

    return (
      <Dialog open={show} onClose={() => onClose(null)}>
        <DialogTitle>
          Kleidungsstück löschen
        </DialogTitle>
        <DialogContent>
          Möchten Sie das Kleidungsstück "{kleidungsstueck.name}" wirklich löschen?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose(null)}>
            Abbrechen
          </Button>
          <Button color="secondary" onClick={() => onClose(kleidungsstueck)}>
            Löschen
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}