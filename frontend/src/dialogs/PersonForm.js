import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
         Typography, Box } from '@mui/material';
import KleiderschrankAPI from '../api/KleiderschrankAPI';

class PersonForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Formularfelder für Person
            formData: {
                vorname: '',
                nachname: '',
                nickname: '',
                kleiderschrankName: '', // Direkt integriert, da jede Person einen Kleiderschrank haben muss
            },
            error: null,
            loading: false,
            touchedFields: {}
        };
    }

    // Validierung der Eingabefelder
    validateForm = () => {
        const { formData } = this.state;
        let isValid = true;
        let errors = {};

        // Pflichtfelder prüfen
        if (!formData.vorname.trim()) {
            errors.vorname = 'Vorname ist erforderlich';
            isValid = false;
        }
        if (!formData.nachname.trim()) {
            errors.nachname = 'Nachname ist erforderlich';
            isValid = false;
        }
        if (!formData.nickname.trim()) {
            errors.nickname = 'Nickname ist erforderlich';
            isValid = false;
        }
        if (!formData.kleiderschrankName.trim()) {
            errors.kleiderschrankName = 'Kleiderschrankname ist erforderlich';
            isValid = false;
        }

        this.setState({ errors });
        return isValid;
    };

    handleInputChange = (field) => (event) => {
        this.setState({
            formData: {
                ...this.state.formData,
                [field]: event.target.value
            },
            touchedFields: {
                ...this.state.touchedFields,
                [field]: true
            }
        });
    };

    handleSubmit = async () => {
    if (!this.validateForm()) {
        return;
    }

    try {
        this.setState({ loading: true });
        const api = KleiderschrankAPI.getAPI();

        console.log('Starte Person-Erstellung...');

        // 1. Person erstellen
        const personData = {
            id: 0,
            vorname: this.state.formData.vorname,
            nachname: this.state.formData.nachname,
            nickname: this.state.formData.nickname,
            google_id: this.props.user?.uid
        };

        console.log('Sende Person-Daten:', personData);
        const createdPerson = await api.addPerson(personData);
        console.log('Person erstellt:', createdPerson);

        // 2. Kleiderschrank erstellen
        if (createdPerson && createdPerson.getID()) {
            console.log('Starte Kleiderschrank-Erstellung...');
            const kleiderschrankData = {
                id: 0,
                name: this.state.formData.kleiderschrankName,
                eigentuemer_id: createdPerson.getID()
            };

            console.log('Sende Kleiderschrank-Daten:', kleiderschrankData);
            const createdKleiderschrank = await api.addKleiderschrank(kleiderschrankData);
            console.log('Kleiderschrank erstellt:', createdKleiderschrank);

            // 3. Person mit Kleiderschrank verknüpfen
            if (createdKleiderschrank) {
                createdPerson.setKleiderschrank(createdKleiderschrank);
                console.log('Aktualisiere Person mit Kleiderschrank:', createdPerson);
                await api.updatePerson(createdPerson);
                console.log('Person erfolgreich aktualisiert');
            }
        }

        this.setState({ loading: false });
        if (this.props.onClose) {
            this.props.onClose(createdPerson);
        }

    } catch (error) {
        console.error('Fehler beim Erstellen:', error);
        this.setState({
            error: 'Ein Fehler ist aufgetreten: ' + error.message,
            loading: false
        });
    }
};

    render() {
        const { show, onClose } = this.props;
        const { formData, errors, touchedFields, loading } = this.state;

        return (
            <Dialog open={show} onClose={() => onClose(null)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Profil erstellen
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Vorname"
                            value={formData.vorname}
                            onChange={this.handleInputChange('vorname')}
                            error={touchedFields.vorname && !!errors?.vorname}
                            helperText={touchedFields.vorname && errors?.vorname}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Nachname"
                            value={formData.nachname}
                            onChange={this.handleInputChange('nachname')}
                            error={touchedFields.nachname && !!errors?.nachname}
                            helperText={touchedFields.nachname && errors?.nachname}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Nickname"
                            value={formData.nickname}
                            onChange={this.handleInputChange('nickname')}
                            error={touchedFields.nickname && !!errors?.nickname}
                            helperText={touchedFields.nickname && errors?.nickname}
                            margin="normal"
                            required
                        />

                        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
                            Kleiderschrank
                        </Typography>
                        <TextField
                            fullWidth
                            label="Name des Kleiderschranks"
                            value={formData.kleiderschrankName}
                            onChange={this.handleInputChange('kleiderschrankName')}
                            error={touchedFields.kleiderschrankName && !!errors?.kleiderschrankName}
                            helperText={touchedFields.kleiderschrankName && errors?.kleiderschrankName}
                            margin="normal"
                            required
                        />

                        {this.state.error && (
                            <Typography color="error" sx={{ mt: 2 }}>
                                {this.state.error}
                            </Typography>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => onClose(null)} disabled={loading}>
                        Abbrechen
                    </Button>
                    <Button
                        onClick={this.handleSubmit}
                        variant="contained"
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? 'Wird erstellt...' : 'Profil erstellen'}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default PersonForm;