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

        for(let outfit of outfits) {
          if(outfit.getStyle()) {
            const style = await KleiderschrankAPI.getAPI().getStyle(outfit.getStyle().getID());
            outfit.setStyle(style);
          }

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

  handleOutfitDelete = async (deletedOutfit) => {
    try {
      await KleiderschrankAPI.getAPI().deleteOutfit(deletedOutfit.getID());
      this.loadOutfits();
    } catch (error) {
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