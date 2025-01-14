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
import StyleSelectionDialog from './StyleSelectionDialog';

class KleidungsstueckBasiertesOutfitDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ausgewaehlteKleidungsstuecke: [],
            passendeKleidungsstuecke: [],
            error: null,
            showStyleSelection: false,
            selectedStyle: null,
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.basisKleidungsstueck !== prevProps.basisKleidungsstueck && this.props.basisKleidungsstueck) {
            const styles = this.props.basisKleidungsstueck.getTyp()?.getVerwendungen() || [];

            if (styles.length === 1) {
                // Bei einem Style direkt laden
                this.setState({ selectedStyle: styles[0] }, () => {
                    this.loadPassendeKleidungsstuecke();
                });
            } else if (styles.length > 1) {
                // Bei mehreren Styles Dialog öffnen
                this.setState({ showStyleSelection: true });
            }
        }
    }

    loadPassendeKleidungsstuecke = async () => {
        try {
            const { basisKleidungsstueck, kleiderschrankId } = this.props;
            const { selectedStyle } = this.state;

            if (!basisKleidungsstueck || !selectedStyle || !kleiderschrankId) return;

            // mögliche Vervollständigungen
            const vervollstaendigungen = await KleiderschrankAPI.getAPI()
                .getPossibleOutfitCompletions(basisKleidungsstueck.getID(), selectedStyle.getID());

            // nach Kleiderschrank filtern
            const passendeKleidungsstuecke = vervollstaendigungen.filter(kleidungsstueck =>
                kleidungsstueck.getKleiderschrankId() === kleiderschrankId
            );

            this.setState({
                passendeKleidungsstuecke,
                error: null,
            });
        } catch (error) {
            this.setState({
                error: "Fehler beim Laden der passenden Kleidungsstücke",
                passendeKleidungsstuecke: [],
            });
        }
    };

    handleStyleDialogClose = () => {
        this.setState({
            showStyleSelection: false
        });
        // Wenn der Dialog abgebrochen wird, schließen wir auch den Haupt-Dialog
        this.handleClose();
    };

    handleStyleSelect = (style) => {
        this.setState({
            showStyleSelection: false,
            selectedStyle: style
        }, () => {
            this.loadPassendeKleidungsstuecke();
        });
    };

    handleKleidungsstueckToggle = (kleidungsstueck) => {
        const { ausgewaehlteKleidungsstuecke } = this.state;
        const currentIndex = ausgewaehlteKleidungsstuecke.findIndex(
            item => item.getID() === kleidungsstueck.getID()
        );
        const newAusgewaehlte = [...ausgewaehlteKleidungsstuecke];

        if (currentIndex === -1) {
            newAusgewaehlte.push(kleidungsstueck);
        } else {
            newAusgewaehlte.splice(currentIndex, 1);
        }

        this.setState({ ausgewaehlteKleidungsstuecke: newAusgewaehlte });
    };

    handleOutfitErstellen = async () => {
        try {
            const { basisKleidungsstueck, kleiderschrankId } = this.props;
            const { ausgewaehlteKleidungsstuecke, selectedStyle } = this.state;

            if (!selectedStyle || !kleiderschrankId) return;

            await KleiderschrankAPI.getAPI().createOutfitFromBaseItem(
                basisKleidungsstueck.getID(),
                ausgewaehlteKleidungsstuecke.map(k => k.getID()),
                selectedStyle.getID(),
                kleiderschrankId
            );

            // Dialog schließen und zur Outfits-Seite navigieren
            this.props.onClose(true);
            this.props.navigate('/outfits');

        } catch (error) {
            this.setState({
                error: "Fehler beim Erstellen des Outfits"
            });
        }
    };

    handleClose = () => {
        this.setState({
            ausgewaehlteKleidungsstuecke: [],
            selectedStyle: null
        });
        this.props.onClose();
    };

    render() {
        const { show, basisKleidungsstueck } = this.props;
        const {
            ausgewaehlteKleidungsstuecke,
            passendeKleidungsstuecke,
            showStyleSelection,
            selectedStyle,
            error
        } = this.state;

        const styles = basisKleidungsstueck?.getTyp()?.getVerwendungen() || [];

        return (
            <>
                <StyleSelectionDialog
                    open={showStyleSelection}
                    styles={styles}
                    onClose={this.handleStyleDialogClose}
                    onSelect={this.handleStyleSelect}
                />

                <Dialog
                    open={show}
                    onClose={this.handleClose}
                    maxWidth="lg"
                    fullWidth
                >
                    <DialogTitle>
                        <Typography variant="h6">
                            {selectedStyle
                                ? `Outfit im Style "${selectedStyle.getName()}" erstellen`
                                : 'Outfit erstellen'}
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        {/* Basis-Kleidungsstück Anzeige */}
                        {basisKleidungsstueck && (
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
                                    Ausgewähltes Basis-Kleidungsstück:
                                </Typography>
                                <Box sx={{ backgroundColor: 'white', p: 2, borderRadius: 1 }}>
                                    <Typography variant="h6" color="primary">
                                        {basisKleidungsstueck.getName()}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        Typ: {basisKleidungsstueck.getTyp()?.getBezeichnung() || 'Unbekannt'}
                                    </Typography>
                                </Box>
                            </Paper>
                        )}

                        {error && (
                            <Typography color="error" sx={{ mb: 2 }}>
                                {error}
                            </Typography>
                        )}

                        <Grid container spacing={2}>
                            {/* Verfügbare Kleidungsstücke */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Verfügbare Kleidungsstücke
                                </Typography>
                                <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
                                    <Grid container spacing={1}>
                                        {passendeKleidungsstuecke.map((kleidungsstueck) => (
                                            <Grid item xs={12} key={kleidungsstueck.getID()}>
                                                <Card
                                                    onClick={() => this.handleKleidungsstueckToggle(kleidungsstueck)}
                                                    sx={{
                                                        cursor: 'pointer',
                                                        backgroundColor: ausgewaehlteKleidungsstuecke.some(
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
                                                                checked={ausgewaehlteKleidungsstuecke.some(
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
                                    Ausgewählte Kleidungsstücke ({ausgewaehlteKleidungsstuecke.length})
                                </Typography>
                                <Box sx={{
                                    maxHeight: '60vh',
                                    overflow: 'auto',
                                    backgroundColor: 'grey.100',
                                    borderRadius: 1,
                                    p: 2
                                }}>
                                    {ausgewaehlteKleidungsstuecke.length === 0 ? (
                                        <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
                                            Noch keine Kleidungsstücke ausgewählt
                                        </Typography>
                                    ) : (
                                        <Grid container spacing={1}>
                                            {ausgewaehlteKleidungsstuecke.map((kleidungsstueck) => (
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
                    <DialogActions>
                        <Button onClick={this.handleClose}>
                            Abbrechen
                        </Button>
                        <Button
                            onClick={this.handleOutfitErstellen}
                            variant="contained"
                            color="primary"
                            disabled={ausgewaehlteKleidungsstuecke.length === 0}
                        >
                            Outfit erstellen ({ausgewaehlteKleidungsstuecke.length} Teile)
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

export default KleidungsstueckBasiertesOutfitDialog;