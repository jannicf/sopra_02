import React from 'react';
import { Typography, Card, CardContent, Grid, Button, ButtonGroup } from '@mui/material';

const StyleCard = ({ style, onEdit, onDelete }) => {
  const renderConstraints = () => {
    const constraints = style.getConstraints();

    if (!constraints || constraints.length === 0) {
      return <Typography>Keine Constraints vorhanden</Typography>;
    }

    return (
      <>
        {constraints.kardinalitaeten?.map((k, i) => (
          <Typography key={`k-${i}`}>
            • Kardinalität: {k.minAnzahl} bis {k.maxAnzahl} {k.bezugsobjekt?.bezeichnung}
          </Typography>
        ))}
        {constraints.mutexe?.map((m, i) => (
          <Typography key={`m-${i}`}>
            • Mutex zwischen {m.bezugsobjekt1?.bezeichnung} und {m.bezugsobjekt2?.bezeichnung}
          </Typography>
        ))}
        {constraints.implikationen?.map((i, idx) => (
          <Typography key={`i-${idx}`}>
            • Implikation: Wenn {i.bezugsobjekt1?.bezeichnung}, dann {i.bezugsobjekt2?.bezeichnung}
          </Typography>
        ))}
      </>
    );
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{style.getName()}</Typography>

        <Typography variant="subtitle1">Features:</Typography>
        {style.getFeatures() && style.getFeatures().length > 0 ? (
          style.getFeatures().map((feature, index) => (
            <Typography key={index}>• {feature.getBezeichnung()}</Typography>
          ))
        ) : (
          <Typography>Keine Features vorhanden</Typography>
        )}

        <Typography variant="subtitle1" sx={{ mt: 2 }}>Constraints:</Typography>
        {renderConstraints()}

        <ButtonGroup sx={{ mt: 2 }}>
          <Button onClick={() => onEdit(style)}>BEARBEITEN</Button>
          <Button color="error" onClick={() => onDelete(style)}>LÖSCHEN</Button>
        </ButtonGroup>
      </CardContent>
    </Card>
  );
};

export default StyleCard;
