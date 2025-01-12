import React, { Component } from 'react';
import { Grid, Typography, Card, CardContent, Box, Chip } from '@mui/material';
import OutfitDetailDialog from '../dialogs/OutfitDetailDialog';
import KleiderschrankAPI from '../api/KleiderschrankAPI';

class OutfitList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      outfits: [],
      selectedOutfit: null,
      dialogOpen: false,
      error: null,
      kleiderschrankId: null
    };
  }

  componentDidMount() {
    this.loadOutfits();
  }

    loadOutfits = async () => {
        try {
          // Person und Kleiderschrank laden
          const person = await KleiderschrankAPI.getAPI().getPersonByGoogleId(this.props.user?.uid);

          if (person && person.getKleiderschrank()) {
            const kleiderschrankId = person.getKleiderschrank().getID();
            // Outfits laden
            const outfits = await KleiderschrankAPI.getAPI().getOutfitByKleiderschrankId(kleiderschrankId);

            for(let outfit of outfits) {
              // Style holen
              if(outfit.getStyle()) {
                const style = await KleiderschrankAPI.getAPI().getStyle(outfit.getStyle().getID());
                outfit.setStyle(style);
              }

              // Kleidungsstücke holen
              const bausteine = outfit.getBausteine();
              for(let baustein of bausteine) {
                const kleidungsstueck = await KleiderschrankAPI.getAPI().getKleidungsstueck(baustein.getID());
                outfit.getBausteine()[outfit.getBausteine().indexOf(baustein)] = kleidungsstueck;
              }
            }
            this.setState({
              outfits: outfits,
              kleiderschrankId: kleiderschrankId
            });
          }
        } catch (error) {
          this.setState({ error: error.message });
        }
      };

  handleOutfitClick = (outfit) => {
    this.setState({
      selectedOutfit: outfit,
      dialogOpen: true
    });
  };

  handleDialogClose = () => {
    this.setState({
      selectedOutfit: null,
      dialogOpen: false
    });
  };

  // Handler für das Löschen eines Outfits
    handleOutfitDelete = async (deletedOutfit) => {
        try {
            await KleiderschrankAPI.getAPI().deleteOutfit(deletedOutfit.getID());
            this.loadOutfits(); // Liste neu laden
        } catch (error) {
            console.error('Error deleting outfit:', error);
            this.setState({ error: error.message });
        }
    };

  render() {
    const { outfits, selectedOutfit, dialogOpen, error } = this.state;


    if (outfits.length === 0) {
    return <Typography>Keine Outfits vorhanden</Typography>;
    }

    if (error) {
      return <Typography color="error">Fehler beim Laden: {error}</Typography>;
    }

    return (
      <>
        <Grid container spacing={3}>
          {outfits.map((outfit) => (
            <Grid item xs={12} sm={6} md={4} key={outfit.getID()}>
              <Card
                onClick={() => this.handleOutfitClick(outfit)}
                sx={{
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: 3,
                    transform: 'scale(1.02)',
                    transition: 'all 0.2s ease-in-out'
                  }
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Outfit {outfit.getID()}
                  </Typography>

                  {/* Style */}
                  {outfit.getStyle() && (
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={`Style: ${outfit.getStyle().getName()}`}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                  )}

                  {/* Kleidungsstücke Übersicht */}
                  <Typography color="textSecondary">
                    {outfit.getBausteine().length} Kleidungsstücke
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Detail Dialog */}
        <OutfitDetailDialog
          outfit={selectedOutfit}
          open={dialogOpen}
          onClose={this.handleDialogClose}
          onDelete={this.handleOutfitDelete}
        />
      </>
    );
  }
}

export default OutfitList;