import React, { Component } from 'react';
import { Typography, Button, Box, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton';
import PersonForm from '../dialogs/PersonForm';
import PersonEditForm from '../dialogs/PersonEditForm';
import KleiderschrankAPI from '../api/KleiderschrankAPI';
import KleiderschrankBO from "../api/KleiderschrankBO";
import PersonBO from "../api/PersonBO";

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
        this.setState({loading: true});
        console.log("ProfilView: Lade Person mit Google ID:", this.props.user?.uid);

        const persons = await KleiderschrankAPI.getAPI().getPersonByGoogleId(this.props.user?.uid);
        console.log("ProfilView: API Rohdaten:", persons);

        // Prüfe ob die Person-Daten korrekt zurückkommen
        if (persons) {
            console.log("ProfilView: Person Vorname:", persons.getVorname());
            console.log("ProfilView: Person Nachname:", persons.getNachname());
            console.log("ProfilView: Person Kleiderschrank:", persons.getKleiderschrank());
        }

        this.setState({
            person: persons,
            loading: false
        });
    } catch (error) {
        console.error("ProfilView: Fehler beim Laden der Person:", error);
        this.setState({
            error: error.message,
            loading: false
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
            await this.loadPerson();
        }
        this.setState({showEditDialog: false});
    }

    render() {
    const {person, showCreateDialog, showEditDialog, loading} = this.state;

    // Schrittweise Überprüfung
    console.log("1. Person Objekt:", {
        person: person,
        isPersonDefined: person !== null && person !== undefined
    });

    if (person) {
        console.log("2. Person Details:", {
            id: person.getID(),
            vorname: person.getVorname(),
            nachname: person.getNachname(),
            kleiderschrank: person.getKleiderschrank(),
            isKleiderschrankDefined: person.getKleiderschrank() !== null && person.getKleiderschrank() !== undefined
        });

        // Prüfen, was der Kleiderschrank tatsächlich ist
        const kleiderschrank = person.getKleiderschrank();
        console.log("3. Kleiderschrank Details:", {
            kleiderschrank: kleiderschrank,
            type: typeof kleiderschrank,
            prototyp: kleiderschrank ? Object.getPrototypeOf(kleiderschrank) : null,
            methods: kleiderschrank ? Object.getOwnPropertyNames(Object.getPrototypeOf(kleiderschrank)) : null
            });
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
                            <IconButton
                                onClick={this.handleEditClick}
                                color="primary"
                            >
                                <EditIcon/>
                            </IconButton>
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