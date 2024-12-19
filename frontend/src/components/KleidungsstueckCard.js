import React, { Component } from 'react';
import { Typography, Card, CardContent, Grid, Button, ButtonGroup, Dialog } from '@mui/material';
import KleidungsstueckForm from './dialogs/KleidungsstueckForm';
import KleidungsstueckDeleteDialog from './dialogs/KleidungsstueckDeleteDialog';

/**
 * Rendert ein KleidungsstueckBO-Objekt in einer Card-Ansicht.
 * Bietet Funktionen zum Bearbeiten und Löschen des Kleidungsstücks.
 */
class KleidungsstueckCard extends Component {
  constructor(props) {
    super(props);
    // Initialisierung des States
    this.state = {
      kleidungsstueck: props.kleidungsstueck,
      showKleidungsstueckForm: false,
      showDeleteDialog: false,
    };
  }

  /** Behandelt den Klick auf den Bearbeiten-Button */
  handleEditButtonClicked = (event) => {
    event.stopPropagation();
    this.setState({
      showKleidungsstueckForm: true
    });
  }
   /** Behandelt das Schließen des KleidungsstueckForm-Dialogs */
  handleKleidungsstueckFormClosed = (kleidungsstueck) => {
    // Wenn kleidungsstueck nicht null ist, wurde es geändert
    if (kleidungsstueck) {
      this.setState({
        kleidungsstueck: kleidungsstueck,
        showKleidungsstueckForm: false
      });
      // Informiere die Elternkomponente über die Änderung
      this.props.onUpdate(kleidungsstueck);
    } else {
      this.setState({
        showKleidungsstueckForm: false
      });
    }
  }
  /** Behandelt den Klick auf den Löschen-Button */
  handleDeleteButtonClicked = (event) => {
    event.stopPropagation();
    this.setState({
      showDeleteDialog: true
    });
  }

  /** Behandelt das Schließen des Lösch-Dialogs */
  handleDeleteDialogClosed = (kleidungsstueck) => {
    if (kleidungsstueck) {
      this.props.onDelete(kleidungsstueck);
    }

    this.setState({
      showDeleteDialog: false
    });
  }
  render() {
    const { kleidungsstueck, showKleidungsstueckForm, showDeleteDialog } = this.state;

    return (
      <div>
        <Card>
          <CardContent>
            <Grid container spacing={2} alignItems='center'>
              <Grid item>
                <Typography variant='h6'>
                  {kleidungsstueck.name}
                </Typography>
                <Typography color='textSecondary'>
                  Typ: {kleidungsstueck.typ}
                </Typography>
              </Grid>
              <Grid item>
                <ButtonGroup variant='text' size='small'>
                  <Button color='primary' onClick={this.handleEditButtonClicked}>
                    bearbeiten
                  </Button>
                  <Button color='secondary' onClick={this.handleDeleteButtonClicked}>
                    löschen
                  </Button>
                </ButtonGroup>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Die Dialoge werden als separate Komponenten eingebunden */}
        <KleidungsstueckForm
          show={showKleidungsstueckForm}
          kleidungsstueck={kleidungsstueck}
          onClose={this.handleKleidungsstueckFormClosed}
        />
        <KleidungsstueckDeleteDialog
          show={showDeleteDialog}
          kleidungsstueck={kleidungsstueck}
          onClose={this.handleDeleteDialogClosed}
        />
      </div>
    );
  }
}

export default KleidungsstueckCard;

