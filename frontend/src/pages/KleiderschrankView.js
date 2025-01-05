import React, { Component } from 'react';
import { Typography, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import KleidungsstueckList from "../components/KleidungsstueckList";
import KleidungstypList from "../components/KleidungstypList";
import KleidungsstueckForm from "../dialogs/KleidungsstueckForm";
import KleidungstypForm from "../dialogs/KleidungstypForm";
import KleiderschrankAPI from '../api/KleiderschrankAPI';

class KleiderschrankView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            kleidungsstuecke: [],
            kleidungstypen: [],
            showCreateDialog: false,
            showCreateTypDialog: false,
            loadingInProgress: true,
            error: null,
            activeView: 'kleidungsstuecke',
            kleiderschrankId: null
        };
    }

    componentDidMount() {
        // Zuerst den Kleiderschrank des eingeloggten Users laden
        KleiderschrankAPI.getAPI().getPersonByGoogleId(this.props.user?.uid)
            .then(person => {
                if (person && person.getKleiderschrank()) {
                    this.setState({
                        kleiderschrankId: person.getKleiderschrank().getID(),
                        loadingInProgress: false
                    }, () => {
                        // Erst nach dem Setzen der ID die anderen Daten laden
                        this.loadKleidungsstuecke();
                        this.loadKleidungstypen();
                    });
                } else {
                    this.setState({
                        error: "Kein Kleiderschrank gefunden",
                        loadingInProgress: false
                    });
                }
        })
        .catch(error => {
            console.error('Error:', error);
            this.setState({
                error: "Fehler beim Laden des Kleiderschranks",
                loadingInProgress: false
            });
        });
    }

    loadKleidungsstuecke = () => {
         this.setState({
            loadingInProgress: true,
            error: null
        });

        // Hier nur die Kleidungsstücke des eigenen Kleiderschranks laden
        KleiderschrankAPI.getAPI()
            .getKleidungsstueckByKleiderschrankId(this.state.kleiderschrankId)            .then(kleidungsstuecke => {
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

    loadKleidungstypen = () => {
        this.setState({
            loadingInProgress: true,
            error: null
        });

        // Erst alle Kleidungsstücke des Kleiderschranks laden
        KleiderschrankAPI.getAPI()
            .getKleidungsstueckByKleiderschrankId(this.state.kleiderschrankId)
            .then(kleidungsstuecke => {
                // Set für eindeutige Typ-IDs erstellen
                const typIds = new Set(kleidungsstuecke.map(k => k.getTyp().getID()));

                // Alle Kleidungstypen laden
                return KleiderschrankAPI.getAPI().getKleidungstypen()
                    .then(alleTypen => {
                        // Nur die Typen behalten, die in unserem Kleiderschrank verwendet werden
                        const gefilterteTypen = alleTypen.filter(typ =>
                            typIds.has(typ.getID())
                        );

                        this.setState({
                            kleidungstypen: gefilterteTypen,
                            loadingInProgress: false
                        });
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

    handleCreateTypClick = () => {
        this.setState({ showCreateTypDialog: true });
    }

    handleCreateDialogClosed = (newKleidungsstueck) => {
        if (newKleidungsstueck) {
            // Neues Kleidungsstück wurde erstellt
            this.loadKleidungsstuecke(); // Liste neu laden
        }
        this.setState({ showCreateDialog: false });
    }

    handleCreateTypDialogClosed = (newKleidungstyp) => {
        if (newKleidungstyp) {
            // Neuer Kleidungstyp wurde erstellt
            this.loadKleidungstypen(); // Liste neu laden
        }
        this.setState({ showCreateTypDialog: false });
    }

    handleDeleteKleidungstyp = async (kleidungstyp) => {
        try {
            await KleiderschrankAPI.getAPI().deleteKleidungstyp(kleidungstyp.getID());
            this.loadKleidungstypen(); // Liste neu laden
            this.loadKleidungsstuecke(); // Auch Kleidungsstücke neu laden, da einige gelöscht worden sein könnten
        } catch (error) {
            console.error('Error deleting Kleidungstyp:', error);
        }
    }

    render() {
        const {
            kleidungsstuecke,
            kleidungstypen,
            showCreateDialog,
            showCreateTypDialog,
            activeView,
            loadingInProgress,
            error,
            kleiderschrankId
        } = this.state;

        if (loadingInProgress) {
            return <div>Lade Kleiderschrank...</div>;
        }

        if (error) {
            return <div>Fehler: {error}</div>;
        }

        return (
            <div>
                <Typography variant="h4" gutterBottom>
                    Mein Kleiderschrank
                </Typography>

                {/* Auswahlbuttons */}
                <Box
                    sx={{display: 'flex', justifyContent: 'center', gap: 2, my: 4}}
                >
                    <Button
                        variant={activeView === 'kleidungsstuecke' ? 'contained' : 'outlined'}
                        color="primary"
                        size="large"
                        onClick={() => this.setState({ activeView: 'kleidungsstuecke' })}
                    >
                        Kleidungsstücke
                    </Button>
                    <Button
                        variant={activeView === 'kleidungstypen' ? 'contained' : 'outlined'}
                        color="primary"
                        size="large"
                        onClick={() => this.setState({ activeView: 'kleidungstypen' })}
                    >
                        Kleidungstypen
                    </Button>
                </Box>

                {/* Bedingte Anzeige der Listen */}
                {activeView === 'kleidungsstuecke' ? (
                    <>
                        <KleidungsstueckList
                            kleidungsstuecke={kleidungsstuecke}
                            onUpdate={this.loadKleidungsstuecke}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={this.handleCreateClick}
                            sx={{ position: 'fixed', bottom: '4.5rem', right: '2rem' }}
                        >
                            Neues Kleidungsstück
                        </Button>
                    </>
                ) : (
                    <>
                        <KleidungstypList
                            kleidungstypen={kleidungstypen}
                            onUpdate={this.loadKleidungstypen}
                            onDelete={this.handleDeleteKleidungstyp}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={this.handleCreateTypClick}
                            sx={{ position: 'fixed', bottom: '4.5rem', right: '2rem' }}
                        >
                            Neuer Kleidungstyp
                        </Button>
                    </>
                )}

                {/* Dialoge */}
                {showCreateDialog && kleiderschrankId && (
                    <KleidungsstueckForm
                        show={showCreateDialog}
                        onClose={this.handleCreateDialogClosed}
                        kleiderschrankId={this.state.kleiderschrankId}
                    />
                )}
                <KleidungstypForm
                    show={showCreateTypDialog}
                    onClose={this.handleCreateTypDialogClosed}
                    kleiderschrankId={this.state.kleiderschrankId}
                />
            </div>
        );
    }
}

export default KleiderschrankView;