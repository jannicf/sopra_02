import React, { Component } from 'react';
import { Typography, Button, Box, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton';
import PersonForm from '../dialogs/PersonForm';
import PersonEditForm from '../dialogs/PersonEditForm';
import KleiderschrankAPI from '../api/KleiderschrankAPI';
import PersonDeleteDialog from "../dialogs/PersonDeleteDialog";
import DeleteIcon from "@mui/icons-material/Delete";

class PersonView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            person: null,
            showCreateDialog: false,
            showEditDialog: false,
            showDeleteDialog: false,
            error: null,
            loading: false
        };
    }

    handleDeleteClick = () => {
        this.setState({showDeleteDialog: true});
    }

    handleDeleteDialogClosed = async (wasDeleted) => {
    if (wasDeleted) {
        // Erst State zurücksetzen
        this.setState({
            person: null,
            showDeleteDialog: false
        });

        // Dann alle relevanten Cookies löschen
        document.cookie = 'token=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT';

        // Kurz warten
        await new Promise(resolve => setTimeout(resolve, 100));

        // Zur Login-Seite navigieren und neu laden
        window.location.href = '/'
    } else {
        this.setState({showDeleteDialog: false});
        }
    }

    componentDidMount() {
        this.loadPerson();
    }

    loadPerson = async () => {
    try {
        this.setState({loading: true});
        const persons = await KleiderschrankAPI.getAPI().getPersonByGoogleId(this.props.user?.uid);
        this.setState({
            person: persons,
            loading: false,
            error: null
        });
    } catch (error) {
        console.error("ProfilView: Fehler beim Laden der Person:", error);
        this.setState({
            error: error.message,
            loading: false,
            person: null
            });
        }
    };

    handleCreateClick = () => {
        this.setState({showCreateDialog: true});
    }

    handleEditClick = () => {
        this.setState({showEditDialog: true});
    }

    handleCreateDialogClosed = async (createdPerson) => {
        if (createdPerson) {
            await this.loadPerson();
            this.setState({
                showCreateDialog: false,
                error: null
            });
        } else {
            this.setState({showCreateDialog: false});
        }
    }

    handleEditDialogClosed = async (editedPerson) => {
    if (editedPerson) {
        // Explizit neu laden, um die aktuellsten Daten vom Server zu bekommen
        await this.loadPerson();

        // State aktualisieren, um Re-Render zu triggern
        this.setState({
            showEditDialog: false
        });
    } else {
        this.setState({
            showEditDialog: false
            });
        }
    };

    render() {
    const {person, showCreateDialog, showEditDialog, showDeleteDialog, loading} = this.state;

    // Schrittweise Überprüfung
    if (person) {
        // Prüfen, was der Kleiderschrank tatsächlich ist
        const kleiderschrank = person.getKleiderschrank();
        }

    if (loading) {
        return <Typography>Lade Profil...</Typography>;
        }

        return (
            <div>
                <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
                    Mein Profil
                </Typography>

                {person ? (
                    // Wenn Person existiert, zeigen wir die Informationen an
                    <Paper elevation={3} sx={{p: 3, mt: 2}}>
                        <Box display="flex" justifyContent="space-between" alignItems="start">
                            <Typography variant="h6">Persönliche Informationen</Typography>
                            <Box>
                                <IconButton
                                    onClick={this.handleEditClick}
                                    color="primary"
                                    sx={{ mr: 1 }}
                                >
                                    <EditIcon/>
                                </IconButton>
                                <IconButton
                                    onClick={this.handleDeleteClick}
                                    color="error"
                                >
                                    <DeleteIcon/>
                                </IconButton>
                            </Box>
                        </Box>
                        <Box sx={{mt: 2}}>
                            <Typography>Vorname: {person.getVorname()}</Typography>
                            <Typography>Nachname: {person.getNachname()}</Typography>
                            <Typography>Nickname: {person.getNickname()}</Typography>

                            {/* Kleiderschrank-Anzeige */}
                            {person && person.getKleiderschrank() ? (
                                <Box sx={{mt: 2}}>
                                    <Typography variant="subtitle1">Kleiderschrank</Typography>
                                    <Typography>
                                        {(() => {
                                            const kleiderschrank = person.getKleiderschrank();
                                            if (kleiderschrank && typeof kleiderschrank === 'object') {
                                                return `Name: ${kleiderschrank.getName ? 
                                                       kleiderschrank.getName() : 
                                                       (kleiderschrank.name || 'Unbekannt')}`;
                                            }
                                            return 'Kleiderschrank-Details nicht verfügbar';
                                        })()}
                                    </Typography>
                                </Box>
                            ) : (
                                <Typography color="error" sx={{mt: 2}}>
                                    Kein Kleiderschrank zugewiesen
                                </Typography>
                            )}
                        </Box>
                    </Paper>
                ) : (
                    // Wenn keine Person existiert, zeigen wir den "Person hinzufügen" Button
                    <Box sx={{mt: 4, textAlign: 'center'}}>
                        <Typography variant="h6" gutterBottom>
                            Sie haben noch kein Profil angelegt
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon/>}
                            onClick={this.handleCreateClick}
                            sx={{mt: 2}}
                        >
                            Person hinzufügen
                        </Button>
                    </Box>
                )}

                {/* Dialog zum Erstellen einer neuen Person */}
                <PersonForm
                    show={showCreateDialog}
                    onClose={this.handleCreateDialogClosed}
                    user={this.props.user}
                />

                {/* Dialog zum Bearbeiten der Person */}
                {person && (
                  <>
                    <PersonEditForm
                        show={showEditDialog}
                        onClose={this.handleEditDialogClosed}
                        person={person}
                    />
                    <PersonDeleteDialog
                        show={showDeleteDialog}
                        onClose={this.handleDeleteDialogClosed}
                        person={person}
                    />
                  </>
                )}
            </div>
        );
    }
}

export default PersonView;