import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
         Typography, Box } from '@mui/material';
import KleiderschrankAPI from '../api/KleiderschrankAPI';

class PersonEditForm extends Component {
    constructor(props) {
        super(props);

        // Initialisiere State mit den bestehenden Daten
        const { person } = props;
        this.state = {
            formData: {
                vorname: person.getVorname()    || '',
                nachname: person.getNachname()  || '',
                nickname: person.getNickname()  || '',
                kleiderschrankName: person.getKleiderschrank()?.getName()   || '',
            },
            error: null,
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
        const { person } = this.props;

        person.setVorname(this.state.formData.vorname);
        person.setNachname(this.state.formData.nachname);
        person.setNickname(this.state.formData.nickname);

        if (person.getKleiderschrank()) {
            const kleiderschrank = person.getKleiderschrank();
            kleiderschrank.setName(this.state.formData.kleiderschrankName);

            // Kleiderschrank direkt aktualisieren
            await KleiderschrankAPI.getAPI().updateKleiderschrank(kleiderschrank);

            // Person mit dem aktualisierten Kleiderschrank speichern
            person.setKleiderschrank(kleiderschrank);
            await KleiderschrankAPI.getAPI().updatePerson(person);
        }

        this.props.onClose(person);
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
                    Profil bearbeiten
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
                        Speichern
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default PersonEditForm;