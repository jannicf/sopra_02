// StyleBasiertOutfit.js
import React, { useState, useEffect } from 'react';
import { Card, CardContent, List, ListItem, ListItemText, Button, Typography } from '@mui/material';
import { KleiderschrankAPI } from '../api';

const StyleBasiertesOutfit = () => {
  // States für die verschiedenen Daten
  const [styles, setStyles] = useState([]);
  const [ausgewaehlterStyle, setAusgewaehlterStyle] = useState(null);
  const [vorgeschlageneKleidung, setVorgeschlageneKleidung] = useState([]);
  const [ausgewaehlteKleidung, setAusgewaehlteKleidung] = useState([]);

  // Laden der Styles beim Komponenten-Mount
  useEffect(() => {
    const stylesLaden = async () => {
      const styleListe = await KleiderschrankAPI.getAPI().getStyles();
      setStyles(styleListe);
    };
    stylesLaden();
  }, []);

  // Handler für Style-Auswahl
  const handleStyleAuswahl = async (style) => {
    setAusgewaehlterStyle(style);
    const moeglicheKleidung = await KleiderschrankAPI.getAPI()
      .getPossibleOutfitsForStyle(style.getID());
    setVorgeschlageneKleidung(moeglicheKleidung);
  };

  // Handler für Outfit-Erstellung
  const handleOutfitErstellen = async () => {
    await KleiderschrankAPI.getAPI().createOutfit({
      style_id: ausgewaehlterStyle.getID(),
      kleidungsstueck_ids: ausgewaehlteKleidung.map(kleidung => kleidung.getID())
    });
  };

  return (
    <div>
      {/* Style-Auswahlkarte */}
      <Card className="mb-4">
        <CardContent>
          <Typography variant="h6">Style auswählen</Typography>
          <List>
            {styles.map(style => (
              <ListItem
                key={style.getID()}
                button
                selected={ausgewaehlterStyle?.getID() === style.getID()}
                onClick={() => handleStyleAuswahl(style)}
              >
                <ListItemText primary={style.getName()} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Vorgeschlagene Kleidungsstücke */}
      {vorgeschlageneKleidung.length > 0 && (
        <Card className="mb-4">
          <CardContent>
            <Typography variant="h6">Passende Kleidungsstücke</Typography>
            <List>
              {vorgeschlageneKleidung.map(kleidung => (
                <ListItem
                  key={kleidung.getID()}
                  button
                  selected={ausgewaehlteKleidung.includes(kleidung)}
                  onClick={() => setAusgewaehlteKleidung([...ausgewaehlteKleidung, kleidung])}
                >
                  <ListItemText
                    primary={kleidung.getName()}
                    secondary={kleidung.getTyp().getBezeichnung()}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Erstellungs-Button */}
      {ausgewaehlteKleidung.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleOutfitErstellen}
        >
          Outfit erstellen
        </Button>
      )}
    </div>
  );
};

export default StyleBasiertesOutfit;