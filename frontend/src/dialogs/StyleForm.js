import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button,
         FormControl, InputLabel, Select, MenuItem, Chip, Box } from '@mui/material';
import { KleiderschrankAPI } from '../api';

class StyleForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      style: props.style || {
        name: '',
        features: [], // ausgewählte Kleidungstypen
        constraints: [] // Style-Constraints
      },
      kleidungstypen: [],
      loading: false,
      error: null
    };
  }

  componentDidMount() {
    this.loadKleidungstypen();
  }

  loadKleidungstypen = async () => {
    try {
      const kleidungstypen = await KleiderschrankAPI.getAPI().getKleidungstypen();
      this.setState({ kleidungstypen });
    } catch (error) {
      this.setState({ error: 'Fehler beim Laden der Kleidungstypen' });
    }
  }

  handleNameChange = (event) => {
    this.setState({
      style: { ...this.state.style, name: event.target.value }
    });
  }

  handleKleidungstypChange = (event) => {
    this.setState({
      style: { ...this.state.style, features: event.target.value }
    });
  }

  handleSubmit = async () => {
    const { style } = this.state;
    try {
      this.setState({ loading: true });
      if (style.id) {
        await KleiderschrankAPI.getAPI().updateStyle(style);
      } else {
        await KleiderschrankAPI.getAPI().addStyle(style);
      }
      this.props.onClose(style);
    } catch (error) {
      this.setState({ error: 'Fehler beim Speichern des Styles' });
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const { style, kleidungstypen, error, loading } = this.state;
    const { show, onClose } = this.props;

    return (
      <Dialog open={show} onClose={() => onClose(null)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {style.id ? 'Style bearbeiten' : 'Neuen Style erstellen'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Style Name"
            type="text"
            fullWidth
            value={style.name}
            onChange={this.handleNameChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Kleidungstypen</InputLabel>
            <Select
              multiple
              value={style.features}
              onChange={this.handleKleidungstypChange}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value.id} label={value.bezeichnung} />
                  ))}
                </Box>
              )}
            >
              {kleidungstypen.map((typ) => (
                <MenuItem key={typ.id} value={typ}>
                  {typ.bezeichnung}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {error && <Box color="error.main" mt={2}>{error}</Box>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose(null)}>Abbrechen</Button>
          <Button
            onClick={this.handleSubmit}
            disabled={loading || !style.name || style.features.length === 0}
          >
            Speichern
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default StyleForm;

// Brauche ich nicht, da Style beim Hinzufügen eines Kleidungsstücks über seinen Typen festgelegt wird.