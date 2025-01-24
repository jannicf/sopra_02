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
import KleiderschrankAPI from '../api/KleiderschrankAPI';
import StyleIcon from '@mui/icons-material/Style';

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
        const { verfuegbareKleidung, ausgewaehlteKleidung, error } = this.state;

        return (
            <Dialog
                open={show}
                onClose={() => onClose(false)}
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
                    {/* Style Info */}
                    <Box sx={{ mb: 4 }}>
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
                                        {style?.getName()}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
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
                                {verfuegbareKleidung.map((kleidungsstueck) => (
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
                                            ...(ausgewaehlteKleidung.some(
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
                                                checked={ausgewaehlteKleidung.some(
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
                                Outfit-Zusammenstellung ({ausgewaehlteKleidung.length} Teile)
                            </Typography>
                            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                                <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
                                    {ausgewaehlteKleidung.length === 0 ? (
                                        <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
                                            Noch keine Kleidungsstücke ausgewählt
                                        </Typography>
                                    ) : (
                                        ausgewaehlteKleidung.map((kleidungsstueck) => (
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
                                        ))
                                    )}
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
                    <Button onClick={() => {
                        this.setState({ ausgewaehlteKleidung: [] });
                        onClose(false);
                    }}>
                        Abbrechen
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleOutfitErstellen}
                        disabled={ausgewaehlteKleidung.length === 0}
                        sx={{ px: 4 }}
                    >
                        Outfit erstellen
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default StyleBasiertesOutfitDialog;