import React, { Component } from 'react';
import { List } from '@mui/material';
import KleidungsstueckCard from "./KleidungsstueckCard";

class KleidungsstueckList extends Component {
  constructor(props) {
    super(props);
  }
  // kein eigener state, da wir lediglich props von der übergeordneten Komponente entgegennehmen

  handleKleidungsstueckDelete = (deletedKleidungsstueck) => {
      // Nach dem Löschen die übergeordnete Komponente informieren
      this.props.onUpdate();
  }

  render() {
    const { kleidungsstuecke } = this.props;

    return (

      <List>
        {kleidungsstuecke.map(kleidungsstueck => (
          <KleidungsstueckCard
            key={kleidungsstueck.getID()}
            kleidungsstueck={kleidungsstueck}
            onDelete={this.handleKleidungsstueckDelete}
            onUpdate={this.props.onUpdate}
            />
           ))}
            </List>
        );
    }
}

export default KleidungsstueckList;