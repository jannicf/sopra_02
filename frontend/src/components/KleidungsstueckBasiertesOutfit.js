// KleidungsstueckBasiertOutfit.js
import React, { useState, useEffect } from 'react';
import { Card, CardContent, List, ListItem, ListItemText, Button, Typography } from '@mui/material';
import { KleiderschrankAPI } from '../api';

const KleidungsstueckBasiertesOutfit = () => {
  // States für die verschiedenen Daten
  const [kleidungsstuecke, setKleidungsstuecke] = useState([]);
  const [ausgewaehltesBasisKleidungsstueck, setAusgewaehltesBasisKleidungsstueck] = useState(null);
  const [vorgeschlageneKleidung, setVorgeschlageneKleidung] = useState([]);
  const [ausgewaehlteKleidung, setAusgewaehlteKleidung] = useState([]);

  // Laden der Kleidungsstücke beim Komponenten-Mount
  useEffect(() => {
    const kleidungLaden = async () => {
      const kleidungListe = await KleiderschrankAPI.getAPI().getKleidungsstuecke();
      setKleidungsstuecke(kleidungListe);
    };
    kleidungLaden();
  }, []);

  // Handler für Kleidungsstück-Auswahl
  const handleKleidungsstueckAuswahl = async (kleidungsstueck) => {
    setAusgewaehltesBasisKleidungsstueck(kleidungsstueck);
    const vervollstaendigungen = await KleiderschrankAPI.getAPI()
      .getPossibleOutfitCompletions(kleidungsstueck.getID());
    setVorgeschlageneKleidung(vervollstaendigungen);
  };

  // Handler für Outfit-Erstellung
  const handleOutfitErstellen = async () => {
    await KleiderschrankAPI.getAPI().createOutfitFromBaseItem(
      ausgewaehltesBasisKleidungsstueck.getID(),
      ausgewaehlteKleidung.map(kleidung => kleidung.getID())
    );
  };

  return (
    <div>
      {/* Basis-Kleidungsstück Auswahlkarte */}
      <Card className="mb-4">
        <CardContent>
          <Typography variant="h6">Basis-Kleidungsstück auswählen</Typography>
          <List>
            {kleidungsstuecke.map(kleidung => (
              <ListItem
                key={kleidung.getID()}
                button
                selected={ausgewaehltesBasisKleidungsstueck?.getID() === kleidung.getID()}
                onClick={() => handleKleidungsstueckAuswahl(kleidung)}
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

      {/* Vorgeschlagene passende Kleidungsstücke */}
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

export default KleidungsstueckBasiertesOutfit;