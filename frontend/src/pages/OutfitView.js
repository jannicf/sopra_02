import React, { Component } from 'react';
import { Typography, Button, Box } from '@mui/material';
import OutfitList from '../components/OutfitList';
import { Link } from 'react-router-dom';


class OutfitView extends Component {
  render() {
    return (
      <div>
          <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>Meine Outfits</Typography>
        {/* Erklärender Text */}
        <Typography variant="body1" sx={{ mb: 4 }}>
            Hier kannst du deine Outfits verwalten. Erstelle neue Outfits oder sieh dir deine bereits erstellten Outfits an.
            Du kannst Oufits nach einem von dir gewählten Style oder mit einem Kleidungsstück als Basis erstellen.
            Aber beachte: Ein Outfit kann immer nur einen Style haben!
        </Typography>
        {/* Zentrale Buttons für die Outfit-Erstellung */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            mb: 6,
            mt: 4
          }}
        >
          {/* Button für Style-basierte Outfit-Erstellung */}
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/outfits/erstellen-nach-style"
            size="large"
            disableRipple
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
            disableRipple
          >
            Outfit nach einem bestimmten Kleidungsstück erstellen
          </Button>
        </Box>

        {/* Hauptüberschrift */}
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Meine erstellten Outfits
        </Typography>

        {/* OutfitList für die Anzeige der Outfits */}
        <OutfitList user={this.props.user} />
      </div>
    );
  }
}

export default OutfitView;