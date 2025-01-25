import React, { Component } from 'react';
import { Typography, Card, CardContent, Grid, Button, ButtonGroup, IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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
       <Card sx={{
        p: 2,
        cursor: 'pointer',
        borderRadius: 2,
        '&:hover': {
          transform: 'translateY(-2px)',
          transition: 'all 0.2s'
        }
      }}>
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6">
                {kleidungsstueck.getName()}
              </Typography>
              <Typography color="textSecondary">
                Typ: {typBezeichnung}
              </Typography>
            </Box>
            <Box>
              <IconButton
                onClick={this.handleEditClick}
                sx={{ color: 'primary.main', '&:hover': { bgcolor: '#f5f5f5' } }}
                disableRipple
              >
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={this.handleDeleteClick}
                sx={{ color: 'error.main', '&:hover': { bgcolor: '#f5f5f5' } }}
                disableRipple
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        </CardContent>

        <KleidungsstueckForm
          show={showEditDialog}
          kleidungsstueck={kleidungsstueck}
          onClose={this.handleEditDialogClosed}
          kleiderschrankId={this.props.kleiderschrankId}
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

