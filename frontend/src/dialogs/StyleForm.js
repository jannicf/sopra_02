import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import KleiderschrankAPI from '../api/KleiderschrankAPI';
import StyleBO from "../api/StyleBO";

class StyleForm extends Component {
  constructor(props) {
  super(props);

  // Überprüfe, ob ein Style übergeben wurde, und wandle ihn in eine Instanz von StyleBO um
  this.state = {
    style: props.style ? props.style : new StyleBO(),
    error: null,
    loading: false,
  };
}


  handleNameChange = (event) => {
  const { style } = this.state;

  // Setze den Namen im StyleBO-Objekt
  style.setName(event.target.value);

  this.setState({ style });
};

  handleSubmit = async () => {
  const { style } = this.state;

  try {
    this.setState({ loading: true });

    if (style.getID()) {
      // Style aktualisieren
      await KleiderschrankAPI.getAPI().updateStyle(style);
    } else {
      // Neuen Style hinzufügen
      const createdStyle = await KleiderschrankAPI.getAPI().addStyle(style);
      this.setState({ style: createdStyle });
    }

    this.props.onClose(style);
  } catch (error) {
    this.setState({ error: `Fehler beim Speichern des Styles: ${error.message}` });
  } finally {
    this.setState({ loading: false });
  }
};




  render() {
    const { style, error, loading } = this.state;
    const { show, onClose } = this.props;

    return (
      <Dialog open={show} onClose={() => onClose(null)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {style.id ? 'Style bearbeiten' : 'Neuen Style hinzufügen'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={style.name}
            onChange={this.handleNameChange}
          />
          {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose(null)}>Abbrechen</Button>
          <Button onClick={this.handleSubmit} disabled={loading || !style.name}>
            Speichern
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default StyleForm;
