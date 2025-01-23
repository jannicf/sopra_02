import React, { Component } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Grid,
    Box,
    Card,
    CardContent,
    Checkbox,
    Paper
} from '@mui/material';
import KleiderschrankAPI from '../api/KleiderschrankAPI';

class StyleBasiertesOutfitDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            verfuegbareKleidung: [],
            ausgewaehlteKleidung: [],
            loading: false,
            error: null
        };
    }

    componentDidMount() {
        if (this.props.style) {
            this.loadPassendeKleidung();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.style?.getID() !== prevProps.style?.getID()) {
            this.loadPassendeKleidung();
        }
    }

    // In der loadPassendeKleidung Methode:
    loadPassendeKleidung = async () => {
        try {
            this.setState({ loading: true });
            const api = KleiderschrankAPI.getAPI();

            // Hole alle Kleidungstücke
            const alleKleidungsstuecke = await api.getKleidungsstuecke();

            // Filtere nach Kleiderschrank ID und Style-Typen
            const styleTypes = this.props.style.getFeatures();
            const passendeKleidung = alleKleidungsstuecke.filter(kleidungsstueck =>
                kleidungsstueck.getKleiderschrankId() === this.props.kleiderschrankId && // Prüfe Kleiderschrank ID
                styleTypes.some(styleType =>
                    styleType.getID() === kleidungsstueck.getTyp().getID()
                )
            );

            this.setState({
                verfuegbareKleidung: passendeKleidung,
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

    handleKleidungsstueckToggle = (kleidungsstueck) => {
        this.setState(prevState => {
            const isSelected = prevState.ausgewaehlteKleidung
                .some(item => item.getID() === kleidungsstueck.getID());

            if (isSelected) {
                return {
                    ausgewaehlteKleidung: prevState.ausgewaehlteKleidung
                        .filter(item => item.getID() !== kleidungsstueck.getID())
                };
            } else {
                return {
                    ausgewaehlteKleidung: [...prevState.ausgewaehlteKleidung, kleidungsstueck]
                };
            }
        });
    };

    handleOutfitErstellen = async () => {
    try {
        const api = KleiderschrankAPI.getAPI();

        if (this.state.ausgewaehlteKleidung.length === 0) {
            this.setState({
                error: 'Bitte wählen Sie mindestens ein Kleidungsstück aus.'
            });
            return;
        }

        const response = await api.addOutfit({
            style_id: this.props.style.getID(),
            bausteine: this.state.ausgewaehlteKleidung.map(k => k.getID()),
            kleiderschrank_id: this.props.kleiderschrankId
        });

        // Bei Erfolg Dialog schließen und zur Outfits-Seite navigieren
        this.props.onClose(true);

    } catch (error) {
        // Angepasste Fehlermeldung
        let errorMessage = 'Das Outfit erfüllt nicht die Style-Constraints';
        if (error.response) {
            errorMessage = error.response.data?.message || errorMessage;
        }

        this.setState({
            error: errorMessage,
            loading: false
        });
    }
};

    render() {
        const { show, style, onClose } = this.props;
        const { verfuegbareKleidung, ausgewaehlteKleidung, loading, error } = this.state;

        return (
            <Dialog
                open={show}
                onClose={() => onClose(false)}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle>
                    Wähle passende Kleidungsstücke aus
                </DialogTitle>

                <DialogContent>
                    {/* Style Info */}
                    {style && (
                        <Paper
                            elevation={3}
                            sx={{
                                p: 2,
                                mb: 3,
                                backgroundColor: 'primary.light',
                                color: 'primary.contrastText'
                            }}
                        >
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Ausgewählter Style:
                            </Typography>
                            <Box sx={{ backgroundColor: 'white', p: 2, borderRadius: 1 }}>
                                <Typography variant="h6" color="primary">
                                    {style.getName()}
                                </Typography>
                                <Typography color="textSecondary">
                                    Enthaltene Kleidungstypen: {style.getFeatures().map(f => f.getBezeichnung()).join(', ')}
                                </Typography>
                            </Box>
                        </Paper>
                    )}

                    <Grid container spacing={2}>
                        {/* Verfügbare Kleidungsstücke */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Verfügbare Kleidungsstücke
                            </Typography>
                            <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
                                <Grid container spacing={1}>
                                    {verfuegbareKleidung.map((kleidungsstueck) => (
                                        <Grid item xs={12} key={kleidungsstueck.getID()}>
                                            <Card
                                                onClick={() => this.handleKleidungsstueckToggle(kleidungsstueck)}
                                                sx={{
                                                    cursor: 'pointer',
                                                    backgroundColor: ausgewaehlteKleidung.some(
                                                        item => item.getID() === kleidungsstueck.getID()
                                                    ) ? 'action.selected' : 'background.paper',
                                                    '&:hover': {
                                                        boxShadow: 2,
                                                        transform: 'scale(1.01)',
                                                        transition: 'all 0.2s'
                                                    }
                                                }}
                                            >
                                                <CardContent>
                                                    <Box display="flex" alignItems="center">
                                                        <Checkbox
                                                            checked={ausgewaehlteKleidung.some(
                                                                item => item.getID() === kleidungsstueck.getID()
                                                            )}
                                                        />
                                                        <Box>
                                                            <Typography variant="h6">
                                                                {kleidungsstueck.getName()}
                                                            </Typography>
                                                            <Typography color="textSecondary">
                                                                Typ: {kleidungsstueck.getTyp()?.getBezeichnung() || 'Unbekannt'}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </Grid>

                        {/* Ausgewählte Kleidungsstücke */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Ausgewählte Kleidungsstücke ({ausgewaehlteKleidung.length})
                            </Typography>
                            <Box sx={{
                                maxHeight: '60vh',
                                overflow: 'auto',
                                backgroundColor: 'grey.100',
                                borderRadius: 1,
                                p: 2
                            }}>
                                {ausgewaehlteKleidung.length === 0 ? (
                                    <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
                                        Noch keine Kleidungsstücke ausgewählt
                                    </Typography>
                                ) : (
                                    <Grid container spacing={1}>
                                        {ausgewaehlteKleidung.map((kleidungsstueck) => (
                                            <Grid item xs={12} key={kleidungsstueck.getID()}>
                                                <Card>
                                                    <CardContent>
                                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                                            <Box>
                                                                <Typography variant="h6">
                                                                    {kleidungsstueck.getName()}
                                                                </Typography>
                                                                <Typography color="textSecondary">
                                                                    Typ: {kleidungsstueck.getTyp()?.getBezeichnung() || 'Unbekannt'}
                                                                </Typography>
                                                            </Box>
                                                            <Button
                                                                color="error"
                                                                onClick={() => this.handleKleidungsstueckToggle(kleidungsstueck)}
                                                            >
                                                                Entfernen
                                                            </Button>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>

                {error && (
                    <Box sx={{ px: 3, pb: 2 }}>
                        <Typography color="error">
                            {error}
                        </Typography>
                    </Box>
                )}

                <DialogActions>
                    <Button onClick={() => onClose(false)}>
                        Abbrechen
                    </Button>
                    <Button
                        onClick={this.handleOutfitErstellen}
                        variant="contained"
                        color="primary"
                        disabled={ausgewaehlteKleidung.length === 0}
                    >
                        Outfit erstellen ({ausgewaehlteKleidung.length} Teile)
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default StyleBasiertesOutfitDialog;