import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

import KleiderschrankAPI from "../api/KleiderschrankAPI";

class KleidungsstueckDeleteDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      affectedOutfits: [] // Outfits, die gelöscht werden
    };
  }

  // Wenn der Dialog geöffnet wird, prüfen wir, welche Outfits betroffen sind
  componentDidUpdate(prevProps) {
    if (this.props.show && !prevProps.show) {
      this.checkAffectedOutfits();
    }
  }

  // Prüft, welche Outfits das Kleidungsstück enthalten
  checkAffectedOutfits = async () => {
    try {
      const response = await fetch(`/wardrobe/outfits`);
      const outfits = await response.json();

      // Finde alle Outfits, die das Kleidungsstück enthalten
      const affected = outfits.filter(outfit =>
        outfit.bausteine.some(baustein =>
          baustein.id === this.props.kleidungsstueck.id
        )
      );

      this.setState({ affectedOutfits: affected });
    } catch (error) {
      console.error("Fehler beim Prüfen der betroffenen Outfits:", error);
    }
  }

  render() {
    const { show, onClose, kleidungsstueck } = this.props;
    const { affectedOutfits } = this.state;

    return (
      <Dialog open={show} onClose={() => onClose(null)}>
        <DialogTitle>
          Kleidungsstück löschen
        </DialogTitle>
        <DialogContent>
          <p>Möchten Sie das Kleidungsstück "{kleidungsstueck?.name}" wirklich löschen?</p>

          {affectedOutfits.length > 0 && (
            <p style={{ color: 'orange' }}>
              Achtung: Durch das Löschen werden auch {affectedOutfits.length} Outfit(s)
              gelöscht, die dieses Kleidungsstück verwenden.
            </p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose(null)}>
            Abbrechen
          </Button>
          <Button
            color="secondary"
            onClick={async () => {
              try {
                // Erst die betroffenen Outfits löschen
                for (const outfit of affectedOutfits) {
                  await KleiderschrankAPI.getAPI().deleteOutfit(outfit.id);
                }

                // Dann das Kleidungsstück löschen
                await KleiderschrankAPI.getAPI().deleteKleidungsstueck(kleidungsstueck.getID());

                onClose(kleidungsstueck);
              } catch (error) {
                console.error("Fehler beim Löschen:", error);
              }
            }}
          >
            Löschen
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default KleidungsstueckDeleteDialog;