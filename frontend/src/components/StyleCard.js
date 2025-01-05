import React from 'react';
import { Typography, Card, CardContent, Grid, Button, ButtonGroup } from '@mui/material';

const StyleCard = ({ style, onEdit, onDelete }) => {

  const renderConstraints = () => {
    const constraints = style.getConstraints();

    if (!constraints || constraints.length === 0) {
      return <Typography>Keine Constraints vorhanden</Typography>;
    }

    return constraints.map((constraint, index) => {
      try {
        let text = '';

        // Prüfen welcher Constraint-Typ vorliegt und entsprechend formatieren
        if (constraint.constructor.name === 'MutexBO') {
          text = `Mutex zwischen ${constraint.getBezugsobjekt1().getBezeichnung()} und ${constraint.getBezugsobjekt2().getBezeichnung()}`;
        }
        else if (constraint.constructor.name === 'KardinalitaetBO') {
          text = `Kardinalität: min ${constraint.minAnzahl} max ${constraint.maxAnzahl}`;
        }
        else if (constraint.constructor.name === 'ImplikationBO') {
          text = `Implikation von ${constraint.getBezugsobjekt1().getBezeichnung()} zu ${constraint.getBezugsobjekt2().getBezeichnung()}`;
        }
        else {
          // Fallback für unbekannte Constraint-Typen
          text = 'Unbekannter Constraint-Typ';
        }

        return (
          <Typography key={index}>
            • {text}
          </Typography>
        );
      } catch (error) {
        console.error("Fehler beim Verarbeiten des Constraints:", constraint, error);
        console.log("Constraints:", constraints); // Debug-Log
        return (
          <Typography key={index} color="error">
            • Fehler beim Laden des Constraints
          </Typography>
        );
      }
    });
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">{style.getName()}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1">Features:</Typography>
            {style.getFeatures() && style.getFeatures().length > 0 ? (
              style.getFeatures().map(feature => (
                <Typography key={feature.getID()}>
                  • {feature.getBezeichnung()}
                </Typography>
              ))
            ) : (
              <Typography>Keine Features vorhanden</Typography>
            )}
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1">Constraints:</Typography>
            {renderConstraints()}
          </Grid>

          <Grid item xs={12}>
            <ButtonGroup>
              <Button onClick={() => onEdit(style)}>Bearbeiten</Button>
              <Button color="error" onClick={() => onDelete(style)}>Löschen</Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default StyleCard;
