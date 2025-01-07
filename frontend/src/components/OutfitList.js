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
      loading: true,
      error: null
    };
  }

  componentDidMount() {
    this.loadOutfits();
  }

  loadOutfits = async () => {
    try {
      const api = KleiderschrankAPI.getAPI();
      const outfits = await api.getOutfits();
      this.setState({
        outfits: outfits,
        loading: false
      });
    } catch (error) {
      console.error("Fehler beim Laden der Outfits:", error);
      this.setState({
        error: error.message,
        loading: false
      });
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

  handleOutfitDelete = async (deletedOutfit) => {
    try {
      await KleiderschrankAPI.getAPI().deleteOutfit(deletedOutfit.getID());
      this.setState(prevState => ({
        outfits: prevState.outfits.filter(outfit => outfit.getID() !== deletedOutfit.getID()),
        dialogOpen: false,
        selectedOutfit: null
      }));
    } catch (error) {
      console.error('Fehler beim Löschen:', error);
    }
  };

  render() {
    const { outfits, selectedOutfit, dialogOpen, loading, error } = this.state;

    if (loading) {
      return <Typography>Lade Outfits...</Typography>;
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