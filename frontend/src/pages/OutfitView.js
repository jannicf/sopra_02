import React, { Component } from 'react';
import { Grid, Button, Typography, Box } from '@mui/material';
import KleiderschrankAPI from '../api/KleiderschrankAPI';
import OutfitCard from '../components/OutfitCard';
import { Link } from 'react-router-dom';

/**
 * Hauptkomponente für die Outfit-Verwaltung.
 * Zeigt verfügbare Kleidungsstücke, Erstellungsoptionen und bestehende Outfits an.
 */
class OutfitView extends Component {
    constructor(props) {
        super(props);
        // Initialisierung des States mit leeren Arrays für Outfits und Kleidungsstücke
        this.state = {
            outfits: [],           // Speichert alle erstellten Outfits
            kleidungsstuecke: [],  // Speichert alle verfügbaren Kleidungsstücke
            error: null,           // Für eventuelle Fehlermeldungen
            loading: false         // Ladezustand für API-Anfragen
        };
    }

    /**
     * Wird aufgerufen, sobald die Komponente in den DOM eingehängt wurde.
     * Lädt initial alle benötigten Daten.
     */
    componentDidMount() {
        this.loadOutfits();
        this.loadKleidungsstuecke();
    }

    /**
     * Lädt alle vorhandenen Outfits über die API
     */
    loadOutfits = async () => {
        try {
            const outfits = await KleiderschrankAPI.getAPI().getOutfits();
            this.setState({ outfits });
        } catch (error) {
            this.setState({ error: error.message });
        }
    };

    /**
     * Lädt alle verfügbaren Kleidungsstücke über die API
     */
    loadKleidungsstuecke = async () => {
        try {
            const kleidungsstuecke = await KleiderschrankAPI.getAPI().getKleidungsstuecke();
            this.setState({ kleidungsstuecke });
        } catch (error) {
            this.setState({ error: error.message });
        }
    };

    render() {
        const { outfits, kleidungsstuecke } = this.state;

        return (
            <div>
                {/* Hauptüberschrift */}
                <Typography variant="h4" gutterBottom>
                    Meine Outfits
                </Typography>

                {/* Bereich für die Anzeige der verfügbaren Kleidungsstücke */}
                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                    Verfügbare Kleidungsstücke:
                </Typography>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    {kleidungsstuecke.map((kleidungsstueck) => (
                        <Grid item xs={12} sm={6} md={4} key={kleidungsstueck.getID()}>
                            <Box p={2} border={1} borderColor="grey.300" borderRadius={1}>
                                <Typography variant="body1">
                                    {kleidungsstueck.getName()}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Typ: {kleidungsstueck.getTyp()?.getBezeichnung()}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>

                {/* Zentrale Buttons für die Outfit-Erstellung */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 2,
                        my: 4
                    }}
                >
                    {/* Button für Style-basierte Outfit-Erstellung */}
                    <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to="/outfits/create-by-style"
                        size="large"
                    >
                        Outfit nach Style erstellen
                    </Button>
                    {/* Button für Kleidungsstück-basierte Outfit-Erstellung */}
                    <Button
                        variant="contained"
                        color="secondary"
                        component={Link}
                        to="/outfits/create-by-item"
                        size="large"
                    >
                        Outfit nach einem bestimmten Kleidungsstück erstellen
                    </Button>
                </Box>

                {/* Bereich für die Anzeige der bereits erstellten Outfits */}
                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                    Meine erstellten Outfits:
                </Typography>
                <Grid container spacing={2}>
                    {outfits.map((outfit) => (
                        <Grid item xs={12} sm={6} md={4} key={outfit.getID()}>
                            {/* Verwendung der OutfitCard-Komponente für jedes Outfit */}
                            <OutfitCard
                                outfit={outfit}
                                onDelete={this.loadOutfits} // Callback für Aktualisierung nach Löschung
                            />
                        </Grid>
                    ))}
                </Grid>
            </div>
        );
    }
}

export default OutfitView;