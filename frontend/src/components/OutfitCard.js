import React, { Component } from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import KleiderschrankAPI from '../api/KleiderschrankAPI';

class OutfitCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      outfit: props.outfit,
      expanded: false
    };
  }

  handleDelete = async () => {
    try {
      await KleiderschrankAPI.getAPI().deleteOutfit(this.state.outfit.getID());
      this.props.onDelete(this.state.outfit);
    } catch (error) {
      console.error("Fehler beim Löschen des Outfits:", error);
    }
  };

  handleExpandClick = () => {
    this.setState({
      expanded: !this.state.expanded
    });
  };

  render() {
    const { outfit, expanded } = this.state;

    return (
      <Card className="mb-4">
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <div>
              <Typography variant="h6">
                {outfit.getStyle().getName()}
              </Typography>
              <Typography color="textSecondary">
                {outfit.getBausteine().length} Kleidungsstücke
              </Typography>
              {expanded && (
                <Box mt={2}>
                  {outfit.getBausteine().map(kleidungsstueck => (
                    <Typography key={kleidungsstueck.getID()}>
                      • {kleidungsstueck.getName()} ({kleidungsstueck.getTyp().getBezeichnung()})
                    </Typography>
                  ))}
                </Box>
              )}
            </div>
            <Box>
              <IconButton
                onClick={this.handleExpandClick}
                aria-expanded={expanded}
              >
                {expanded ? "Weniger" : "Mehr"}
              </IconButton>
              <IconButton 
                onClick={this.handleDelete}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }
}

export default OutfitCard;