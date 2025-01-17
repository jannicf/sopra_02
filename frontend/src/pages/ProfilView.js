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
import ErrorAlert from "../dialogs/ErrorAlert";

class ProfilView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            person: null,
            showCreateDialog: false,
            showEditDialog: false,
            showDeleteDialog: false,
            error: null
        };
    }

    handleDeleteClick = () => {
        this.setState({showDeleteDialog: true, error: null});
    }

    handleDeleteDialogClosed = async (wasDeleted) => {
        if (wasDeleted) {
            try {
                this.setState({
                    person: null,
                    showDeleteDialog: false,
                    error: null
                });
                document.cookie = 'token=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT';
                await new Promise(resolve => setTimeout(resolve, 100));
                window.location.href = '/';
            } catch (error) {
                this.setState({
                    error: "Fehler beim Löschen des Profils: " + error.message
                });
            }
        } else {
            this.setState({ showDeleteDialog: false });
        }
    }


    componentDidMount() {
        this.loadPerson();
    }

    loadPerson = async () => {
    try {
        const person = await KleiderschrankAPI.getAPI().getPersonByGoogleId(this.props.user?.uid);
        this.setState({
            person: person,
            error: null
        });
    } catch (error) {
        this.setState({
            error: "Fehler beim Laden des Profils: " + error.message,
            person: null
            });
        }
    };

    handleCreateClick = () => {
        this.setState({showCreateDialog: true, error: null});
    }

    handleEditClick = () => {
        this.setState({showEditDialog: true, error: null});
    }

    handleCreateDialogClosed = async (createdPerson) => {
        if (createdPerson) {
            try {
                await this.loadPerson();
                this.setState({
                    showCreateDialog: false,
                    error: null
                });
            } catch (error) {
                this.setState({
                    error: "Fehler beim Erstellen des Profils: " + error.message
                });
            }
        } else {
            this.setState({ showCreateDialog: false });
        }
    }

    handleEditDialogClosed = async (editedPerson) => {
        if (editedPerson) {
            try {
                await this.loadPerson();
                this.setState({
                    showEditDialog: false,
                    error: null
                });
            } catch (error) {
                this.setState({
                    error: "Fehler beim Aktualisieren des Profils: " + error.message
                });
            }
        } else {
            this.setState({ showEditDialog: false });
        }
    }



    render() {
    const {person, showCreateDialog, showEditDialog, showDeleteDialog, error} = this.state;

        return (
            <div>
                {error && (
                    <ErrorAlert
                        message={error}
                        onClose={this.handleErrorClose}
                    />
                )}
                <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
                    Mein Profil
                </Typography>

                {/* Erklärender Text */}
                <Typography variant="body1" sx={{ mb: 4 }}>
                    Hier kannst du dein Profil verwalten und deine persönlichen Daten anpassen.
                </Typography>
                {person ? (
                    // Wenn Person existiert, zeigen wir die Informationen an
                    <Paper elevation={3} sx={{p: 3, mt: 2}}>
                        <Box display="flex" justifyContent="space-between" alignItems="start">
                            <Typography variant="h6">Persönliche Informationen</Typography>
                            <Box>
                                <IconButton
                                    onClick={this.handleEditClick}
                                    disableRipple
                                    color="primary"
                                    sx={{ mr: 1 }}
                                >
                                    <EditIcon/>
                                </IconButton>
                                <IconButton
                                    onClick={this.handleDeleteClick}
                                    disableRipple
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
                    onError={(errorMessage) => this.setState({ error: errorMessage })}
                />

                {/* Dialog zum Bearbeiten der Person */}
                {person && (
                  <>
                    <PersonEditForm
                        show={showEditDialog}
                        onClose={this.handleEditDialogClosed}
                        person={person}
                        onError={(errorMessage) => this.setState({ error: errorMessage })}
                    />
                    <PersonDeleteDialog
                        show={showDeleteDialog}
                        onClose={this.handleDeleteDialogClosed}
                        person={person}
                        onError={(errorMessage) => this.setState({ error: errorMessage })}
                    />
                  </>
                )}
            </div>
        );
    }
}

export default ProfilView;