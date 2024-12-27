import React, { Component } from 'react';
import { List, Typography, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import KleiderschrankAPI from '../api/KleiderschrankAPI';
import KleidungsstueckCard from "./KleidungsstueckCard";

class KleidungsstueckList extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      this.setState({ loading: true });
      const kleidungsstuecke = await KleiderschrankAPI.getAPI().getKleidungsstuecke();
      this.setState({
        kleidungsstuecke: kleidungsstuecke,
        error: null,
        loading: false
      });
    } catch (error) {
      this.setState({
        error: error.message,
        kleidungsstuecke: [],
        loading: false
      });
    }
  };

  handleKleidungsstueckDelete = async (deletedKleidungsstueck) => {
    const updatedKleidungsstuecke = this.state.kleidungsstuecke.filter(
      kleidungsstueck => kleidungsstueck.getID() !== deletedKleidungsstueck.getID()
    );
    this.setState({
      kleidungsstuecke: updatedKleidungsstuecke
    });
  };

  handleCreateClick = () => {
    this.props.onNavigateToCreate();
  };

  render() {
    const { kleidungsstuecke, error, loading } = this.state;

    if (loading) {
      return <Typography>Lade Kleidungsstücke...</Typography>;
    }

    if (error) {
      return <Typography color="error">Fehler beim Laden der Kleidungsstücke: {error}</Typography>;
    }

    return (
      <Box>
        <List>
          {kleidungsstuecke.map(kleidungsstueck => (
            <KleidungsstueckCard
              key={kleidungsstueck.getID()}
              kleidungsstueck={kleidungsstueck}
              onDelete={this.handleKleidungsstueckDelete()}
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
          Neues Kleidungsstück hinzufügen
        </Button>
      </Box>
    );
  }
}

export default KleidungsstueckList;