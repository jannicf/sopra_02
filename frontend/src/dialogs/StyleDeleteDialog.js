import React, { Component } from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography} from '@mui/material';
import KleiderschrankAPI from '../api/KleiderschrankAPI';

class StyleDeleteDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      affectedOutfits: [],
      affectedKleidungstypen: [],
      affectedKleidungsstuecke: [],
      loading: false,
      error: null
    };
  }

  componentDidMount() {
    if (this.props.show) {
      this.checkAffectedItems();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.show && !prevProps.show) {
      this.checkAffectedItems();
    }
  }

  checkAffectedItems = async () => {
    if (!this.props.style) return;

    this.setState({ loading: true });
    try {
      const api = KleiderschrankAPI.getAPI();
      const [outfits, allKleidungstypen, allKleidungsstuecke] = await Promise.all([
        api.getOutfits(),
        api.getKleidungstypen(),
        api.getKleidungsstuecke()
      ]);

      // Filtere die Outfits nach dem Style
      const affectedOutfits = outfits.filter(outfit =>
          outfit.getStyle() && outfit.getStyle().getID() === this.props.style.getID()
      );

      // Finde Kleidungstypen, die nur diesen Style haben
      const affectedKleidungstypen = allKleidungstypen.filter(typ => {
        const verwendungen = typ.getVerwendungen();
        return verwendungen.length === 1 && verwendungen[0].getID() === this.props.style.getID();
      });

      // Finde Kleidungsstücke, die betroffene Kleidungstypen verwenden
      const affectedTypIds = affectedKleidungstypen.map(typ => typ.getID());
      const affectedKleidungsstuecke = allKleidungsstuecke.filter(stueck =>
        affectedTypIds.includes(stueck.getTyp().getID())
      );

      this.setState({
        affectedOutfits,
        affectedKleidungstypen,
        affectedKleidungsstuecke,
        loading: false
      });
    } catch (error) {
      this.setState({
        error: "Fehler beim Prüfen der betroffenen Elemente",
        loading: false
      });
    }
  }

  handleDelete = async () => {
    const { style, onClose } = this.props;
    const { affectedOutfits, affectedKleidungsstuecke, affectedKleidungstypen } = this.state;

    this.setState({ loading: true });
    try {
      const api = KleiderschrankAPI.getAPI();

      // Löschen in korrekter Reihenfolge zur Erhaltung der referenziellen Integrität
      // 1. Lösche betroffene Outfits
      for (const outfit of affectedOutfits) {
        await api.deleteOutfit(outfit.getID());
      }

      // 2. Lösche betroffene Kleidungsstücke
      for (const stueck of affectedKleidungsstuecke) {
        await api.deleteKleidungsstueck(stueck.getID());
      }

      // 3. Lösche betroffene Kleidungstypen
      for (const typ of affectedKleidungstypen) {
        await api.deleteKleidungstyp(typ.getID());
      }

      // 4. Zuletzt den Style selbst löschen
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
    const {
      affectedOutfits,
      affectedKleidungstypen,
      affectedKleidungsstuecke,
      loading,
      error
    } = this.state;

    return (
      <Dialog open={show} onClose={() => onClose(null)}>
        <DialogTitle>
          Style löschen
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Möchten Sie den Style "{style?.getName()}" wirklich löschen?
          </Typography>

          {(affectedOutfits.length > 0 ||
            affectedKleidungstypen.length > 0 ||
            affectedKleidungsstuecke.length > 0) && (
            <>
              <Typography variant="body2" sx={{ mt: 2, color: 'warning.main' }}>
                Achtung: Das Löschen des Styles hat folgende Konsequenzen:
              </Typography>

              <Box sx={{ mt: 1, ml: 2 }}>
                {affectedOutfits.length > 0 && (
                  <>
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
                  </>
                )}
                {affectedKleidungstypen.length > 0 && (
                  <Typography color="warning.main">
                    • {affectedKleidungstypen.length} Kleidungstyp(en)
                  </Typography>
                )}
                {affectedKleidungsstuecke.length > 0 && (
                  <Typography color="warning.main">
                    • {affectedKleidungsstuecke.length} Kleidungsstück(e)
                  </Typography>
                )}
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
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Wird gelöscht...' : 'Löschen'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default StyleDeleteDialog;