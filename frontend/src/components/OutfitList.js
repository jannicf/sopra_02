import React, { Component } from 'react';
import { List, Typography, Box } from '@mui/material';
import OutfitCard from './OutfitCard';
import KleiderschrankAPI from '../api/KleiderschrankAPI';

class OutfitList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      outfits: [],
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

  handleOutfitDelete = (deletedOutfit) => {
    if (deletedOutfit) {
      const updatedOutfits = this.state.outfits.filter(
        outfit => outfit.getID() !== deletedOutfit.getID()
      );
      this.setState({ outfits: updatedOutfits });

      // Nach dem UI-Update das Backend aktualisieren
      KleiderschrankAPI.getAPI().deleteOutfit(deletedOutfit.getID())
        .catch(error => {
          console.error('Fehler beim Löschen:', error);
          // Bei Fehler den State wiederherstellen
          this.setState({ outfits: this.state.outfits });
        });
    }
  };

  render() {
    const { outfits, loading, error } = this.state;

    if (loading) {
      return <Typography>Lade Outfits...</Typography>;
    }

    if (error) {
      return <Typography color="error">Fehler beim Laden: {error}</Typography>;
    }

    return (
      <List>
        {outfits.map((outfit) => (
          <OutfitCard
            key={outfit.getID()}
            outfit={outfit}
            onDelete={this.handleOutfitDelete}
          />
        ))}
      </List>
    );
  }
}

export default OutfitList;