import React, { Component } from 'react';
import { Grid, Typography } from '@mui/material';
import OutfitCard from './OutfitCard';
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
        const person = await KleiderschrankAPI.getAPI().getPersonByGoogleId(this.props.user?.uid);

        if (person && person.getKleiderschrank()) {
            const kleiderschrankId = person.getKleiderschrank().getID();
            const outfits = await KleiderschrankAPI.getAPI().getOutfitByKleiderschrankId(kleiderschrankId);

            const loadedOutfits = await Promise.all(outfits.map(async (outfit) => {
                try {
                    if (outfit.getStyle()) {
                        const style = await KleiderschrankAPI.getAPI().getStyle(outfit.getStyle().getID());
                        outfit.setStyle(style);
                    }

                    const bausteine = outfit.getBausteine();
                    const loadedBausteine = await Promise.all(bausteine.map(async (baustein) => {
                        try {
                            return await KleiderschrankAPI.getAPI().getKleidungsstueck(baustein.getID());
                        } catch (error) {
                            console.warn(`Konnte Kleidungsstück ${baustein.getID()} nicht laden`);
                            return null;
                        }
                    }));

                    // Filter out any null values and update bausteine
                    outfit.getBausteine().length = 0; // Clear array
                    loadedBausteine.filter(b => b !== null).forEach(b => outfit.getBausteine().push(b));

                    return outfit;
                } catch (error) {
                    console.warn(`Konnte Outfit ${outfit.getID()} nicht vollständig laden`);
                    return null;
                }
            }));

            // Filter out any null outfits
            const validOutfits = loadedOutfits.filter(outfit => outfit !== null);

            this.setState({
                outfits: validOutfits,
                kleiderschrankId: kleiderschrankId,
                error: null // Clear any previous errors
            });
        }
    } catch (error) {
        this.setState({
            error: error.message,
            outfits: [] // Clear outfits on error
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
      // Zuerst den Dialog schließen
      this.setState({
        selectedOutfit: null,
        dialogOpen: false
      });

      // Dann Outfit aus lokalem State entfernen
      this.setState(prevState => ({
        outfits: prevState.outfits.filter(outfit => outfit.getID() !== deletedOutfit.getID())
      }));

      // Dann das Outfit in der Datenbank löschen
      await KleiderschrankAPI.getAPI().deleteOutfit(deletedOutfit.getID());

    } catch (error) {
      // Wenn ein Fehler auftritt, laden wir die komplette Liste neu
      await this.loadOutfits();
      this.setState({ error: error.message });
    }
  };

  render() {
    const { outfits, selectedOutfit, dialogOpen, error } = this.state;

    if (outfits.length === 0) {
      return <Typography variant="body1" align="center" sx={{my: 4, p: 3, bgcolor: 'grey.100', borderRadius: 1}}
            >Noch keine Outfits vorhanden.</Typography>;
    }

    if (error) {
      return <Typography color="error">Fehler beim Laden: {error}</Typography>;
    }

    return (
      <>
        <Grid container spacing={3}>
          {outfits.map((outfit) => (
            <Grid item xs={12} sm={6} md={4} key={outfit.getID()}>
              <OutfitCard
                outfit={outfit}
                onClick={this.handleOutfitClick}
              />
            </Grid>
          ))}
        </Grid>

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