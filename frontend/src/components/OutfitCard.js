import React, { Component } from 'react';
import { Card, CardContent, Typography, IconButton, Box, Chip, Collapse, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import OutfitDeleteDialog from '../dialogs/OutfitDeleteDialog';

class OutfitCard extends Component {
  state = {
    expanded: false,
    showDeleteDialog: false
  };

  handleExpandClick = () => {
    this.setState(prevState => ({
      expanded: !prevState.expanded
    }));
  };

  handleDeleteClick = () => {
    this.setState({ showDeleteDialog: true });
  };

  handleDeleteDialogClose = (deletedOutfit) => {
    if (deletedOutfit) {
      this.props.onDelete(deletedOutfit);
    }
    this.setState({ showDeleteDialog: false });
  };

  render() {
    const { outfit } = this.props;
    const { expanded, showDeleteDialog } = this.state;

    if (!outfit) {
      return null;
    }

    const style = outfit.getStyle();
    const kleidungsstuecke = outfit.getBausteine() || [];

    return (
      <>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              {/* Header mit Outfit-ID und Anzahl der Kleidungsstücke */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Outfit ID: {outfit.getID()}
                </Typography>
                <Typography color="text.secondary">
                  Kleidungsstücke: {kleidungsstuecke.length}
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Box display="flex" alignItems="center">
                <Button
                  onClick={this.handleExpandClick}
                  endIcon={expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  sx={{ mr: 1 }}
                >
                  Details
                </Button>
                <IconButton
                  onClick={this.handleDeleteClick}
                  color="error"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Expandierbarer Bereich */}
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <Box sx={{ mt: 2 }}>
                {/* Style */}
                <Box display="flex" alignItems="center" mb={2}>
                  <Typography variant="subtitle1" mr={2}>
                    Style:
                  </Typography>
                  {style && (
                    <Chip
                      label={style.getName()}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Box>

                {/* Kleidungsstücke */}
                <Typography variant="subtitle1" gutterBottom>
                  Details der Kleidungsstücke:
                </Typography>

                {kleidungsstuecke.length > 0 ? (
                  <Box sx={{ ml: 2 }}>
                    {kleidungsstuecke.map((kleidungsstueck, index) => (
                      <Box key={index} mb={1.5} sx={{
                        p: 1.5,
                        backgroundColor: 'rgba(0, 0, 0, 0.03)',
                        borderRadius: 1
                      }}>
                        <Typography variant="subtitle2">
                          {kleidungsstueck.getName() || 'Unbenannt'}
                        </Typography>
                        <Box display="flex" gap={1} mt={0.5}>
                          {kleidungsstueck.getTyp() && (
                            <Chip
                              label={`Typ: ${kleidungsstueck.getTyp().getBezeichnung()}`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                          {style && (
                            <Chip
                              label={`Style: ${style.getName()}`}
                              size="small"
                              variant="outlined"
                              color="primary"
                            />
                          )}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography color="text.secondary" sx={{ ml: 2 }}>
                    Keine Kleidungsstücke vorhanden
                  </Typography>
                )}
              </Box>
            </Collapse>
          </CardContent>
        </Card>

        {/* Delete Dialog */}
        <OutfitDeleteDialog
          show={showDeleteDialog}
          outfit={outfit}
          onClose={this.handleDeleteDialogClose}
        />
      </>
    );
  }
}

export default OutfitCard;