import React, { Component } from 'react';
import { Typography, Card, CardContent, Grid, Button, ButtonGroup } from '@mui/material';
import KleidungsstueckForm from '../dialogs/KleidungsstueckForm';
import KleidungsstueckDeleteDialog from '../dialogs/KleidungsstueckDeleteDialog';

/**
 * Rendert ein KleidungsstueckBO-Objekt in einer Card-Ansicht.
 * Bietet Funktionen zum Bearbeiten und Löschen des Kleidungsstücks.
 */
class KleidungsstueckCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditDialog: false,
      showDeleteDialog: false,
    };
  }

  handleEditClick = () => {
        this.setState({ showEditDialog: true });
    }

    handleDeleteClick = () => {
        this.setState({ showDeleteDialog: true });
    }

    handleEditDialogClosed = (editedKleidungsstueck) => {
        if (editedKleidungsstueck) {
            this.props.onUpdate();
        }
        this.setState({ showEditDialog: false });
    }

    handleDeleteDialogClosed = (deletedKleidungsstueck) => {
        if (deletedKleidungsstueck) {
            this.props.onDelete(deletedKleidungsstueck);
        }
        this.setState({ showDeleteDialog: false });
    }

  render() {
    const { kleidungsstueck } = this.props;
    const { showEditDialog, showDeleteDialog } = this.state;
    // Sicherer Zugriff auf die Typ-Bezeichnung mit Fallback-Parameter für den Fall dass noch nichts zugewiesn wurde
    const typBezeichnung = kleidungsstueck?.typ?.bezeichnung || 'Kein Typ zugewiesen';

    return (

        <Card>
          <CardContent>
            <Grid container spacing={2} alignItems='center'>
              <Grid item>
                <Typography variant='h6'>
                  {kleidungsstueck.getName()}
                </Typography>
                <Typography color='textSecondary'>
                  Typ: {typBezeichnung}
                </Typography>
              </Grid>
              <Grid item>
                <ButtonGroup variant='text' size='small'>
                  <Button color='primary' onClick={this.handleEditClick}>
                    Bearbeiten
                  </Button>
                  <Button color='secondary' onClick={this.handleDeleteClick}>
                    Löschen
                  </Button>
                </ButtonGroup>
              </Grid>
            </Grid>
          </CardContent>

        {/* Die Dialoge werden als separate Komponenten eingebunden */}
        <KleidungsstueckForm
          show={showEditDialog}
          kleidungsstueck={kleidungsstueck}
          onClose={this.handleEditDialogClosed}
        />
        <KleidungsstueckDeleteDialog
          show={showDeleteDialog}
          kleidungsstueck={kleidungsstueck}
          onClose={this.handleDeleteDialogClosed}
        />
        </Card>
    );

  }
}

export default KleidungsstueckCard;

