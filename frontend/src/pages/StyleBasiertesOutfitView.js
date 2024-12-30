import React, { Component } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import KleiderschrankAPI from '../api/KleiderschrankAPI';
import StyleBasiertesOutfitDialog from '../dialogs/StyleBasiertesOutfitDialog';

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
            loading: false,                // Ladezustand für API-Anfragen
            error: null                    // Für eventuelle Fehlermeldungen
        };
    }

    /**
     * Lädt die verfügbaren Styles beim Mounten der Komponente
     */
    componentDidMount() {
        this.loadStyles();
    }

    /**
     * Lädt alle verfügbaren Styles über die API
     */
    loadStyles = async () => {
        try {
            this.setState({ loading: true });
            const api = KleiderschrankAPI.getAPI();
            const styles = await api.getStyles();
            this.setState({
                styles: styles,
                error: null,
                loading: false
            });
        } catch (error) {
            this.setState({
                error: 'Fehler beim Laden der Styles: ' + error.message,
                loading: false
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
    handleDialogClose = (outfitCreated = false) => {
        this.setState({
            showDialog: false,
            selectedStyle: null
        });

        // Wenn ein Outfit erstellt wurde, laden wir die Styles neu
        if (outfitCreated) {
            this.loadStyles();
        }
    };

    render() {
        const { styles, selectedStyle, showDialog, loading, error } = this.state;

        if (loading) {
            return <Typography>Lade Styles...</Typography>;
        }

        if (error) {
            return <Typography color="error">{error}</Typography>;
        }

        return (
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Outfit nach Style erstellen
                </Typography>

                {/* Anzeige der verfügbaren Styles als Karten */}
                <Box sx={{ mt: 3 }}>
                    {styles.map((style) => (
                        <Card
                            key={style.getID()}
                            onClick={() => this.handleStyleClick(style)}
                            sx={{
                                mb: 2,
                                cursor: 'pointer',
                                '&:hover': {
                                    boxShadow: 3,
                                    transform: 'scale(1.01)',
                                    transition: 'all 0.2s'
                                }
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6">
                                    {style.getName()}
                                </Typography>
                                <Typography color="textSecondary">
                                    {style.getFeatures().length} Kleidungstypen
                                </Typography>
                                <Typography variant="body2">
                                    {style.getConstraints().length} Constraints
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                {/* Dialog für die Outfit-Erstellung */}
                <StyleBasiertesOutfitDialog
                    show={showDialog}
                    style={selectedStyle}
                    onClose={this.handleDialogClose}
                />
            </Box>
        );
    }
}

export default StyleBasiertesOutfitView;
