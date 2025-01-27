import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Box } from '@mui/material';
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
            error: null
        };
    }


    handleInputChange = (field) => (event) => {
        this.setState({
            formData: {
                ...this.state.formData,
                [field]: event.target.value
            }
        });
    };

    handleSubmit = async () => {
    try {
            const api = KleiderschrankAPI.getAPI();
            const { formData } = this.state;

            // Person-Daten vorbereiten
            const personBO = new PersonBO();
            personBO.setVorname(formData.vorname);
            personBO.setNachname(formData.nachname);
            personBO.setNickname(formData.nickname);
            personBO.setGoogleId(this.props.user?.uid);

            // Kleiderschrank vorbereiten
            const kleiderschrankBO = new KleiderschrankBO();
            kleiderschrankBO.setName(formData.kleiderschrankName);
            personBO.setKleiderschrank(kleiderschrankBO);

            const createdPerson = await api.addPerson(personBO);
            this.props.onClose(createdPerson);
        } catch (error) {
            this.setState({ error: error.message });
        }
    };


    render() {
        const { show, onClose } = this.props;
        const { formData, error } = this.state;

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
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Nachname"
                            value={formData.nachname}
                            onChange={this.handleInputChange('nachname')}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Nickname"
                            value={formData.nickname}
                            onChange={this.handleInputChange('nickname')}
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
                            margin="normal"
                            required
                        />

                        {error && (
                            <Typography color="error" sx={{ mt: 2 }}>
                                {error}
                            </Typography>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => onClose(null)}>
                        Abbrechen
                    </Button>
                    <Button
                        onClick={this.handleSubmit}
                        variant="contained"
                        color="primary"
                        disabled={!formData.vorname || !formData.nachname ||
                                !formData.nickname || !formData.kleiderschrankName}
                    >
                        Profil erstellen
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default PersonForm;