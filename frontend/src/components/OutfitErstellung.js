// OutfitErstellung.js
import React, { useState } from 'react';
import { Card, CardContent, Radio, RadioGroup, FormControlLabel, Typography } from '@mui/material';
import StyleBasiertesOutfit from './StyleBasiertesOutfit';
import KleidungsstueckBasiertesOutfit from './KleidungsstueckBasiertesOutfit';

const OutfitErstellung = () => {
  // State für die Erstellungsmethode (style oder kleidungsstueck)
  const [erstellungsMethode, setErstellungsMethode] = useState('');

  return (
    <div className="w-full p-4">
      <Typography variant="h4" className="mb-4">Outfit erstellen</Typography>

      {/* Auswahlkarte für die Erstellungsmethode */}
      <Card className="mb-4">
        <CardContent>
          <Typography variant="h6">Wie möchten Sie Ihr Outfit erstellen?</Typography>
          <RadioGroup
            value={erstellungsMethode}
            onChange={(e) => setErstellungsMethode(e.target.value)}
          >
            <FormControlLabel
              value="style"
              control={<Radio />}
              label="Nach Style erstellen"
            />
            <FormControlLabel
              value="kleidungsstueck"
              control={<Radio />}
              label="Basierend auf Kleidungsstück erstellen"
            />
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Bedingte Darstellung der Erstellungskomponenten */}
      {erstellungsMethode === 'style' && <StyleBasiertesOutfit />}
      {erstellungsMethode === 'kleidungsstueck' && <KleidungsstueckBasiertesOutfit />}
    </div>
  );
};

export default OutfitErstellung;