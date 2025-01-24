import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import OutfitDeleteDialog from '../dialogs/OutfitDeleteDialog';

const OutfitCard = ({ outfit, onClick, onDelete }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const style = outfit.getStyle();
  const bausteine = outfit.getBausteine() || [];

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleDeleteDialogClose = (deletedOutfit) => {
    setShowDeleteDialog(false);
    if (deletedOutfit) {
      onDelete(deletedOutfit);
    }
  };

  return (
    <>
      <Card
        sx={{
          p: 2,
          cursor: 'pointer',
          borderRadius: 2,
          '&:hover': {
            transform: 'translateY(-2px)',
            transition: 'all 0.2s'
          }
        }}
        onClick={() => onClick(outfit)}
      >
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6">
                Outfit {outfit.getID()}
              </Typography>
              {style && (
                <Typography color="textSecondary">
                  Style: {style.getName()}
                </Typography>
              )}
              <Typography color="textSecondary">
                {bausteine.length} Kleidungsstücke
              </Typography>
            </Box>
            <Box>
              <IconButton
                onClick={handleDeleteClick}
                sx={{ color: 'error.main', '&:hover': { bgcolor: '#f5f5f5' } }}
                disableRipple
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <OutfitDeleteDialog
        show={showDeleteDialog}
        outfit={outfit}
        onClose={handleDeleteDialogClose}
      />
    </>
  );
};

export default OutfitCard;