import React, { Component } from 'react';
import { Typography, Button, Box } from '@mui/material';
import OutfitList from '../components/OutfitList';
import { Link } from 'react-router-dom';

class OutfitView extends Component {
  render() {
    return (
      <div>
        {/* Zentrale Buttons für die Outfit-Erstellung */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            mb: 6,
            mt: 4  // Neuer Abstand nach oben
          }}
        >
          {/* Button für Style-basierte Outfit-Erstellung */}
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/outfits/erstellen-nach-style"
            size="large"
          >
            Outfit nach Style erstellen
          </Button>

          {/* Button für Kleidungsstück-basierte Outfit-Erstellung */}
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to="/outfits/create-by-item"
            size="large"
          >
            Outfit nach einem bestimmten Kleidungsstück erstellen
          </Button>
        </Box>

        {/* Hauptüberschrift */}
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Meine erstellten Outfits
        </Typography>

        {/* OutfitList für die Anzeige der Outfits */}
        <OutfitList />
      </div>
    );
  }
}

export default OutfitView;