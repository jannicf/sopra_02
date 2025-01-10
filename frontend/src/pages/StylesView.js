import React, { Component } from 'react';
import { Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import StyleList from "../components/StyleList";
import StyleForm from "../dialogs/StyleForm";
import StyleDeleteDialog from "../dialogs/StyleDeleteDialog";
import KleiderschrankAPI from '../api/KleiderschrankAPI';

class StylesView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      styles: [],
      selectedStyle: null,
      showFormDialog: false,
      showDeleteDialog: false,
      loadingInProgress: false,
      error: null,
      kleiderschrankId: null
    };
  }

  componentDidMount() {
        // Zuerst Kleiderschrank ID laden
        KleiderschrankAPI.getAPI()
            .getPersonByGoogleId(this.props.user?.uid)
            .then(person => {
                if (person && person.getKleiderschrank()) {
                const kleiderschrankId = person.getKleiderschrank().getID();
                this.setState({
                    kleiderschrankId: kleiderschrankId
                }, () => {
                    this.loadStyles();
                });
                }
            }).catch(error => {
                this.setState({
                    error: "Fehler beim Laden des Kleiderschranks"
                });
            });
  }

  // Lädt alle Styles
  loadStyles = () => {
    this.setState({ loadingInProgress: true, error: null });
    // Nur die Styles des eigenen Kleiderschranks laden
    KleiderschrankAPI.getAPI()
        .getStyles()
        .then(styles => {
          // Hier filtern wir die Styles nach kleiderschrank_id
          const filteredStyles = styles.filter(style => {
                return style.getKleiderschrankId() === this.state.kleiderschrankId;
            });

          this.setState({
            styles: filteredStyles,
            loadingInProgress: false
          });
        })
        .catch(error => {
          this.setState({
            error: error.message,
            loadingInProgress: false
          });
        });
    };

  // Öffnet den Formular-Dialog zum Erstellen eines neuen Styles
  handleCreateClick = () => {
    this.setState({ selectedStyle: null, showFormDialog: true });
  };

  // Öffnet den Formular-Dialog zum Bearbeiten eines Styles
  handleEditClick = (style) => {
    this.setState({ selectedStyle: style, showFormDialog: true });
  };

  // Öffnet den Lösch-Dialog
  handleDeleteClick = (style) => {
    this.setState({ selectedStyle: style, showDeleteDialog: true });
  };

  // Schließt den Formular-Dialog und aktualisiert die Liste der Styles
  handleFormDialogClosed = (updatedStyle) => {
    if (updatedStyle) {
      // Style wurde erstellt/bearbeitet
      this.loadStyles();
    }
    this.setState({ showFormDialog: false, selectedStyle: null });
  };

  // Schließt den Lösch-Dialog und aktualisiert die Liste der Styles
  handleDeleteDialogClosed = (deletedStyle) => {
    if (deletedStyle) {
      this.loadStyles();
    }
    this.setState({ showDeleteDialog: false, selectedStyle: null });
  };

  render() {
    const { styles, selectedStyle, showFormDialog, showDeleteDialog } = this.state;

    return (
      <div>
        <Typography variant="h4" sx={{ mt: 2 }}>Meine Styles</Typography>

        {/* Liste der Styles */}
        <StyleList
          styles={styles}
          onEdit={this.handleEditClick}
          onDelete={this.handleDeleteClick}
        />

        {/* Button zum Erstellen eines neuen Styles */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={this.handleCreateClick}
          sx={{
            position: 'fixed',
            bottom: '4.5rem',
            right: '2rem'
          }}
        >
          Neuer Style
        </Button>

        {/* Formular-Dialog */}
        {showFormDialog && (
          <StyleForm
            show={showFormDialog}
            style={selectedStyle}
            onClose={this.handleFormDialogClosed}
            kleiderschrankId={this.state.kleiderschrankId}
          />
        )}

        {/* Lösch-Dialog */}
        {showDeleteDialog && (
          <StyleDeleteDialog
            show={showDeleteDialog}
            style={selectedStyle}
            onClose={this.handleDeleteDialogClosed}
          />
        )}
      </div>
    );
  }
}

export default StylesView;