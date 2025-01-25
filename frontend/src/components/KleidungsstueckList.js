import React, { Component } from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import KleidungsstueckCard from "./KleidungsstueckCard";
import AddIcon from '@mui/icons-material/Add';

class KleidungsstueckList extends Component {
  constructor(props) {
    super(props);
  }

  handleKleidungsstueckDelete = (deletedKleidungsstueck) => {
      this.props.onUpdate();
  }

  render() {
    const { kleidungsstuecke, onUpdate, kleiderschrankId } = this.props;

    return (
      <Grid container spacing={3}>
        {/* Add Button Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              p: 2,
              borderRadius: 2,
              boxShadow: 2,
              bgcolor: 'primary.main',
              color: 'white',
              display: 'flex',
              height: '112px', // Festgelegte Höhe für alle Karten
              '&:hover': {
                transform: 'translateY(-2px)',
                transition: 'all 0.2s'
              }
            }}
            onClick={this.props.onCreateClick}
          >
            <CardContent sx={{
              cursor: 'pointer',
              p: 0,
              '&:last-child': { pb: 0 },
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1
              }}>
                <AddIcon sx={{ fontSize: 40 }} />
                <Typography variant="h6">
                  Neues Kleidungsstück
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Kleidungsstück Cards */}
        {kleidungsstuecke.map(kleidungsstueck => (
          <Grid item xs={12} sm={6} md={4} key={kleidungsstueck.getID()}>
            <KleidungsstueckCard
              kleidungsstueck={kleidungsstueck}
              onDelete={this.handleKleidungsstueckDelete}
              onUpdate={onUpdate}
              kleiderschrankId={kleiderschrankId}
            />
          </Grid>
        ))}
      </Grid>
    );
  }
}

export default KleidungsstueckList;