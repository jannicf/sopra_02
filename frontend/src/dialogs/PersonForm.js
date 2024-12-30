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

            // 1. Person erstellen mit Google ID aus den Firebase-Credentials
            const personData = {
                vorname: this.state.formData.vorname,
                nachname: this.state.formData.nachname,
                nickname: this.state.formData.nickname,
                google_id: this.props.user?.uid // Google ID aus Firebase
            };

            const createdPerson = await api.addPerson(personData);

            // 2. Kleiderschrank erstellen und der Person zuweisen
            const kleiderschrankData = {
                name: this.state.formData.kleiderschrankName,
                eigentuemer_id: createdPerson.getID()
            };

            const createdKleiderschrank = await api.addKleiderschrank(kleiderschrankData);

            // 3. Person aktualisieren mit dem zugewiesenen Kleiderschrank
            createdPerson.setKleiderschrank(createdKleiderschrank);
            await api.updatePerson(createdPerson);

            this.props.onClose(createdPerson);

        } catch (error) {
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