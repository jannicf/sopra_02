import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select,
        MenuItem, FormControl, InputLabel, Box, Chip, OutlinedInput} from '@mui/material';
import KleiderschrankAPI from '../api/KleiderschrankAPI';
import KleidungstypBO from '../api/KleidungstypBO';

class KleidungstypForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            kleidungstyp: props.kleidungstyp ? props.kleidungstyp : new KleidungstypBO(),
            allStyles: [],
            selectedStyleIds: [],
            error: null,
            loading: false
        };
    }

    componentDidMount() {
        this.loadStyles();
        // Wenn ein Kleidungstyp zum Bearbeiten übergeben wurde, lade dessen Styles
        if (this.props.kleidungstyp) {
            const selectedStyles = this.props.kleidungstyp.getVerwendungen();
            if (selectedStyles) {
                this.setState({
                    selectedStyleIds: selectedStyles.map(style => style.getID())
                });
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

    handleSubmit = async () => {
        const { kleidungstyp, selectedStyleIds } = this.state;
        const { kleiderschrankId } = this.props;
        try {
            this.setState({ loading: true });

            // einfaches Objekt für den API-Request
            const kleidungstypData = {
                bezeichnung: kleidungstyp.getBezeichnung(),
                verwendungen: selectedStyleIds,
                id: kleidungstyp.getID() || 0,
                kleiderschrank_id: kleiderschrankId
            };

            let savedKleidungstyp;
            if (kleidungstyp.getID()) {
                savedKleidungstyp = await KleiderschrankAPI.getAPI().updateKleidungstyp(kleidungstypData);
            } else {
                savedKleidungstyp = await KleiderschrankAPI.getAPI().addKleidungstyp(kleidungstypData);
            }

            this.props.onClose(savedKleidungstyp);
        } catch (error) {
            this.setState({
                error: 'Fehler beim Speichern des Kleidungstyps',
                loading: false
            });
        }
    }

    render() {
        const { kleidungstyp, allStyles, selectedStyleIds, error, loading } = this.state;
        const { show, onClose } = this.props;

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
                                value={selectedStyleIds}
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