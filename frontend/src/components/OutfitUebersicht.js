// OutfitUebersicht.js
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, Button, Box, Typography, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { KleiderschrankAPI } from '../api';
import OutfitListEntry from './OutfitList';
import ErrorAlert from './ErrorAlert';

class OutfitUebersicht extends Component {
  constructor(props) {
    super(props);
    this.state = {
      outfits: [],
      loadingInProgress: false,
      loadingError: null,
      addingOutfitError: null,
    };
  }

  // Lädt alle Outfits beim Komponenten-Mount
  componentDidMount() {
    this.getOutfits();
  }

  // API-Aufruf zum Laden der Outfits
  getOutfits = () => {
    this.setState({ loadingInProgress: true });

    KleiderschrankAPI.getAPI().getOutfits()
      .then(outfitBOs => {
        this.setState({
          outfits: outfitBOs,
          loadingInProgress: false,
          loadingError: null
        });
      }).catch(e => {
        this.setState({
          outfits: [],
          loadingInProgress: false,
          loadingError: e
        });
      });
  }

  // Navigiert zur Outfit-Erstellung
  navigateToOutfitErstellung = () => {
    this.props.onNavigateToErstellung();
  }

  // Handler für das Löschen eines Outfits
  deleteOutfitHandler = (deletedOutfit) => {
    KleiderschrankAPI.getAPI().deleteOutfit(deletedOutfit.getID())
      .then(() => {
        this.setState({
          outfits: this.state.outfits.filter(outfit => outfit.getID() !== deletedOutfit.getID())
        });
      });
  }

  render() {
    const { outfits, loadingInProgress, loadingError } = this.state;

    return (
      <Box sx={{ width: '100%', position: 'relative', minHeight: '400px' }}>
        <Typography variant="h6">Meine Outfits</Typography>

        {loadingError ? (
          <ErrorAlert message={loadingError} />
        ) : (
          <>
            {loadingInProgress ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', margin: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <List sx={{ marginBottom: 2 }}>
                {outfits.map(outfit => (
                  <OutfitListEntry
                    key={outfit.getID()}
                    outfit={outfit}
                    onOutfitDeleted={this.deleteOutfitHandler}
                    show={this.props.show}
                  />
                ))}
              </List>
            )}
          </>
        )}

        <Button
          sx={{ position: 'fixed', right: '2rem', bottom: '2rem' }}
          variant='contained'
          color='primary'
          startIcon={<AddIcon />}
          onClick={this.navigateToOutfitErstellung}
        >
          Neues Outfit erstellen
        </Button>
      </Box>
    );
  }
}

OutfitUebersicht.propTypes = {
  show: PropTypes.bool.isRequired,
  onNavigateToErstellung: PropTypes.func.isRequired
};

export default OutfitUebersicht;