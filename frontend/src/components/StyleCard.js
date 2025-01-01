import React, { Component } from 'react';
import { Typography, Card, CardContent, Grid, Button, ButtonGroup } from '@mui/material';

class StyleCard extends Component {
  render() {
    const { style, onEdit, onDelete } = this.props;

    return (
      <Card>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Typography variant="h6">{style?.getName() || "Unbekannter Style"}</Typography>
            </Grid>
            <Grid item>
              <ButtonGroup variant="text" size="small">
                <Button color="primary" onClick={onEdit}>
                  Bearbeiten
                </Button>
                <Button color="secondary" onClick={() => onDelete(style)}>
                  Löschen
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

export default StyleCard;
