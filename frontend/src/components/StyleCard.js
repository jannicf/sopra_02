import React, { Component } from 'react';
import PropTypes from 'prop-types'; // bezieht sich auf onDelete
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { KleiderschrankAPI } from '../api';
import ErrorAlert from '../dialogs/ErrorAlert';

class StyleCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      style: props.style,
      expanded: false,
      error: null  // State für die Fehlerbehandlung
    };
  }

  // Handler für das Löschen eines Styles
  handleDelete = async () => {
    try {
      await KleiderschrankAPI.getAPI().deleteStyle(this.state.style.getID());
      this.props.onDelete(this.state.style);
    } catch (error) {
      console.error("Fehler beim Löschen des Styles:", error);
      this.setState({
        error: "Der Style konnte nicht gelöscht werden."
      });
    }
  };

  // Handler für das Aus- und Einklappen der Detailansicht
  handleExpandClick = () => {
    this.setState({
      expanded: !this.state.expanded
    });
  };

  render() {
    const { style, expanded, error } = this.state;

    return (
      <>
        <Card className="mb-4">
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <div>
                <Typography variant="h6">
                  {style.getName()}
                </Typography>
                <Typography color="textSecondary">
                  {style.getFeatures().length} Kleidungstypen, {style.getConstraints().length} Constraints
                </Typography>
                {expanded && (
                  <Box mt={2}>
                    <Typography variant="subtitle2">Kleidungstypen:</Typography>
                    {style.getFeatures().map(feature => (
                      <Typography key={feature.getID()}>
                        • {feature.getBezeichnung()}
                      </Typography>
                    ))}
                    {style.getConstraints().length > 0 && (
                      <>
                        <Typography variant="subtitle2" mt={1}>Constraints:</Typography>
                        {style.getConstraints().map(constraint => (
                          <Typography key={constraint.getID()}>
                            • {constraint.constructor.name}
                          </Typography>
                        ))}
                      </>
                    )}
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

        {/* Anzeige der Fehlermeldung falls ein Fehler aufgetreten ist */}
        {error && (
          <ErrorAlert
            message={error}
            onClose={() => this.setState({ error: null })}
          />
        )}
      </>
    );
  }
}

// bezieht sich auf onDelete
StyleCard.propTypes = {
  style: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default StyleCard;
