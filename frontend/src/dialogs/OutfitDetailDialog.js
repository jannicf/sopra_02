import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Chip, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import OutfitDeleteDialog from './OutfitDeleteDialog';

const OutfitDetailDialog = ({ outfit, open, onClose, onDelete }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!outfit) return null;

  const style = outfit.getStyle();
  const kleidungsstuecke = outfit.getBausteine() || [];

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteDialogClose = (shouldDelete) => {
    setShowDeleteDialog(false);
    if (shouldDelete) {
      onDelete(outfit);
      onClose();
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
            Outfit Details
          <IconButton
            onClick={handleDeleteClick}
            color="error"
            size="large"
            aria-label="delete outfit"
          >
            <DeleteIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {/* Style Info */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
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
            Kleidungsstücke:
          </Typography>
          {kleidungsstuecke.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {kleidungsstuecke.map((kleidungsstueck, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    backgroundColor: 'rgba(0, 0, 0, 0.03)',
                    borderRadius: 1
                  }}
                >
                  <Typography variant="subtitle2">
                    {kleidungsstueck.getName() || 'Unbenannt'}
                  </Typography>
                  <Box display="flex" gap={1} mt={1}>
                    {kleidungsstueck.getTyp() && (
                      <Chip
                        label={`Typ: ${kleidungsstueck.getTyp().getBezeichnung()}`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography color="textSecondary">
              Keine Kleidungsstücke vorhanden
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>
            Schließen
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <OutfitDeleteDialog
        show={showDeleteDialog}
        outfit={outfit}
        onClose={handleDeleteDialogClose}
      />
    </>
  );
};

export default OutfitDetailDialog;
