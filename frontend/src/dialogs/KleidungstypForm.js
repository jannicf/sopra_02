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

        // Verwendungen kopieren
        const verwendungen = kleidungstyp.getVerwendungen() || [];
        verwendungen.forEach(style => {
            initialKleidungstyp.addVerwendung(style);
        });
    } else {
        initialKleidungstyp = new KleidungstypBO();
        initialKleidungstyp.setBezeichnung('');
        initialKleidungstyp.setKleiderschrankId(kleiderschrankId);
    }

    this.state = {
        kleidungstyp: initialKleidungstyp,
        selectedStyleIds: kleidungstyp ?
            (kleidungstyp.getVerwendungen() || []).map(style => style.getID()) : [],
        allStyles: [],
        error: null
    };
}

    componentDidMount() {
        this.loadStyles();  // Styles beim ersten Laden holen
    }

    componentDidUpdate(prevProps) {
        // Prüfen ob der Dialog neu geöffnet wird
        if (this.props.show && !prevProps.show) {
            const { kleidungstyp, kleiderschrankId } = this.props;

            let updatedKleidungstyp = new KleidungstypBO();
            if (kleidungstyp) {
                // Wenn ein existierender Kleidungstyp bearbeitet wird
                updatedKleidungstyp.setID(kleidungstyp.getID());
                updatedKleidungstyp.setBezeichnung(kleidungstyp.getBezeichnung());
            } else {
                // Wenn ein neuer Kleidungstyp erstellt wird
                updatedKleidungstyp.setBezeichnung('');
            }
            updatedKleidungstyp.setKleiderschrankId(kleiderschrankId);

            const verwendungen = kleidungstyp ? (kleidungstyp.getVerwendungen() || []) : [];
            verwendungen.forEach(style => {
                updatedKleidungstyp.addVerwendung(style);
            });

            this.setState({
                kleidungstyp: updatedKleidungstyp,
                selectedStyleIds: verwendungen.map(style => style.getID())
        });
    }
}

    loadStyles = async () => {
        try {
            const api = KleiderschrankAPI.getAPI();
            const styles = await api.getStyles();
            const filteredStyles = styles.filter(style =>
                style.getKleiderschrankId() === this.props.kleiderschrankId
            );
            this.setState({ allStyles: filteredStyles });
        } catch (error) {
            console.error("Fehler beim Laden der Styles:", error);
            this.setState({ error: 'Fehler beim Laden der Styles' });
        }
    };

    handleBezeichnungChange = (event) => {
        const { kleidungstyp } = this.state;
        const updatedKleidungstyp = new KleidungstypBO();
        updatedKleidungstyp.setID(kleidungstyp.getID());
        updatedKleidungstyp.setBezeichnung(event.target.value);
        updatedKleidungstyp.setKleiderschrankId(kleidungstyp.getKleiderschrankId());

        // Verwendungen kopieren
        kleidungstyp.getVerwendungen().forEach(style => {
            updatedKleidungstyp.addVerwendung(style);
        });
        this.setState({ kleidungstyp: updatedKleidungstyp });
    };

    handleStyleChange = (event) => {
        const selectedIds = event.target.value;
        const kleidungstyp = this.state.kleidungstyp;

        // Verwendungen zurücksetzen
        kleidungstyp.verwendungen = [];

        // Neue Styles hinzufügen
        selectedIds.forEach(id => {
            const style = this.state.allStyles.find(s => s.getID() === id);
            if (style) {
                kleidungstyp.addVerwendung(style);
            }
        });

        this.setState({
            kleidungstyp,
            selectedStyleIds: selectedIds
        });
    };

 handleSubmit = async () => {
      try {
        const { kleidungstyp } = this.state;
        const { kleiderschrankId } = this.props;

        // requestData mit id + bezeichnung + verwendungen
        const requestData = {
          id: kleidungstyp.getID(),  // <-- ganz wichtig!
          bezeichnung: kleidungstyp.getBezeichnung().trim(),
          kleiderschrank_id: kleiderschrankId,
          verwendungen: this.state.selectedStyleIds  // [5,7] etc.
        };
        // POST oder PUT?
        let result = null;
        if (requestData.id) {
          // vorhandene ID => Update
          result = await KleiderschrankAPI.getAPI().updateKleidungstyp(requestData);
        } else {
          // keine ID => Neuanlegen
          result = await KleiderschrankAPI.getAPI().addKleidungstyp(requestData);
        }

        // Schließe Dialog und gebe das neue/aktualisierte Objekt weiter
        this.props.onClose(result);

      } catch (error) {
        console.error("Fehler beim Speichern:", error);
        this.setState({ error: error.message });
      }
    };

    render() {
        const { kleidungstyp, allStyles, selectedStyleIds, error, loading } = this.state;
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
                        disabled={loading || !kleidungstyp.getBezeichnung()}
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