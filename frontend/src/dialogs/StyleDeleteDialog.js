import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
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

      // Outfits finden, die diesen Style verwenden
      const affectedOutfits = outfits.filter(outfit =>
        outfit.getStyle().getID() === this.props.style.getID()
      );

      // Kleidungstypen finden, die nur diesen Style haben
      const affectedKleidungstypen = allKleidungstypen.filter(typ => {
        const verwendungen = typ.getVerwendungen();
        return verwendungen.length === 1 && verwendungen[0].getID() === this.props.style.getID();
      });

      // Kleidungsstücke finden, die betroffene Kleidungstypen verwenden
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
      // 1. Betroffene Outfits löschen
      for (const outfit of affectedOutfits) {
        await api.deleteOutfit(outfit.getID());
      }

      // 2. Betroffene Kleidungsstücke löschen
      for (const stueck of affectedKleidungsstuecke) {
        await api.deleteKleidungsstueck(stueck.getID());
      }

      // 3. Betroffene Kleidungstypen löschen
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
          <p>Möchten Sie den Style "{style?.getName()}" wirklich löschen?</p>

          {(affectedOutfits.length > 0 ||
            affectedKleidungstypen.length > 0 ||
            affectedKleidungsstuecke.length > 0) && (
            <div style={{ color: 'orange' }}>
              <p>Achtung: Folgende Elemente werden ebenfalls gelöscht:</p>
              {affectedOutfits.length > 0 && (
                <p>{affectedOutfits.length} Outfit(s)</p>
              )}
              {affectedKleidungstypen.length > 0 && (
                <p>{affectedKleidungstypen.length} Kleidungstyp(en)</p>
              )}
              {affectedKleidungsstuecke.length > 0 && (
                <p>{affectedKleidungsstuecke.length} Kleidungsstück(e)</p>
              )}
            </div>
          )}

          {error && <p style={{ color: 'red' }}>{error}</p>}
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