import React, { Component } from 'react';
import { Typography, Button, Box } from '@mui/material';
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
                    }, () => {
                        // Erst nach dem Setzen der ID die anderen Daten laden
                        this.loadKleidungsstuecke();
                        this.loadKleidungstypen();
                    });
                } else {
                    this.setState({
                        error: "Kein Kleiderschrank gefunden",
                    });
                }
        })
        .catch(error => {
            console.error('Error:', error);
            this.setState({
                error: "Fehler beim Laden des Kleiderschranks",
            });
        });
    }

    loadKleidungsstuecke = () => {
         this.setState({
            error: null
        });

        // Hier nur die Kleidungsstücke des eigenen Kleiderschranks laden
        KleiderschrankAPI.getAPI()
            .getKleidungsstueckByKleiderschrankId(this.state.kleiderschrankId)            .then(kleidungsstuecke => {
                this.setState({
                    kleidungsstuecke: kleidungsstuecke
                });
            })
            .catch(error => {
                console.error('Error:', error);
                this.setState({
                    error: error.message
                });
            });
    }

    loadKleidungstypen = async () => {
        try {
            const person = await KleiderschrankAPI.getAPI().getPersonByGoogleId(this.props.user?.uid);

            if (person && person.getKleiderschrank()) {
                const kleiderschrankId = person.getKleiderschrank().getID();

                // Hier die spezifische Funktion zum Laden der Kleidungstypen für einen Kleiderschrank
                const kleidungstypen = await KleiderschrankAPI.getAPI()
                    .getKleidungstypByKleiderschrankId(kleiderschrankId);

                this.setState({
                    kleidungstypen: kleidungstypen,
                    kleiderschrankId: kleiderschrankId,
                    error: null
                });
            }
        } catch (error) {
            console.error('Error:', error);
            this.setState({
                error: error.message
            });
        }
    };

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
            error,
            kleiderschrankId
        } = this.state;


        if (error) {
            return <div>Fehler: {error}</div>;
        }

        return (
            <div>
                <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
                    Mein Kleiderschrank
                </Typography>

                {/* Erklärender Text */}
                <Typography variant="body1" sx={{ mb: 4 }}>
                    Hier kannst du deine Kleidungsstücke und Kleidungstypen verwalten. Füge neue Kleidungsstücke hinzu,
                    ordne sie verschiedenen Typen zu und organisiere deinen digitalen Kleiderschrank ganz nach deinen
                    Vorstellungen. Du kannst zwischen der Ansicht deiner Kleidungsstücke und der Verwaltung der
                    Kleidungstypen wechseln.
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
                        disableRipple
                    >
                        Kleidungsstücke
                    </Button>
                    <Button
                        variant={activeView === 'kleidungstypen' ? 'contained' : 'outlined'}
                        color="primary"
                        size="large"
                        onClick={() => this.setState({ activeView: 'kleidungstypen' })}
                        disableRipple
                    >
                        Kleidungstypen
                    </Button>
                </Box>

                {/* Bedingte Anzeige der Listen */}
                {activeView === 'kleidungsstuecke' ? (
                    <>
                        {kleidungsstuecke.length >= 0 ? (
                            <KleidungsstueckList
                                kleidungsstuecke={kleidungsstuecke}
                                onUpdate={this.loadKleidungsstuecke}
                                kleiderschrankId={this.state.kleiderschrankId}
                                onCreateClick={this.handleCreateClick}
                            />
                        ) : (
                            <Typography
                                variant="body1"
                                align="center"
                                sx={{
                                    my: 4,
                                    p: 3,
                                    bgcolor: 'grey.100',
                                    borderRadius: 1
                                }}
                            >
                                Dein Kleiderschrank ist noch leer. Füge dein erstes Kleidungsstück hinzu,
                                indem du auf den "Neues Kleidungsstück" Button klickst.
                            </Typography>
                        )}
                    </>
                ) : (
                    <>
                        {kleidungstypen.length >= 0 ? (
                            <KleidungstypList
                                kleidungstypen={kleidungstypen}
                                kleiderschrankId={this.state.kleiderschrankId}
                                onUpdate={this.loadKleidungstypen}
                                onDelete={this.handleDeleteKleidungstyp}
                                onCreateClick={this.handleCreateTypClick}
                            />
                        ) : (
                            <Typography
                                variant="body1"
                                align="center"
                                sx={{
                                    my: 4,
                                    p: 3,
                                    bgcolor: 'grey.100',
                                    borderRadius: 1
                                }}
                            >
                                Es sind noch keine Kleidungstypen definiert. Erstelle deinen ersten Kleidungstyp,
                                indem du auf den "Neuer Kleidungstyp" Button klickst.
                            </Typography>
                        )}
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