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
    Paper,
    Alert,
    AlertTitle
} from '@mui/material';
import StyleSelectionDialog from './StyleSelectionDialog';
import KleiderschrankAPI from '../api/KleiderschrankAPI';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import StyleIcon from '@mui/icons-material/Style';

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
                error: 'Das Outfit erfüllt nicht die Style-Constraints'
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
                    <DialogTitle sx={{
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        pb: 2,
                        background: 'linear-gradient(to right, #f5f5f5, #ffffff)'
                    }}>
                        <Typography variant="h5" sx={{ fontWeight: 500 }}>
                            Outfit erstellen
                        </Typography>
                    </DialogTitle>

                    <DialogContent sx={{ pt: 3 }}>
                        {error && (
                            <Alert
                                severity="warning"
                                sx={{ mb: 3 }}
                                action={
                                    <Button color="inherit" size="small" onClick={() => this.setState({error: null})}>
                                        VERSTANDEN
                                    </Button>
                                }
                            >
                                <AlertTitle>Outfit kann nicht erstellt werden</AlertTitle>
                                {error}
                            </Alert>
                        )}
                        {/* Info Bereich */}
                        <Box sx={{ mb: 4 }}>
                            {/* Basis-Kleidungsstück Info */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2.5,
                                    mb: 2,
                                    background: 'linear-gradient(145deg, #e3f2fd 0%, #f5f5f5 100%)',
                                    border: '1px solid',
                                    borderColor: 'primary.light',
                                    borderRadius: 2
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <CheckCircleOutlineIcon color="primary" sx={{ fontSize: 28 }} />
                                    <Box>
                                        <Typography variant="overline" color="primary.main" sx={{ fontWeight: 500 }}>
                                            Basis-Kleidungsstück
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 500 }}>
                                            {basisKleidungsstueck?.getName()}
                                        </Typography>
                                        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                                            {basisKleidungsstueck?.getTyp()?.getBezeichnung()}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>

                            {/* Style Info */}
                            {selectedStyle && (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2.5,
                                        background: 'linear-gradient(145deg, #f3e5f5 0%, #f5f5f5 100%)',
                                        border: '1px solid',
                                        borderColor: 'secondary.light',
                                        borderRadius: 2
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <StyleIcon color="secondary" sx={{ fontSize: 28 }} />
                                        <Box>
                                            <Typography variant="overline" color="secondary.main" sx={{ fontWeight: 500 }}>
                                                Ausgewählter Style
                                            </Typography>
                                            <Typography variant="h6" sx={{ fontWeight: 500 }}>
                                                {selectedStyle.getName()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            )}
                        </Box>

                        <Grid container spacing={3}>
                            {/* Verfügbare Kleidungsstücke */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom sx={{
                                    pl: 1,
                                    borderLeft: 3,
                                    borderColor: 'primary.main',
                                    fontWeight: 500
                                }}>
                                    Verfügbare Kleidungsstücke
                                </Typography>
                                <Box sx={{ maxHeight: '400px', overflow: 'auto', pr: 1 }}>
                                    {passendeKleidungsstuecke.map((kleidungsstueck) => (
                                        <Card
                                            key={kleidungsstueck.getID()}
                                            sx={{
                                                mb: 1,
                                                cursor: 'pointer',
                                                transition: 'transform 0.2s, box-shadow 0.2s',
                                                '&:hover': {
                                                    transform: 'translateX(4px)',
                                                    boxShadow: 2
                                                },
                                                ...(ausgewaehlteKleidungsstuecke.some(
                                                    item => item.getID() === kleidungsstueck.getID()
                                                ) && {
                                                    borderLeft: '3px solid',
                                                    borderColor: 'primary.main'
                                                })
                                            }}
                                            onClick={() => this.handleKleidungsstueckToggle(kleidungsstueck)}
                                        >
                                            <CardContent sx={{
                                                py: '12px !important',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}>
                                                <Checkbox
                                                    checked={ausgewaehlteKleidungsstuecke.some(
                                                        item => item.getID() === kleidungsstueck.getID()
                                                    )}
                                                    sx={{ mr: 1 }}
                                                />
                                                <Box>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                                        {kleidungsstueck.getName()}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {kleidungsstueck.getTyp()?.getBezeichnung()}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Box>
                            </Grid>

                            {/* Ausgewählte Kleidungsstücke */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom sx={{
                                    pl: 1,
                                    borderLeft: 3,
                                    borderColor: 'secondary.main',
                                    fontWeight: 500
                                }}>
                                    Outfit-Zusammenstellung ({ausgewaehlteKleidungsstuecke.length + 1} Teile)
                                </Typography>
                                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                                    <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
                                        {/* Basis-Kleidungsstück */}
                                        <Card sx={{
                                            mb: 1,
                                            bgcolor: '#f8f9fa',
                                            border: '1px solid',
                                            borderColor: 'primary.light'
                                        }}>
                                            <CardContent sx={{
                                                py: '12px !important',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between'
                                            }}>
                                                <Box>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                                        {basisKleidungsstueck?.getName()}
                                                    </Typography>
                                                    <Typography variant="body2" color="primary.main">
                                                        Basis-Element
                                                    </Typography>
                                                </Box>
                                                <LockIcon color="action" />
                                            </CardContent>
                                        </Card>

                                        {ausgewaehlteKleidungsstuecke.map((kleidungsstueck) => (
                                            <Card
                                                key={kleidungsstueck.getID()}
                                                sx={{
                                                    mb: 1,
                                                    bgcolor: 'background.paper'
                                                }}
                                            >
                                                <CardContent sx={{
                                                    py: '12px !important',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    <Box>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                                            {kleidungsstueck.getName()}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {kleidungsstueck.getTyp()?.getBezeichnung()}
                                                        </Typography>
                                                    </Box>
                                                    <Button
                                                        color="error"
                                                        size="small"
                                                        onClick={() => this.handleKleidungsstueckToggle(kleidungsstueck)}
                                                    >
                                                        Entfernen
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </DialogContent>

                    <DialogActions sx={{
                        px: 3,
                        py: 2,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        background: 'linear-gradient(to right, #f5f5f5, #ffffff)'
                    }}>
                        <Button onClick={this.handleClose}>
                            Abbrechen
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.handleOutfitErstellen}
                            disabled={ausgewaehlteKleidungsstuecke.length === 0}
                            sx={{ px: 4 }}
                        >
                            Outfit erstellen
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

export default KleidungsstueckBasiertesOutfitDialog;