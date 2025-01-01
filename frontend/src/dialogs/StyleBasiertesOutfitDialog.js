import React, { Component } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import KleiderschrankAPI from '../api/KleiderschrankAPI';

/**
 * Dialog-Komponente für die Erstellung eines Outfits basierend auf einem Style.
 * Ermöglicht die Auswahl passender Kleidungsstücke und verwaltet die
 * Outfit-Erstellung.
 */
class StyleBasiertesOutfitDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            moeglicheKleidung: [],        // Verfügbare Kleidungsstücke für den Style
            ausgewaehlteKleidung: [],     // Ausgewählte Kleidungsstücke
            loading: false,                // Ladezustand für API-Anfragen
            error: null                    // Für eventuelle Fehlermeldungen
        };
    }

    /**
     * Lädt passende Kleidungsstücke wenn sich der Style ändert
     */
    componentDidUpdate(prevProps) {
        if (this.props.style && (!prevProps.style || prevProps.style.getID() !== this.props.style.getID())) {
            this.loadPassendeKleidung();
        }
    }

    /**
     * Lädt alle zum Style passenden Kleidungsstücke
     */
    loadPassendeKleidung = async () => {
        try {
            this.setState({ loading: true });
            const api = KleiderschrankAPI.getAPI();
            const kleidung = await api.getPossibleOutfitsForStyle(this.props.style.getID());
            this.setState({
                moeglicheKleidung: kleidung,
                error: null,
                loading: false
            });
        } catch (error) {
            this.setState({
                error: 'Fehler beim Laden der Kleidungsstücke: ' + error.message,
                loading: false
            });
        }
    };

    /**
     * Verwaltet die Auswahl/Abwahl von Kleidungsstücken
     */
    handleKleidungToggle = (kleidungsstueck) => {
        this.setState(prevState => {
            const isSelected = prevState.ausgewaehlteKleidung
                .some(item => item.getID() === kleidungsstueck.getID());

            if (isSelected) {
                // Kleidungsstück entfernen
                return {
                    ausgewaehlteKleidung: prevState.ausgewaehlteKleidung
                        .filter(item => item.getID() !== kleidungsstueck.getID())
                };
            } else {
                // Kleidungsstück hinzufügen
                return {
                    ausgewaehlteKleidung: [...prevState.ausgewaehlteKleidung, kleidungsstueck]
                };
            }
        });
    };

    /**
     * Erstellt ein neues Outfit mit den ausgewählten Kleidungsstücken
     */
    handleOutfitErstellen = async () => {
        try {
            this.setState({ loading: true });
            const api = KleiderschrankAPI.getAPI();

            await api.addOutfit({
                style_id: this.props.style.getID(),
                bausteine: this.state.ausgewaehlteKleidung.map(k => k.getID())
            });

            // Dialog mit Erfolg schließen
            this.props.onClose(true);
        } catch (error) {
            this.setState({
                error: 'Fehler beim Erstellen des Outfits: ' + error.message,
                loading: false
            });
        }
    };

    /**
     * Setzt den State zurück und schließt den Dialog
     */
    handleClose = () => {
        this.setState({
            moeglicheKleidung: [],
            ausgewaehlteKleidung: [],
            error: null
        });
        this.props.onClose(false);
    };

    render() {
        const { show, style } = this.props;
        const { moeglicheKleidung, ausgewaehlteKleidung, loading, error } = this.state;

        return (
            <Dialog
                open={show}
                onClose={this.handleClose}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Outfit für Style "{style?.getName()}" erstellen
                </DialogTitle>

                <DialogContent>
                    {loading ? (
                        <Typography>Lade Kleidungsstücke...</Typography>
                    ) : error ? (
                        <Typography color="error">{error}</Typography>
                    ) : (
                        <>
                            <Typography variant="subtitle1" gutterBottom>
                                Wählen Sie passende Kleidungsstücke aus:
                            </Typography>

                            <Box sx={{ mt: 2 }}>
                                {moeglicheKleidung.map((kleidung) => (
                                    <FormControlLabel
                                        key={kleidung.getID()}
                                        control={
                                            <Checkbox
                                                checked={ausgewaehlteKleidung
                                                    .some(item => item.getID() === kleidung.getID())}
                                                onChange={() => this.handleKleidungToggle(kleidung)}
                                            />
                                        }
                                        label={
                                            <Box>
                                                <Typography>{kleidung.getName()}</Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {kleidung.getTyp()?.getBezeichnung()}
                                                </Typography>
                                            </Box>
                                        }
                                        sx={{ display: 'block', mb: 1 }}
                                    />
                                ))}
                            </Box>
                        </>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={this.handleClose}>
                        Abbrechen
                    </Button>
                    <Button
                        onClick={this.handleOutfitErstellen}
                        variant="contained"
                        color="primary"
                        disabled={ausgewaehlteKleidung.length === 0 || loading}
                    >
                        Outfit erstellen
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default StyleBasiertesOutfitDialog;