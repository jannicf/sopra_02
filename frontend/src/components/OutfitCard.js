import React, { Component } from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import KleiderschrankAPI from '../api/KleiderschrankAPI';

/**
 * Komponente zur Darstellung eines einzelnen Outfits in Kartenform.
 * Zeigt den Style-Namen, die Anzahl der Kleidungsstücke und optional Details an.
 */
class OutfitCard extends Component {
    constructor(props) {
        super(props);
        // Initialisierung des States mit dem übergebenen Outfit und dem expanded-Status
        this.state = {
            outfit: props.outfit,
            expanded: false  // Steuert, ob die detaillierte Ansicht angezeigt wird
        };
    }

    /**
     * Handler für das Löschen eines Outfits.
     * Kommuniziert mit der API und informiert die übergeordnete Komponente über Änderungen.
     */
    handleDelete = async () => {
        try {
            // Lösche das Outfit über die API
            await KleiderschrankAPI.getAPI().deleteOutfit(this.state.outfit.getID());
            // Informiere die Elternkomponente über die erfolgreiche Löschung
            this.props.onDelete(this.state.outfit);
        } catch (error) {
            console.error("Fehler beim Löschen des Outfits:", error);
        }
    };

    /**
     * Handler für das Aus- und Einklappen der detaillierten Ansicht.
     * Wechselt den expanded-Status im State.
     */
    handleExpandClick = () => {
        this.setState({
            expanded: !this.state.expanded
        });
    };

    render() {
        const { outfit, expanded } = this.state;

        return (
            <Card className="mb-4">
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        {/* Linke Seite: Outfit-Informationen */}
                        <div>
                            {/* Style-Name des Outfits */}
                            <Typography variant="h6">
                                {outfit.getStyle().getName()}
                            </Typography>
                            {/* Anzahl der Kleidungsstücke im Outfit */}
                            <Typography color="textSecondary">
                                {outfit.getBausteine().length} Kleidungsstücke
                            </Typography>

                            {/* Erweiterte Ansicht mit Details zu den Kleidungsstücken */}
                            {expanded && (
                                <Box mt={2}>
                                    {/* Liste aller Kleidungsstücke im Outfit */}
                                    {outfit.getBausteine().map(kleidungsstueck => (
                                        <Typography key={kleidungsstueck.getID()}>
                                            • {kleidungsstueck.getName()} ({kleidungsstueck.getTyp().getBezeichnung()})
                                        </Typography>
                                    ))}
                                </Box>
                            )}
                        </div>

                        {/* Rechte Seite: Aktions-Buttons */}
                        <Box>
                            {/* Button zum Erweitern/Reduzieren der Ansicht */}
                            <IconButton
                                onClick={this.handleExpandClick}
                                aria-expanded={expanded}
                            >
                                {expanded ? "Weniger" : "Mehr"}
                            </IconButton>
                            {/* Button zum Löschen des Outfits */}
                            <IconButton
                                onClick={this.handleDelete}
                                color="error"
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        );
    }
}

export default OutfitCard;