import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import KleiderschrankAPI from '../api/KleiderschrankAPI';
import KleidungstypBO from '../api/KleidungstypBO';

class KleidungstypForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            kleidungstyp: props.kleidungstyp ? props.kleidungstyp : new KleidungstypBO(),
            error: null,
            loading: false
        };
    }

    handleBezeichnungChange = (event) => {
        const kleidungstyp = this.state.kleidungstyp;
        kleidungstyp.setBezeichnung(event.target.value);
        this.setState({ kleidungstyp });
    }

    handleSubmit = async () => {
        const { kleidungstyp } = this.state;
        try {
            this.setState({ loading: true });

            if (kleidungstyp.getID()) {
                await KleiderschrankAPI.getAPI().updateKleidungstyp(kleidungstyp);
            } else {
                await KleiderschrankAPI.getAPI().addKleidungstyp(kleidungstyp);
            }

            this.props.onClose(kleidungstyp);
        } catch (error) {
            this.setState({
                error: 'Fehler beim Speichern des Kleidungstyps',
                loading: false
            });
        }
    }

    render() {
        const { kleidungstyp, error, loading } = this.state;
        const { show, onClose } = this.props;

        return (
            <Dialog open={show} onClose={() => onClose(null)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {kleidungstyp.getID() ? 'Kleidungstyp bearbeiten' : 'Neuen Kleidungstyp hinzufügen'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Bezeichnung"
                        type="text"
                        fullWidth
                        value={kleidungstyp.getBezeichnung() || ''}
                        onChange={this.handleBezeichnungChange}
                    />
                    {error && <div style={{color: 'red', marginTop: '10px'}}>{error}</div>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => onClose(null)}>
                        Abbrechen
                    </Button>
                    <Button
                        onClick={this.handleSubmit}
                        disabled={loading || !kleidungstyp.getBezeichnung()}
                    >
                        Speichern
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default KleidungstypForm;