import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import KleiderschrankAPI from '../api/KleiderschrankAPI';

class KleidungstypDeleteDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            affectedKleidungsstuecke: [],
            error: null
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.show && !prevProps.show) {
            this.checkAffectedItems();
        }
    }

    checkAffectedItems = async () => {
        if (!this.props.kleidungstyp) return;

        try {
            const api = KleiderschrankAPI.getAPI();
            const kleidungsstuecke = await api.getKleidungsstuecke();

            // Finde alle Kleidungsstücke, die diesen Typ verwenden
            const affectedKleidungsstuecke = kleidungsstuecke.filter(stueck =>
                stueck.getTyp().getID() === this.props.kleidungstyp.getID()
            );

            this.setState({
                affectedKleidungsstuecke,

            });
        } catch (error) {
            this.setState({
                error: "Fehler beim Prüfen der betroffenen Kleidungsstücke",
            });
        }
    }

    render() {
        const { show, kleidungstyp, onClose } = this.props;
        const { affectedKleidungsstuecke,  error } = this.state;

        return (
            <Dialog open={show} onClose={() => onClose(null)}>
                <DialogTitle>
                    Kleidungstyp löschen
                </DialogTitle>
                <DialogContent>
                    <p>Möchten Sie den Kleidungstyp "{kleidungstyp?.getBezeichnung()}" wirklich löschen?</p>

                    {affectedKleidungsstuecke.length > 0 && (
                        <p style={{ color: 'orange' }}>
                            Achtung: {affectedKleidungsstuecke.length} Kleidungsstück(e)
                            verwenden diesen Typ und werden ebenfalls gelöscht!
                        </p>
                    )}

                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => onClose(null)} >
                        Abbrechen
                    </Button>
                    <Button
                        onClick={() => onClose(kleidungstyp)}
                        color="error"
                    >
                        Löschen
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default KleidungstypDeleteDialog;