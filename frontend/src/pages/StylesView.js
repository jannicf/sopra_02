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
    };
  }

  componentDidMount() {
    this.loadStyles();
  }

  // Lädt alle Styles
  loadStyles = () => {
    this.setState({ loadingInProgress: true, error: null });
    KleiderschrankAPI.getAPI()
      .getStyles()
      .then((styles) => this.setState({ styles, loadingInProgress: false }))
      .catch((error) =>
        this.setState({ error: error.message, loadingInProgress: false })
      );
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
        <Typography variant="h4">Meine Styles</Typography>
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
        >
          Neuer Style
        </Button>
        {/* Formular-Dialog */}
        {showFormDialog && (
          <StyleForm
            show={showFormDialog}
            style={selectedStyle}
            onClose={this.handleFormDialogClosed}
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
