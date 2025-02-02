import React, { Component } from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography} from '@mui/material';
import KleiderschrankAPI from '../api/KleiderschrankAPI';

class StyleDeleteDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      affectedOutfits: [],
      loading: false,
      error: null
    };
  }

  componentDidMount() {
    if (this.props.show) {
      this.checkAffectedOutfits();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.show && !prevProps.show) {
      this.checkAffectedOutfits();
    }
  }

  checkAffectedOutfits = async () => {
    if (!this.props.style) return;

    this.setState({ loading: true });
    try {
      const api = KleiderschrankAPI.getAPI();
      const outfits = await api.getOutfits();

      // Filtere die Outfits nach dem Style
      const affectedOutfits = outfits.filter(outfit =>
          outfit.getStyle() && outfit.getStyle().getID() === this.props.style.getID()
      );

      this.setState({
        affectedOutfits,
        loading: false
      });
    } catch (error) {
      this.setState({
        error: "Fehler beim Prüfen der betroffenen Outfits",
        loading: false
      });
    }
  }

  handleDelete = async () => {
    const { style, onClose } = this.props;
    const { affectedOutfits } = this.state;

    this.setState({ loading: true });
    try {
      const api = KleiderschrankAPI.getAPI();

      // Löschen in korrekter Reihenfolge zur Erhaltung der referenziellen Integrität
      // Betroffene Outfits löschen
      for (const outfit of affectedOutfits) {
        await api.deleteOutfit(outfit.getID());
      }

      // Den Style selbst löschen
      await api.deleteStyle(style.getID());

      onClose(style);
    } catch (error) {
      this.setState({
        error: "Fehler beim Löschen des Styles",
        loading: false
      });
    }
  }

  render() {
    const { show, style, onClose } = this.props;
    const { affectedOutfits, loading, error } = this.state;

    return (
      <Dialog open={show} onClose={() => onClose(null)}>
        <DialogTitle>
          Style löschen
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Möchten Sie den Style "{style?.getName()}" wirklich löschen?
          </Typography>

          {affectedOutfits.length > 0 && (
            <>
              <Typography variant="body2" sx={{ mt: 2, color: 'warning.main' }}>
                Achtung: Das Löschen des Styles hat folgende Konsequenzen:
              </Typography>

              <Box sx={{ mt: 1, ml: 2 }}>
                <Typography color="warning.main">
                  • {affectedOutfits.length} Outfit(s) werden gelöscht:
                </Typography>
                <Box sx={{ ml: 2 }}>
                  {affectedOutfits.map((outfit) => (
                    <Typography key={outfit.getID()} color="warning.main">
                      - Outfit {outfit.getID()}
                    </Typography>
                  ))}
                </Box>
              </Box>

              <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                Diese Aktion kann nicht rückgängig gemacht werden!
              </Typography>
            </>
          )}

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => onClose(null)}
            disabled={loading}
          >
            Abbrechen
          </Button>
          <Button
            onClick={this.handleDelete}
            color="error"
            disabled={loading}
          >
            Löschen
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default StyleDeleteDialog;