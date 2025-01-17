import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select,
        MenuItem, FormControl, InputLabel, Box, Chip, OutlinedInput} from '@mui/material';
import KleiderschrankAPI from '../api/KleiderschrankAPI';
import KleidungstypBO from '../api/KleidungstypBO';

class KleidungstypForm extends Component {
    constructor(props) {
        super(props);
        const { kleidungstyp, kleiderschrankId } = props;

        // Erstelle eine echte Kopie des Kleidungstyps
        let initialKleidungstyp;
        if (kleidungstyp) {
            initialKleidungstyp = new KleidungstypBO();
            initialKleidungstyp.setID(kleidungstyp.getID());
            initialKleidungstyp.setBezeichnung(kleidungstyp.getBezeichnung());
            initialKleidungstyp.setKleiderschrankId(kleiderschrankId);
            // Kopiere die Verwendungen
            kleidungstyp.getVerwendungen().forEach(style => {
                initialKleidungstyp.addVerwendung(style);
            });
        } else {
            // Erstelle einen neuen leeren Kleidungstyp
            initialKleidungstyp = new KleidungstypBO();
            initialKleidungstyp.setID(0);
            initialKleidungstyp.setBezeichnung('');
            initialKleidungstyp.setKleiderschrankId(kleiderschrankId);
        }

        this.state = {
            kleidungstyp: initialKleidungstyp,
            selectedStyleIds: kleidungstyp ? kleidungstyp.getVerwendungen().map(style => style.getID()) : [],
            allStyles: [],
            error: null
        };
    }

    componentDidMount() {
        this.loadStyles();
        if (this.props.kleidungstyp) {
            const selectedStyles = this.props.kleidungstyp.getVerwendungen();
            if (selectedStyles) {
                this.setState({
                    selectedStyleIds: selectedStyles.map(style => style.getID())
                });
            }

            // Stelle sicher, dass die kleiderschrank_id im kleidungstyp gesetzt ist
            const kleidungstyp = this.state.kleidungstyp;
            // Prüfe beide möglichen Quellen für die kleiderschrank_id
            const kleiderschrankId = this.props.kleiderschrank_id || this.props.kleidungstyp.getKleiderschrankId();
            if (kleiderschrankId) {
                kleidungstyp.setKleiderschrankId(kleiderschrankId);
                this.setState({ kleidungstyp });
                console.log("DEBUG: kleiderschrank_id gesetzt in componentDidMount:", kleiderschrankId);
            }
        }
    }

    loadStyles = async () => {
        try {
            const styles = await KleiderschrankAPI.getAPI().getStyles();
            this.setState({ allStyles: styles });
        } catch (error) {
            this.setState({ error: 'Fehler beim Laden der Styles' });
        }
    }

    handleBezeichnungChange = (event) => {
        const kleidungstyp = this.state.kleidungstyp;
        kleidungstyp.setBezeichnung(event.target.value);
        this.setState({ kleidungstyp });
    }

    handleStyleChange = (event) => {
        const selectedStyleIds = event.target.value;
        this.setState({ selectedStyleIds });

        // Aktualisiere die Verwendungen des KleidungstypBO
        const kleidungstyp = this.state.kleidungstyp;
        const selectedStyles = this.state.allStyles.filter(
            style => selectedStyleIds.includes(style.getID())
        );

        // Leere die vorhandenen Verwendungen
        while (kleidungstyp.getVerwendungen().length > 0) {
            kleidungstyp.getVerwendungen().pop();
        }

        // Füge die ausgewählten Styles hinzu
        selectedStyles.forEach(style => {
            kleidungstyp.getVerwendungen().push(style);
        });

        this.setState({ kleidungstyp });
    }

    // Wenn sich die Props ändern
    componentDidUpdate(prevProps) {
        if (this.props.kleidungstyp !== prevProps.kleidungstyp ||
            this.props.kleiderschrank_id !== prevProps.kleiderschrank_id) {
            const { kleidungstyp, kleiderschrankId } = this.props;

            if (kleidungstyp) {
                kleidungstyp.setKleiderschrankId(kleiderschrankId);
            }

            this.setState({
                kleidungstyp: kleidungstyp,
                selectedStyleIds: kleidungstyp ?
                    kleidungstyp.getVerwendungen().map(style => style.getID()) : []
            });
        }
    }

    handleSubmit = async () => {
        const { kleidungstyp } = this.state;
        try {
            console.log("Sende Update-Daten:", {
                bezeichnung: kleidungstyp.getBezeichnung(),
                verwendungen: kleidungstyp.getVerwendungen().map(style => style.getID()),
                id: kleidungstyp.getID(),
                kleiderschrank_id: this.props.kleiderschrankId
            });

            if (kleidungstyp.getID()) {
                await KleiderschrankAPI.getAPI().updateKleidungstyp({
                    id: kleidungstyp.getID(),
                    bezeichnung: kleidungstyp.getBezeichnung(),
                    verwendungen: kleidungstyp.getVerwendungen().map(style => style.getID()),
                    kleiderschrank_id: this.props.kleiderschrankId
                });
                this.props.onClose(kleidungstyp);
            }
        } catch (error) {
            console.error("Fehler beim Speichern:", error);
            this.setState({ error: error.message });
        }
    };

    render() {
        const { kleidungstyp, allStyles, selectedStyleIds, error } = this.state;
        const { show, onClose } = this.props;

        // Frühe Rückgabe wenn kein kleidungstyp vorhanden
        if (!kleidungstyp) {
            return null;
        }

        // Frühe Rückgabe wenn keine Styles geladen wurden
        if (!allStyles) {
            return null;
        }


        return (
            <Dialog open={show} onClose={() => onClose(null)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {kleidungstyp.getID() ? 'Kleidungstyp bearbeiten' : 'Neuen Kleidungstyp hinzufügen'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            autoFocus
                            label="Bezeichnung"
                            type="text"
                            fullWidth
                            value={kleidungstyp.getBezeichnung() || ''}
                            onChange={this.handleBezeichnungChange}
                        />

                        <FormControl fullWidth>
                            <InputLabel>Styles</InputLabel>
                            <Select
                                multiple
                                value={selectedStyleIds || []}
                                onChange={this.handleStyleChange}
                                input={<OutlinedInput label="Styles" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => {
                                            const style = allStyles.find(s => s.getID() === value);
                                            return (
                                                <Chip
                                                    key={value}
                                                    label={style ? style.getName() : 'Unbekannt'}
                                                />
                                            );
                                        })}
                                    </Box>
                                )}
                            >
                                {allStyles.map((style) => (
                                    <MenuItem key={style.getID()} value={style.getID()}>
                                        {style.getName()}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    {error && <Box sx={{ color: 'error.main', mt: 2 }}>{error}</Box>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => onClose(null)}>
                        Abbrechen
                    </Button>
                    <Button
                        onClick={this.handleSubmit}
                        disabled={!kleidungstyp.getBezeichnung()}
                        variant="contained"
                        color="primary"
                    >
                        Speichern
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default KleidungstypForm;