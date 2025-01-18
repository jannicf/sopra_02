import React, { Component } from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions,
  Button, FormControl, InputLabel, Select, MenuItem, Typography} from '@mui/material';

class MutexDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        bezugsobjekt1: '',
        bezugsobjekt2: ''
      }
    };
  }

  componentDidMount() {
    if (this.props.initialData) {
      this.setState({
        formData: {
          bezugsobjekt1: this.props.initialData.bezugsobjekt1?.id || '',
          bezugsobjekt2: this.props.initialData.bezugsobjekt2?.id || ''
        }
      });
    }
  }

  handleSubmit = () => {
    this.props.onSave({
      type: 'mutex',
      bezugsobjekt1_id: this.state.formData.bezugsobjekt1,
      bezugsobjekt2_id: this.state.formData.bezugsobjekt2
    });
    this.props.onClose();
  }

  render() {
    const {open, onClose, style} = this.props;
    const {formData} = this.state;

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>
          {this.props.initialData ? 'Mutex bearbeiten' : 'Neue Mutex'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Die ausgewählten Kleidungstypen dürfen nicht zusammen in einem Outfit vorkommen.
          </Typography>

          <FormControl fullWidth margin="normal">
            <InputLabel>Erster Kleidungstyp</InputLabel>
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
            <InputLabel>Zweiter Kleidungstyp</InputLabel>
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


export default MutexDialog;