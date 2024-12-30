import React, { Component } from 'react';
import { Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import KleidungsstueckList from "../components/KleidungsstueckList";
import KleidungsstueckForm from "../dialogs/KleidungsstueckForm";
import KleiderschrankAPI from '../api/KleiderschrankAPI';

class KleiderschrankView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            kleidungsstuecke: [],
            showCreateDialog: false,
            loadingInProgress: false,
            error: null,
            kleiderschrankId: null
        };
    }

    componentDidMount() {
        this.loadKleidungsstuecke();
        // Den Kleiderschrank des eingeloggten Users laden
        KleiderschrankAPI.getAPI().getKleiderschraenke()
            .then(kleiderschraenke => {
                if (kleiderschraenke && kleiderschraenke.length > 0) {
                    this.setState({
                        kleiderschrankId: kleiderschraenke[0].getID()
                    });
                }
            });
    }

    loadKleidungsstuecke = () => {
         this.setState({
            loadingInProgress: true,
            error: null
        });

        KleiderschrankAPI.getAPI().getKleidungsstuecke()
            .then(kleidungsstuecke => {
                this.setState({
                    kleidungsstuecke: kleidungsstuecke,
                    loadingInProgress: false
                });
            })
            .catch(error => {
                console.error('Error:', error);
                this.setState({
                    error: error.message,
                    loadingInProgress: false
                });
            });
    }

    handleCreateClick = () => {
        this.setState({ showCreateDialog: true });
    }

    handleCreateDialogClosed = (newKleidungsstueck) => {
        if (newKleidungsstueck) {
            // Neues Kleidungsstück wurde erstellt
            this.loadKleidungsstuecke(); // Liste neu laden
        }
        this.setState({ showCreateDialog: false });
    }


    render() {
        const { kleidungsstuecke, showCreateDialog } = this.state;

        return (
            <div>
                <Typography variant="h4">
                    Mein Kleiderschrank
                </Typography>
                {/* Inhalt des Kleiderschranks */}
                <KleidungsstueckList
                    kleidungsstuecke={kleidungsstuecke}
                    onUpdate={this.loadKleidungsstuecke}
                />
                {/* Create-Button */}
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={this.handleCreateClick}
                    sx={{ position: 'fixed', bottom: '4.5rem', right: '2rem' }}
                >
                    Neues Kleidungsstück
                </Button>
                {/* Erstellungsdialog */}
                <KleidungsstueckForm
                    show={showCreateDialog}
                    onClose={this.handleCreateDialogClosed}
                    kleiderschrankId={this.state.kleiderschrankId}
                />

            </div>
        );
    }
}

export default KleiderschrankView;