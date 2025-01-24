import React, { Component } from 'react';
import { Grid, Typography, Box, Card, CardContent } from '@mui/material';
import KleiderschrankAPI from '../api/KleiderschrankAPI';
import StyleBasiertesOutfitDialog from '../dialogs/StyleBasiertesOutfitDialog';
import { Link } from 'react-router-dom';

/**
 * Komponente zur Erstellung von Outfits basierend auf Styles.
 * Diese Komponente zeigt eine Liste verfügbarer Styles an und ermöglicht
 * die Auswahl eines Styles zur Outfit-Erstellung.
 */
class StyleBasiertesOutfitView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            styles: [],                    // Liste aller verfügbaren Styles
            selectedStyle: null,           // Aktuell ausgewählter Style
            showDialog: false,             // Steuert die Anzeige des Dialogs
            error: null,                    // Für eventuelle Fehlermeldungen
            kleiderschrankId: null
        };
    }

    /**
     * Lädt die verfügbaren Styles beim Mounten der Komponente
     */
    componentDidMount() {
       if (this.props.user && this.props.user.uid) {
            KleiderschrankAPI.getAPI().getPersonByGoogleId(this.props.user.uid)
                .then(person => {
                    if (person && person.getKleiderschrank()) {
                        this.setState({
                            kleiderschrankId: person.getKleiderschrank().getID()
                        }, () => {
                            this.loadStyles();
                        });
                    }
                });
        }
    }

    /**
     * Lädt alle verfügbaren Styles über die API
     */
    loadStyles = async () => {
        try {
            const api = KleiderschrankAPI.getAPI();

            // Nur Styles des eignenen Kleiderschranks laden
            if (this.state.kleiderschrankId) {
                const allStyles = await api.getStyles();
                const filteredStyles = allStyles.filter(style =>
                    style.getKleiderschrankId() === this.state.kleiderschrankId
                );

                this.setState({
                    styles: filteredStyles,
                    error: null,
                });
            }
        } catch (error) {
            this.setState({
                error: 'Fehler beim Laden der Styles: ' + error.message,
            });
        }
    };

    /**
     * Handler für die Auswahl eines Styles
     */
    handleStyleClick = (style) => {
        this.setState({
            selectedStyle: style,
            showDialog: true
        });
    };

    /**
     * Handler für das Schließen des Dialogs
     */
    handleDialogClose = (success) => {
        if (success) {
            // Wenn das Outfit erfolgreich erstellt wurde
            this.setState({
                showDialog: false,
                selectedStyle: null
            }, () => {
                // Exakt die gleiche Navigation wie bei KleidungsstueckBasiertesOutfit
                document.getElementById('outfitsLink').click();
            });
        } else {
            this.setState({
                showDialog: false,
                selectedStyle: null
            });
        }
    };

    render() {
        const { styles, selectedStyle, showDialog, loading, error } = this.state;

        if (loading) {
            return <Typography>Lädt...</Typography>;
        }

        if (error) {
            return <Typography color="error">{error}</Typography>;
        }

        return (
            <Box sx={{ padding: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Wähle einen Style
                </Typography>

                <Grid container spacing={2}>
                    {styles.map((style) => (
                        <Grid item xs={12} sm={6} md={4} key={style.getID()}>
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
                                onClick={() => this.handleStyleClick(style)}
                            >
                                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Box>
                                            <Typography variant="h6">
                                                {style.getName()}
                                            </Typography>
                                            <Typography color="textSecondary">
                                                Features: {style.getFeatures().length}
                                            </Typography>
                                            <Typography color="textSecondary">
                                                Constraints: {
                                                    (style.getConstraints().kardinalitaeten?.length || 0) +
                                                    (style.getConstraints().mutexe?.length || 0) +
                                                    (style.getConstraints().implikationen?.length || 0)
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

                {/* Dialog für die Outfit-Erstellung */}
                <StyleBasiertesOutfitDialog
                    show={showDialog}
                    style={selectedStyle}
                    kleiderschrankId={this.state.kleiderschrankId}
                    onClose={this.handleDialogClose}
                />
            </Box>
        );
    }
}

export default StyleBasiertesOutfitView;