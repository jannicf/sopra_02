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

  // Änderungen der übergebenen Props behandeln
  componentDidUpdate(prevProps) {
    if (this.props.outfit !== prevProps.outfit) {
      this.setState({
        outfit: this.props.outfit ? this.props.outfit : new OutfitBO()
      });
    }
  }

  // Die initialen Daten beim Komponenten-Mount laden
  componentDidMount() {
    this.loadStyles();
    this.loadKleidungsstuecke();
  }

  // Die verfügbaren Styles vom Backend laden
  loadStyles = async () => {
    try {
      const stylesData = await this.props.kleiderschrankAPI.getStyles();
      // Die rohen Daten in StyleBO Objekte konvertieren
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

  // Die verfügbaren Kleidungsstücke vom Backend laden
  loadKleidungsstuecke = async () => {
    try {
      const kleidungsstueckeData = await this.props.kleiderschrankAPI.getKleidungsstuecke();
      // Die rohen Daten in KleidungsstueckBO Objekte konvertieren
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

  // Die Auswahl eines Styles behandeln
  handleStyleChange = (event) => {
    const styleId = event.target.value;
    const selectedStyleData = this.state.alleStyles.find(style => style.getID() === styleId);

    // Ein neues StyleBO Objekt erstellen
    const selectedStyle = new StyleBO();
    selectedStyle.setID(selectedStyleData.getID());
    selectedStyle.setName(selectedStyleData.getName());

    // Das OutfitBO mit dem neuen Style updaten
    const outfit = this.state.outfit;
    outfit.setStyle(selectedStyle);
    this.setState({ outfit });
  };

  // Das Hinzufügen/Entfernen von Kleidungsstücken behandeln
  handleKleidungsstueckChange = (kleidungsstueckData) => {
    // Ein neues KleidungsstueckBO Objekt erstellen
    const kleidungsstueck = new KleidungsstueckBO();
    kleidungsstueck.setID(kleidungsstueckData.getID());
    kleidungsstueck.setName(kleidungsstueckData.getName());
    kleidungsstueck.setTyp(kleidungsstueckData.getTyp());

    const { ausgewaehlteKleidungsstuecke } = this.state;
    const index = ausgewaehlteKleidungsstuecke.findIndex(k =>
        k.getID() === kleidungsstueck.getID());

    if (index === -1) {
      // Das neue KleidungsstueckBO zum Array hinzufügen
      this.setState({
        ausgewaehlteKleidungsstuecke: [...ausgewaehlteKleidungsstuecke, kleidungsstueck]
      });
    } else {
      // Das KleidungsstueckBO aus dem Array entfernen
      const updatedKleidungsstuecke = [...ausgewaehlteKleidungsstuecke];
      updatedKleidungsstuecke.splice(index, 1);
      this.setState({ ausgewaehlteKleidungsstuecke: updatedKleidungsstuecke });
    }
  };

  // Das erstellte/bearbeitete Outfit speichern
  handleSave = () => {
    const { outfit, ausgewaehlteKleidungsstuecke } = this.state;

    // Alle ausgewählten KleidungsstueckBOs dem OutfitBO hinzufügen
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