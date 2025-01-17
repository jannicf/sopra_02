import React, { Component } from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  FormControl, InputLabel, Select, MenuItem} from '@mui/material';

class KardinalitaetDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        bezugsobjekt: '',
        minAnzahl: 0,
        maxAnzahl: 1
      }
    };
  }

  componentDidMount() {
    if (this.props.initialData) {
      this.setState({
        formData: {
          bezugsobjekt: this.props.initialData.bezugsobjekt?.id || '',
          minAnzahl: this.props.initialData.minAnzahl || 0,
          maxAnzahl: this.props.initialData.maxAnzahl || 1
        }
      });
    }
  }

  handleSubmit = () => {
    this.props.onSave({
      type: 'kardinalitaet',
      bezugsobjekt_id: this.state.formData.bezugsobjekt,
      min_anzahl: this.state.formData.minAnzahl,
      max_anzahl: this.state.formData.maxAnzahl
    });
    this.props.onClose();
  }

  render() {
    const { open, onClose, style } = this.props;
    const { formData } = this.state;

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>
          {this.props.initialData ? 'Kardinalität bearbeiten' : 'Neue Kardinalität'}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Kleidungstyp</InputLabel>
            <Select
              value={formData.bezugsobjekt}
              onChange={(e) => this.setState({
                formData: {
                  ...this.state.formData,
                  bezugsobjekt: e.target.value
                }
              })}
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
            onChange={(e) => this.setState({
              formData: {
                ...this.state.formData,
                minAnzahl: parseInt(e.target.value)
              }
            })}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Maximale Anzahl"
            type="number"
            value={formData.maxAnzahl}
            onChange={(e) => this.setState({
              formData: {
                ...this.state.formData,
                maxAnzahl: parseInt(e.target.value)
              }
            })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Abbrechen</Button>
          <Button
            onClick={this.handleSubmit}
            variant="contained"
            color="primary"
            disabled={!formData.bezugsobjekt || formData.maxAnzahl < formData.minAnzahl}
          >
            Speichern
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default KardinalitaetDialog;