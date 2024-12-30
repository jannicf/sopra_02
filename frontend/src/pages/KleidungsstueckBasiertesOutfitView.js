import React, { Component } from 'react';
import {
    Grid,
    Typography,
    Box,
    Card,
    CardContent,
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
            loading: false,
            error: null
        };
    }

    componentDidMount() {
        this.loadKleidungsstuecke();
    }

    loadKleidungsstuecke = async () => {
        try {
            this.setState({ loading: true });
            const kleidungsstuecke = await KleiderschrankAPI.getAPI().getKleidungsstuecke();
            this.setState({
                kleidungsstuecke: kleidungsstuecke || [],
                loading: false
            });
        } catch (error) {
            console.error('Fehler beim Laden der Kleidungsstücke:', error);
            this.setState({
                error: "Fehler beim Laden der Kleidungsstücke",
                loading: false
            });
        }
    };

    handleBasisKleidungsstueckAuswahl = (kleidungsstueck) => {
        this.setState({
            ausgewaehltesBasisKleidungsstueck: kleidungsstueck,
            dialogOpen: true
        });
    };

    handleDialogClose = () => {
        this.setState({
            dialogOpen: false,
            ausgewaehltesBasisKleidungsstueck: null
        });
    };

    render() {
        const {
            kleidungsstuecke,
            dialogOpen,
            ausgewaehltesBasisKleidungsstueck,
            loading,
            error
        } = this.state;

        if (loading) {
            return <Typography>Lädt...</Typography>;
        }

        if (error) {
            return <Typography color="error">{error}</Typography>;
        }

        return (
            <Box sx={{ padding: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Wähle ein Basis-Kleidungsstück
                </Typography>

                <Grid container spacing={2}>
                    {kleidungsstuecke.map((kleidungsstueck) => (
                        <Grid item xs={12} sm={6} md={4} key={kleidungsstueck.getID()}>
                            <Card
                                onClick={() => this.handleBasisKleidungsstueckAuswahl(kleidungsstueck)}
                                sx={{
                                    cursor: 'pointer',
                                    '&:hover': {
                                        boxShadow: 3,
                                        transform: 'scale(1.02)',
                                        transition: 'all 0.2s ease-in-out'
                                    }
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h6">
                                        {kleidungsstueck.getName()}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        Typ: {kleidungsstueck.getTyp()?.getBezeichnung() || 'Unbekannt'}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        Style: {kleidungsstueck.getTyp()?.getVerwendungen()?.map(style => style.getName()).join(', ') || 'Kein Style'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <KleidungsstueckBasiertesOutfitDialog
                    show={dialogOpen}
                    basisKleidungsstueck={ausgewaehltesBasisKleidungsstueck}
                    onClose={this.handleDialogClose}
                    kleidungsstuecke={kleidungsstuecke}
                />
            </Box>
        );
    }
}

export default KleidungsstueckBasiertesOutfitView;