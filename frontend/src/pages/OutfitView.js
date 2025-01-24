import React, { Component } from 'react';
import { Typography, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
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
            gap: 3,
            mb: 6,
            mt: 4  // Abstand nach oben
          }}
        >
          {/* Button für Style-basierte Outfit-Erstellung */}
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/outfits/erstellen-nach-style"
            sx={{
              px: 4,
              py: 2,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem',
              boxShadow: 2,
              width: 370,
              '&:hover': {
                boxShadow: 4,
                transform: 'translateY(-2px)',
                transition: 'all 0.2s'
              }
            }}
            disableRipple
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box>
                <AddIcon fontSize="large"/>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Outfit nach Style erstellen
              </Box>
            </Box>
          </Button>

          {/* Button für Kleidungsstück-basierte Outfit-Erstellung */}
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            to="/outfits/create-by-item"
            sx={{
              px: 4,
              py: 2,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem',
              boxShadow: 2,
              width: 370,
              backgroundColor: 'background.paper',
              '&:hover': {
                boxShadow: 4,
                transform: 'translateY(-2px)',
                transition: 'all 0.2s',
                backgroundColor: 'background.paper'

              }
            }}
            disableRipple
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box >
                <AddIcon fontSize="large"/>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Outfit nach Kleidungsstück erstellen
              </Box>
            </Box>
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