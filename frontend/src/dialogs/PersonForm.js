import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
         Typography, Box } from '@mui/material';
import KleiderschrankAPI from '../api/KleiderschrankAPI';
import PersonBO from "../api/PersonBO";
import KleiderschrankBO from "../api/KleiderschrankBO";

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
    try {
        const api = KleiderschrankAPI.getAPI();

        // Person-Daten vorbereiten
        const personBO = new PersonBO();
        personBO.setVorname(this.state.formData.vorname);
        personBO.setNachname(this.state.formData.nachname);
        personBO.setNickname(this.state.formData.nickname);
        personBO.setGoogleId(this.props.user?.uid);

        // Kleiderschrank vorbereiten
        if (this.state.formData.kleiderschrankName) {
            console.log("Erstelle Kleiderschrank mit Name:", this.state.formData.kleiderschrankName);
            const kleiderschrankBO = new KleiderschrankBO();
            kleiderschrankBO.setName(this.state.formData.kleiderschrankName);
            personBO.setKleiderschrank(kleiderschrankBO);

            // Debug-Log
            console.log("PersonBO mit Kleiderschrank:", {
                vorname: personBO.getVorname(),
                nachname: personBO.getNachname(),
                kleiderschrank: personBO.getKleiderschrank()
            });
        }

        // Person erstellen
        const createdPerson = await api.addPerson(personBO);

        // Debug-Log
        console.log("Erstellte Person:", createdPerson);
        if (createdPerson) {
            this.props.onClose(createdPerson);
        }
    } catch (error) {
        console.error('Error in handleSubmit:', error);
        this.setState({ error: error.message });
    }
    };

    render() {
        const { show, onClose } = this.props;
        const { formData, errors, touchedFields } = this.state;

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
                    <Button onClick={() => onClose(null)} >
                        Abbrechen
                    </Button>
                    <Button
                        onClick={this.handleSubmit}
                        variant="contained"
                        color="primary"
                    >
                        Profil erstellen
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default PersonForm;