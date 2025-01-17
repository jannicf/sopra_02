import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

class OutfitDetailDialog extends Component {
  render() {
    const { open, onClose, style } = this.props;
    const { formData } = this.state;

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>
          {this.props.initialData ? 'Implikation bearbeiten' : 'Neue Implikation'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Wenn das erste Kleidungstyp vorhanden ist, muss auch das zweite vorhanden sein.
          </Typography>

          <FormControl fullWidth margin="normal">
            <InputLabel>Wenn dieser Kleidungstyp...</InputLabel>
            <Select
              value={formData.bezugsobjekt1}
              onChange={(e) => this.setState({
                formData: {
                  ...this.state.formData,
                  bezugsobjekt1: e.target.value
                }
              })}
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
            <InputLabel>...dann auch dieser Kleidungstyp</InputLabel>
            <Select
              value={formData.bezugsobjekt2}
              onChange={(e) => this.setState({
                formData: {
                  ...this.state.formData,
                  bezugsobjekt2: e.target.value
                }
              })}
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
            onClick={this.handleSubmit}
            variant="contained"
            color="primary"
            disabled={!formData.bezugsobjekt1 || !formData.bezugsobjekt2}
          >
            Speichern
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default OutfitDetailDialog;
