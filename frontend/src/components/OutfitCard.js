import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';

const OutfitCard = ({ outfit, onClick }) => {
  const style = outfit.getStyle();
  const bausteine = outfit.getBausteine() || [];

  return (
    <Card
      onClick={() => onClick(outfit)}
      sx={{
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          boxShadow: 3,
          transform: 'scale(1.02)',
          transition: 'all 0.2s ease-in-out'
        }
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Outfit {outfit.getID()}
        </Typography>

        {style && (
          <Box sx={{ mb: 2 }}>
            <Chip
              label={`Style: ${style.getName()}`}
              color="primary"
              variant="outlined"
              size="small"
            />
          </Box>
        )}

        <Typography color="textSecondary">
          {bausteine.length} Kleidungsstücke
        </Typography>
      </CardContent>
    </Card>
  );
};

export default OutfitCard;
