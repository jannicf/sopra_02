import React, { Component } from 'react';
import { List, Typography, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import OutfitCard from './OutfitCard';
import KleiderschrankAPI from '../api/KleiderschrankAPI';

class OutfitList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      outfits: [],
      error: null,
      loading: false
    };
  }

  componentDidMount() {
    this.loadOutfits();
  }

  loadOutfits = async () => {
    try {
      this.setState({ loading: true });
      const outfits = await KleiderschrankAPI.getAPI().getOutfits();
      this.setState({
        outfits: outfits,
        error: null,
        loading: false
      });
    } catch (error) {
      this.setState({
        error: error.message,
        outfits: [],
        loading: false
      });
    }
  };

  handleOutfitDelete = async (deletedOutfit) => {
    const updatedOutfits = this.state.outfits.filter(
      outfit => outfit.getID() !== deletedOutfit.getID()
    );
    this.setState({
      outfits: updatedOutfits
    });
  };

  handleCreateClick = () => {
    this.props.onNavigateToCreate();
  };

  render() {
    const { outfits, error, loading } = this.state;

    if (loading) {
      return <Typography>Lade Outfits...</Typography>;
    }

    if (error) {
      return <Typography color="error">Fehler beim Laden der Outfits: {error}</Typography>;
    }

    return (
      <Box>
        <List>
          {outfits.map(outfit => (
            <OutfitCard
              key={outfit.getID()}
              outfit={outfit}
              onDelete={this.handleOutfitDelete}
            />
          ))}
        </List>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={this.handleCreateClick}
          sx={{ position: 'fixed', bottom: '2rem', right: '2rem' }}
        >
          Neues Outfit erstellen
        </Button>
      </Box>
    );
  }
}

export default OutfitList;