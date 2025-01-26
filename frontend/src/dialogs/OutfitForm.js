import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem, FormControl, InputLabel, List,
  ListItem, ListItemText, Typography, Box } from '@mui/material';
import OutfitBO from '../api/OutfitBO';
import StyleBO from '../api/StyleBO';
import KleidungsstueckBO from '../api/KleidungsstueckBO';

/**
 * Komponente zur Erstellung und Bearbeitung von Outfits.
 * Implementiert die Formular-Logik unter Verwendung der Business Objects
 * zur Einhaltung der mehrschichtigen Architektur.
 */
class OutfitForm extends Component {
  constructor(props) {
    super(props);

    // Initialisierung des States mit Business Objects
    this.state = {
      outfit: props.outfit ? props.outfit : new OutfitBO(), // Outfit Business Object
      alleStyles: [], // Array von StyleBO Objekten
      alleKleidungsstuecke: [], // Array von KleidungsstueckBO Objekten
      ausgewaehlteKleidungsstuecke: [], // Ausgewählte KleidungsstueckBO Objekte
      error: null
    };
  }

  // Behandelt Änderungen der übergebenen Props
  componentDidUpdate(prevProps) {
    if (this.props.outfit !== prevProps.outfit) {
      this.setState({
        outfit: this.props.outfit ? this.props.outfit : new OutfitBO()
      });
    }
  }

  // Lädt die initialen Daten beim Komponenten-Mount
  componentDidMount() {
    this.loadStyles();
    this.loadKleidungsstuecke();
  }

  // Lädt die verfügbaren Styles vom Backend
  loadStyles = async () => {
    try {
      const stylesData = await this.props.kleiderschrankAPI.getStyles();
      // Konvertiere die rohen Daten in StyleBO Objekte
      const styles = stylesData.map(styleData => {
        const style = new StyleBO();
        style.setID(styleData.getID());
        style.setName(styleData.getName());
        return style;
      });
      this.setState({ alleStyles: styles });
    } catch (error) {
      this.setState({ error: "Fehler beim Laden der Styles" });
    }
  };

  // Lädt die verfügbaren Kleidungsstücke vom Backend
  loadKleidungsstuecke = async () => {
    try {
      const kleidungsstueckeData = await this.props.kleiderschrankAPI.getKleidungsstuecke();
      // Konvertiere die rohen Daten in KleidungsstueckBO Objekte
      const kleidungsstuecke = kleidungsstueckeData.map(ksData => {
        const kleidungsstueck = new KleidungsstueckBO();
        kleidungsstueck.setID(ksData.getID());
        kleidungsstueck.setName(ksData.getName());
        kleidungsstueck.setTyp(ksData.getTyp());
        return kleidungsstueck;
      });
      this.setState({ alleKleidungsstuecke: kleidungsstuecke });
    } catch (error) {
      this.setState({ error: "Fehler beim Laden der Kleidungsstücke" });
    }
  };

  // Behandelt die Auswahl eines Styles
  handleStyleChange = (event) => {
    const styleId = event.target.value;
    const selectedStyleData = this.state.alleStyles.find(style => style.getID() === styleId);

    // Erstelle ein neues StyleBO Objekt
    const selectedStyle = new StyleBO();
    selectedStyle.setID(selectedStyleData.getID());
    selectedStyle.setName(selectedStyleData.getName());

    // Update das OutfitBO mit dem neuen Style
    const outfit = this.state.outfit;
    outfit.setStyle(selectedStyle);
    this.setState({ outfit });
  };

  // Behandelt das Hinzufügen/Entfernen von Kleidungsstücken
  handleKleidungsstueckChange = (kleidungsstueckData) => {
    // Erstelle ein neues KleidungsstueckBO Objekt
    const kleidungsstueck = new KleidungsstueckBO();
    kleidungsstueck.setID(kleidungsstueckData.getID());
    kleidungsstueck.setName(kleidungsstueckData.getName());
    kleidungsstueck.setTyp(kleidungsstueckData.getTyp());

    const { ausgewaehlteKleidungsstuecke } = this.state;
    const index = ausgewaehlteKleidungsstuecke.findIndex(k =>
        k.getID() === kleidungsstueck.getID());

    if (index === -1) {
      // Füge das neue KleidungsstueckBO zum Array hinzu
      this.setState({
        ausgewaehlteKleidungsstuecke: [...ausgewaehlteKleidungsstuecke, kleidungsstueck]
      });
    } else {
      // Entferne das KleidungsstueckBO aus dem Array
      const updatedKleidungsstuecke = [...ausgewaehlteKleidungsstuecke];
      updatedKleidungsstuecke.splice(index, 1);
      this.setState({ ausgewaehlteKleidungsstuecke: updatedKleidungsstuecke });
    }
  };

  // Speichert das erstellte/bearbeitete Outfit
  handleSave = () => {
    const { outfit, ausgewaehlteKleidungsstuecke } = this.state;

    // Füge alle ausgewählten KleidungsstueckBOs dem OutfitBO hinzu
    ausgewaehlteKleidungsstuecke.forEach(kleidungsstueck => {
      outfit.addBaustein(kleidungsstueck);
    });

    this.props.onClose(outfit);
  };

  render() {
    const { outfit, alleStyles, alleKleidungsstuecke, ausgewaehlteKleidungsstuecke } = this.state;

    return (
      <Dialog open={this.props.show}>
        <DialogTitle>
          Outfit {outfit.getID() ? 'bearbeiten' : 'erstellen'}
        </DialogTitle>
        <DialogContent>
          {/* Style-Auswahl */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Style</InputLabel>
            <Select
              value={outfit.getStyle()?.getID() || ''}
              onChange={this.handleStyleChange}
            >
              {alleStyles.map((style) => (
                <MenuItem key={style.getID()} value={style.getID()}>
                  {style.getName()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Liste aller verfügbaren Kleidungsstücke */}
          <Typography variant="h6" sx={{mt: 2}}>Kleidungsstücke auswählen</Typography>
          <List>
            {alleKleidungsstuecke.map((kleidungsstueck) => (
              <ListItem
                key={kleidungsstueck.getID()}
                button
                onClick={() => this.handleKleidungsstueckChange(kleidungsstueck)}
                selected={ausgewaehlteKleidungsstuecke.some(k =>
                    k.getID() === kleidungsstueck.getID())}
              >
                <ListItemText
                  primary={kleidungsstueck.getName()}
                  secondary={kleidungsstueck.getTyp().getBezeichnung()}
                />
              </ListItem>
            ))}
          </List>

          {/* Anzeige der ausgewählten Kleidungsstücke */}
          {ausgewaehlteKleidungsstuecke.length > 0 && (
            <Box mt={2}>
              <Typography variant="h6">Ausgewählte Kleidungsstücke:</Typography>
              <List>
                {ausgewaehlteKleidungsstuecke.map((kleidungsstueck) => (
                  <ListItem key={kleidungsstueck.getID()}>
                    <ListItemText
                      primary={kleidungsstueck.getName()}
                      secondary={kleidungsstueck.getTyp().getBezeichnung()}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>

        {/* Aktions-Buttons */}
        <DialogActions>
          <Button onClick={() => this.props.onClose(null)}>Abbrechen</Button>
          <Button
            onClick={this.handleSave}
            variant="contained"
            disabled={!outfit.getStyle() || ausgewaehlteKleidungsstuecke.length === 0}
          >
            Speichern
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default OutfitForm;