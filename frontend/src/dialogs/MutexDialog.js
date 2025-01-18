import React, { useState, useEffect } from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';

const MutexDialog = ({ open, onClose, style, onSave, initialData = null }) => {
  const [formData, setFormData] = useState({
    bezugsobjekt1: '',
    bezugsobjekt2: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        bezugsobjekt1: initialData.bezugsobjekt1?.id || '',
        bezugsobjekt2: initialData.bezugsobjekt2?.id || ''
      });
    }
  }, [initialData]);

  const handleSubmit = () => {
    onSave({
      type: 'mutex',
      bezugsobjekt1_id: formData.bezugsobjekt1,
      bezugsobjekt2_id: formData.bezugsobjekt2
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {initialData ? 'Mutex bearbeiten' : 'Neuer Mutex'}
      </DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel>Erster Kleidungstyp</InputLabel>
          <Select
            value={formData.bezugsobjekt1}
            onChange={(e) => setFormData({ ...formData, bezugsobjekt1: e.target.value })}
          >
            {style?.getFeatures().map((feature) => (
              <MenuItem
                key={feature.getID()}
                value={feature.getID()}
                disabled={feature.getID() === formData.bezugsobjekt2}
              >
                {feature.getBezeichnung()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Zweiter Kleidungstyp</InputLabel>
          <Select
            value={formData.bezugsobjekt2}
            onChange={(e) => setFormData({ ...formData, bezugsobjekt2: e.target.value })}
          >
            {style?.getFeatures().map((feature) => (
              <MenuItem
                key={feature.getID()}
                value={feature.getID()}
                disabled={feature.getID() === formData.bezugsobjekt1}
              >
                {feature.getBezeichnung()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!formData.bezugsobjekt1 || !formData.bezugsobjekt2}
        >
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MutexDialog;