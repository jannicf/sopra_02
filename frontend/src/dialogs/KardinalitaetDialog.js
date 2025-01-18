import React, { useState, useEffect } from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';

const KardinalitaetDialog = ({ open, onClose, style, onSave, initialData = null }) => {
  const [formData, setFormData] = useState({
    bezugsobjekt: '',
    minAnzahl: 0,
    maxAnzahl: 1
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        bezugsobjekt: initialData.bezugsobjekt?.id || '',
        minAnzahl: initialData.minAnzahl || 0,
        maxAnzahl: initialData.maxAnzahl || 1
      });
    }
  }, [initialData]);

  const handleSubmit = () => {
    onSave({
      type: 'kardinalitaet',
      bezugsobjekt_id: formData.bezugsobjekt,
      min_anzahl: formData.minAnzahl,
      max_anzahl: formData.maxAnzahl
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {initialData ? 'Kardinalität bearbeiten' : 'Neue Kardinalität'}
      </DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel>Kleidungstyp</InputLabel>
          <Select
            value={formData.bezugsobjekt}
            onChange={(e) => setFormData({ ...formData, bezugsobjekt: e.target.value })}
          >
            {style?.getFeatures().map((feature) => (
              <MenuItem key={feature.getID()} value={feature.getID()}>
                {feature.getBezeichnung()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Minimale Anzahl"
          type="number"
          value={formData.minAnzahl}
          onChange={(e) => setFormData({ ...formData, minAnzahl: parseInt(e.target.value) })}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Maximale Anzahl"
          type="number"
          value={formData.maxAnzahl}
          onChange={(e) => setFormData({ ...formData, maxAnzahl: parseInt(e.target.value) })}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!formData.bezugsobjekt || formData.maxAnzahl < formData.minAnzahl}
        >
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default KardinalitaetDialog;