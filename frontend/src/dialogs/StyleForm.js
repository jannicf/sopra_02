import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
         Select, MenuItem, FormControl, InputLabel, List, ListItem,
         ListItemText, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import StyleBO from '../api/StyleBO';
import KleidungstypBO from '../api/KleidungstypBO';
import KardinalitaetBO from '../api/KardinalitaetBO';
import MutexBO from '../api/MutexBO';
import ImplikationBO from '../api/ImplikationBO';

class StyleForm extends Component {
  constructor(props) {
    super(props);

    // Wenn ein Style zum Bearbeiten übergeben wurde, nutzen wir diesen,
    // ansonsten erstellen wir ein neues Style-Objekt
    this.state = {
      style: props.style ? props.style : new StyleBO(),
      alleKleidungstypen: [],
      error: null
    };
  }

  // Wenn sich die Props ändern (zb anderer Style wird bearbeitet)
  componentDidUpdate(prevProps) {
    if (this.props.style !== prevProps.style) {
      this.setState({
        style: this.props.style ? this.props.style : new StyleBO()
      });
    }
  }

  // Name des Styles ändern
  handleNameChange = (event) => {
    const style = this.state.style;
    // event.target.value referenziert das Objekt an welches das Ereignis gesendet wurde
    style.setName(event.target.value);
    this.setState({ style: style });
  }

  // Kleidungstypen hinzufügen/entfernen
  handleKleidungstypenChange = (event) => {
    const style = this.state.style;
    const selectedIds = event.target.value;

    // Aktuelle Features löschen
    style.getFeatures().length = 0;

    // Neue Features hinzufügen
    selectedIds.forEach(id => {
      const kleidungstyp = this.state.alleKleidungstypen.find(kt => kt.getID() === id);
      if (kleidungstyp) {
        style.addFeature(kleidungstyp);
      }
    });

    this.setState({ style: style });
  }

  // Einen neuen Constraint hinzufügen
  handleAddConstraint = (type) => {
    const style = this.state.style;

    switch(type) {
      case 'kardinalitaet':
        const kardinalitaet = new KardinalitaetBO();
        kardinalitaet.setStyle(style);
        style.addConstraint(kardinalitaet);
        break;

      case 'mutex':
        const mutex = new MutexBO();
        mutex.setStyle(style);
        style.addConstraint(mutex);
        break;

      case 'implikation':
        const implikation = new ImplikationBO();
        implikation.setStyle(style);
        style.addConstraint(implikation);
        break;
    }

    this.setState({ style: style });
  }

  // Einen Constraint entfernen
  handleRemoveConstraint = (type, index) => {
    const style = this.state.style;
    const constraints = style.getConstraints();

    // Finde den richtigen Constraint anhand von Typ und Index
    const constraintsOfType = constraints.filter(c => {
      switch(type) {
        case 'kardinalitaet': return c instanceof KardinalitaetBO;
        case 'mutex': return c instanceof MutexBO;
        case 'implikation': return c instanceof ImplikationBO;
        default: return false;
      }
    });

    if (constraintsOfType[index]) {
      style.removeConstraint(constraintsOfType[index]);
      this.setState({ style: style });
    }
  }

  // Style speichern
  handleSave = () => {
    // Hier können wir direkt das StyleBO-Objekt übergeben
    this.props.onClose(this.state.style);
  }

  render() {
    const { style } = this.state;

    return (
      <Dialog open={this.props.show}>
        <DialogTitle>
          Style {style.getID() ? 'bearbeiten' : 'erstellen'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Style Name"
            value={style.getName()}
            onChange={this.handleNameChange}
            fullWidth
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Erlaubte Kleidungstypen</InputLabel>
            <Select
              // Mehrfachauswahl
              multiple
              // aktuell ausgewählte Kleidungstypen
              value={style.getFeatures().map(kt => kt.getID())}
              onChange={this.handleKleidungstypenChange}
            >
              // alle möglichen Kleidungstypen zur Auswahl geben, jeden als einzelnes MenuItem
              {this.state.alleKleidungstypen.map(typ => (
                <MenuItem key={typ.getID()} value={typ.getID()}>
                  {typ.getBezeichnung()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="h6" sx={{mt: 2}}>Constraints</Typography>

          <List>
            {/* Kardinalitäts-Constraints */}
            {/* nach jeweiliger Constraint-Art filtern und diese dann mappen und in einer Liste darstellen */}
            {style.getConstraints()
              .filter(c => c instanceof KardinalitaetBO)
              .map((k, index) => (
                <ListItem key={`kardinalitaet-${index}`}>
                  <ListItemText
                    primary={`Kardinalität für ${k.getBezugsobjekt().getBezeichnung()}`}
                    secondary={`Minimum: ${k.getMinAnzahl()}, Maximum: ${k.getMaxAnzahl()}`}
                  />
                  <IconButton onClick={() => this.handleRemoveConstraint('kardinalitaet', index)}>
                    <DeleteIcon/>
                  </IconButton>
                </ListItem>
            ))}
          </List>
          <List>
            {/* Mutex-Constraints */}
            {style.getConstraints()
              .filter(c => c instanceof MutexBO)
              .map((k, index) => (
                <ListItem key={`mutex-${index}`}>
                  <ListItemText
                    primary={`Mutex für ${k.getBezugsobjekt1().getBezeichnung()} und ${k.getBezugsobjekt2().getBezeichnung()}`}
                    secondary={`Wenn ${k.getBezugsobjekt1().getBezeichnung()}, dann nicht ${k.getBezugsobjekt2().getBezeichnung()}`}
                  />
                  <IconButton onClick={() => this.handleRemoveConstraint('mutex', index)}>
                    <DeleteIcon/>
                  </IconButton>
                </ListItem>
            ))}
          </List>
          <List>
            {/* Implikations-Constraints */}
            {style.getConstraints()
              .filter(c => c instanceof ImplikationBO)
              .map((k, index) => (
                <ListItem key={`implikation-${index}`}>
                  <ListItemText
                    primary={`Implikation für ${k.getBezugsobjekt1().getBezeichnung()} und ${k.getBezugsobjekt2().getBezeichnung()}`}
                    secondary={`Wenn ${k.getBezugsobjekt1().getBezeichnung()}, dann auch ${k.getBezugsobjekt2().getBezeichnung()}`}
                  />
                  <IconButton onClick={() => this.handleRemoveConstraint('implikation', index)}>
                    <DeleteIcon/>
                  </IconButton>
                </ListItem>
            ))}
          </List>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => this.props.onClose(null)}>Abbrechen</Button>
          <Button onClick={this.handleSave} variant="contained">
            Speichern
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default StyleForm;