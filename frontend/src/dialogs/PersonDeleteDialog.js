import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import KleiderschrankAPI from '../api/KleiderschrankAPI';

class PersonDeleteDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null
    };
  }

  handleDelete = async () => {
    const { person, onClose } = this.props;

    try {
        this.setState({ loading: true });

        // Person löschen
        await KleiderschrankAPI.getAPI().deletePerson(person);

        // Timeout, damit der Server Zeit hat
        await new Promise(resolve => setTimeout(resolve, 500));

        // Dialog schließen und true zurückgeben für erfolgreiche Löschung
        onClose(true);

    } catch (error) {
        console.error('Fehler beim Löschen des Profils:', error);
        this.setState({
            error: 'Fehler beim Löschen des Profils. Bitte versuchen Sie es später erneut.',
            loading: false
          });
      }
  };

  render() {
    const { show, onClose } = this.props;
    const { loading, error } = this.state;

    return (
      <Dialog
        open={show}
        onClose={() => onClose(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: 'error.main' }}>
            Profil löschen
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography gutterBottom>
              Möchten Sie Ihr Profil wirklich löschen?
            </Typography>
            <Typography variant="body2" color="error">
              Achtung: Diese Aktion kann nicht rückgängig gemacht werden. Folgende Daten werden gelöscht:
            </Typography>
            <Box component="ul" sx={{ mt: 1 }}>
              <li>Ihr Profil</li>
              <li>Ihr Kleiderschrank</li>
              <li>Alle Ihre Kleidungsstücke</li>
              <li>Alle Ihre Outfits</li>
            </Box>
          </Box>
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => onClose(false)}
            disabled={loading}
          >
            Abbrechen
          </Button>
          <Button
            onClick={this.handleDelete}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Wird gelöscht...' : 'Endgültig löschen'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default PersonDeleteDialog;