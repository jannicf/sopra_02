import React, { Component } from 'react';
import { Grid, Button, Typography, Box } from '@mui/material';
import KleiderschrankAPI from '../api/KleiderschrankAPI';
import OutfitList from '../components/OutfitList';
import { Link } from 'react-router-dom';

class OutfitView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      outfits: [],
      kleidungsstuecke: [],
      error: null,
      loading: false
    };
  }

  componentDidMount() {
    this.loadKleidungsstuecke();
  }

  loadKleidungsstuecke = async () => {
    try {
      const kleidungsstuecke = await KleiderschrankAPI.getAPI().getKleidungsstuecke();
      this.setState({ kleidungsstuecke });
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  render() {
    const { kleidungsstuecke, loading, error } = this.state;

    return (
      <div>
        {/* Hauptüberschrift */}
        <Typography variant="h4" gutterBottom>
          Meine erstellten Outfits
        </Typography>

        {/* OutfitList für die Anzeige der Outfits */}
        <OutfitList />

        {/* Bereich für die Anzeige der verfügbaren Kleidungsstücke */}
        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Verfügbare Kleidungsstücke:
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {kleidungsstuecke.map((kleidungsstueck) => (
            <Grid item xs={12} sm={6} md={4} key={kleidungsstueck.getID()}>
              <Box p={2} border={1} borderColor="grey.300" borderRadius={1}>
                <Typography variant="body1">
                  {kleidungsstueck.getName()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Typ: {kleidungsstueck.getTyp()?.getBezeichnung()}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Zentrale Buttons für die Outfit-Erstellung */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            my: 4
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
      </div>
    );
  }
}

export default OutfitView;