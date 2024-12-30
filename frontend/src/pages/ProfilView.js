import React, { Component } from 'react';
import { Typography, Button, Box, Paper, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PersonForm from '../dialogs/PersonForm';
import PersonEditForm from '../dialogs/PersonEditForm';
import KleiderschrankAPI from '../api/KleiderschrankAPI';

class PersonView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            person: null,
            showCreateDialog: false,
            showEditDialog: false,
            error: null,
            loading: false
        };
    }

    componentDidMount() {
        this.loadPerson();
    }

    loadPerson = async () => {
        try {
            this.setState({ loading: true });
            const persons = await KleiderschrankAPI.getAPI().getPersonByGoogleId(this.props.user?.uid);
            this.setState({
                person: persons,
                loading: false
            });
        } catch (error) {
            this.setState({
                error: error.message,
                loading: false
            });
        }
    }

    handleCreateClick = () => {
        this.setState({ showCreateDialog: true });
    }

    handleEditClick = () => {
        this.setState({ showEditDialog: true });
    }

    handleCreateDialogClosed = async (newPerson) => {
        if (newPerson) {
            await this.loadPerson();
        }
        this.setState({ showCreateDialog: false });
    }

    handleEditDialogClosed = async (editedPerson) => {
        if (editedPerson) {
            await this.loadPerson();
        }
        this.setState({ showEditDialog: false });
    }

    render() {
        const { person, showCreateDialog, showEditDialog, loading } = this.state;

        if (loading) {
            return <Typography>Lade Profil...</Typography>;
        }

        return (
            <div>
                <Typography variant="h4" gutterBottom>
                    Mein Profil
                </Typography>

                {person ? (
                    // Wenn Person existiert, zeigen wir die Informationen an
                    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="start">
                            <Typography variant="h6">Persönliche Informationen</Typography>
                            <IconButton
                                onClick={this.handleEditClick}
                                color="primary"
                            >
                                <EditIcon />
                            </IconButton>
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <Typography>Vorname: {person.getVorname()}</Typography>
                            <Typography>Nachname: {person.getNachname()}</Typography>
                            <Typography>Nickname: {person.getNickname()}</Typography>
                            {person.getKleiderschrank() ? (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="subtitle1">Kleiderschrank</Typography>
                                    <Typography>
                                        Name: {person.getKleiderschrank().getName()}
                                    </Typography>
                                </Box>
                            ) : (
                                <Typography color="error">
                                    Kein Kleiderschrank zugewiesen
                                </Typography>
                            )}
                        </Box>
                    </Paper>
                ) : (
                    // Wenn keine Person existiert, zeigen wir den "Person hinzufügen" Button
                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                            Sie haben noch kein Profil angelegt
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={this.handleCreateClick}
                            sx={{ mt: 2 }}
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
                    <PersonEditForm
                        show={showEditDialog}
                        onClose={this.handleEditDialogClosed}
                        person={person}
                    />
                )}
            </div>
        );
    }
}

export default PersonView;