import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
    Grid,
    Typography,
    Box,
    Card,
    CardContent,
    Alert,
} from '@mui/material';
import KleiderschrankAPI from '../api/KleiderschrankAPI';
import KleidungsstueckBasiertesOutfitDialog from '../dialogs/KleidungsstueckBasiertesOutfitDialog';


class KleidungsstueckBasiertesOutfitView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            kleidungsstuecke: [],
            ausgewaehltesBasisKleidungsstueck: null,
            dialogOpen: false,
            error: null,
            kleiderschrankId: null,
        };
    }

    componentDidMount() {
        if (this.props.user && this.props.user.uid) {
            KleiderschrankAPI.getAPI().getPersonByGoogleId(this.props.user.uid)
                .then(person => {
                    if (person && person.getKleiderschrank()) {
                        this.setState({
                            kleiderschrankId: person.getKleiderschrank().getID()
                        }, () => {
                            this.loadKleidungsstuecke();
                        });
                    }
                });
        }
    }

    loadKleidungsstuecke = async () => {
        try {

            if (this.state.kleiderschrankId) {
                const kleidungsstuecke = await KleiderschrankAPI.getAPI()
                    .getKleidungsstueckByKleiderschrankId(this.state.kleiderschrankId);

                const kleidungsstueckeMitStyles = kleidungsstuecke.filter(
                    ks => ks.getTyp()?.getVerwendungen()?.length > 0
                );

                this.setState({
                    kleidungsstuecke: kleidungsstueckeMitStyles || [],
                });
            }
        } catch (error) {
            this.setState({
                error: "Fehler beim Laden der Kleidungsstücke",
            });
        }
    };

    handleBasisKleidungsstueckAuswahl = (kleidungsstueck) => {
        // Prüfen ob das Kleidungsstück überhaupt Styles hat
        const styles = kleidungsstueck.getTyp()?.getVerwendungen() || [];
        if (styles.length === 0) {
            this.setState({
                error: "Dieses Kleidungsstück hat keine Styles zugewiesen und kann nicht als Basis verwendet werden."
            });
            return;
        }

        this.setState({
            ausgewaehltesBasisKleidungsstueck: kleidungsstueck,
            dialogOpen: true,
            error: null
        });
    };

    handleDialogClose = (success) => {
    if (success) {
        // Wenn das Outfit erfolgreich erstellt wurde
        this.setState({
            dialogOpen: false,
            ausgewaehltesBasisKleidungsstueck: null
        }, () => {
            document.getElementById('outfitsLink').click();
        });
    } else {
        this.setState({
            dialogOpen: false,
            ausgewaehltesBasisKleidungsstueck: null
        });
    }
};

    render() {
        const {
            kleidungsstuecke,
            dialogOpen,
            ausgewaehltesBasisKleidungsstueck,
            error
        } = this.state;
        return (
            <Box sx={{ padding: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Wähle ein Basis-Kleidungsstück
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Grid container spacing={2}>
                    {kleidungsstuecke.map((kleidungsstueck) => (
                        <Grid item xs={12} sm={6} md={4} key={kleidungsstueck.getID()}>
                            <Card
                                sx={{
                                    p: 2,
                                    cursor: 'pointer',
                                    borderRadius: 2,
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        transition: 'all 0.2s'
                                    }
                                }}
                                onClick={() => this.handleBasisKleidungsstueckAuswahl(kleidungsstueck)}
                            >
                                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Box>
                                            <Typography variant="h6">
                                                {kleidungsstueck.getName()}
                                            </Typography>
                                            <Typography color="textSecondary">
                                                Typ: {kleidungsstueck.getTyp()?.getBezeichnung() || 'Unbekannt'}
                                            </Typography>
                                            <Typography color="textSecondary">
                                                Styles: {
                                                    kleidungsstueck.getTyp()?.getVerwendungen()?.length || 0
                                                }
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Link
                to="/outfits"
                id="outfitsLink"
                style={{display: 'none'}}
                />

                <KleidungsstueckBasiertesOutfitDialog
                    show={dialogOpen}
                    basisKleidungsstueck={ausgewaehltesBasisKleidungsstueck}
                    kleiderschrankId={this.state.kleiderschrankId}
                    onClose={this.handleDialogClose}
                />
            </Box>
        );
    }
}

export default KleidungsstueckBasiertesOutfitView;