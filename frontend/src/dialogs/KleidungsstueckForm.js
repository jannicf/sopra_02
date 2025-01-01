import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
        FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import KleiderschrankAPI from '../api/KleiderschrankAPI';
import KleidungsstueckBO from "../api/KleidungsstueckBO";

class KleidungsstueckForm extends Component {
 constructor(props) {
    super(props);
    const initialKleidungsstueck = props.kleidungsstueck ? props.kleidungsstueck : new KleidungsstueckBO();
    // Wenn es ein neues Kleidungsstück ist, setze die kleiderschrank_id aus den props
    if (!props.kleidungsstueck) {
        initialKleidungsstueck.setKleiderschrankId(props.kleiderschrankId);
    }

    this.state = {
        kleidungsstueck: initialKleidungsstueck,
        kleidungstypen: [],
        error: null,
        loading: false
    };
 }

 componentDidMount() {
   this.loadKleidungstypen();
 }

 componentDidUpdate(prevProps) {
    if (this.props.kleiderschrankId !== prevProps.kleiderschrankId && this.props.kleiderschrankId) {
        // Wenn eine neue kleiderschrankId kommt, aktualisiere das Kleidungsstück
        const kleidungsstueck = this.state.kleidungsstueck;
        kleidungsstueck.setKleiderschrankId(this.props.kleiderschrankId);
        this.setState({ kleidungsstueck });
    }
 }

 loadKleidungstypen = async () => {
   try {
     const kleidungstypen = await KleiderschrankAPI.getAPI().getKleidungstypen();
     this.setState({ kleidungstypen });
   } catch (error) {
     this.setState({ error: 'Fehler beim Laden der Kleidungstypen' });
   }
 }

 handleNameChange = (event) => {
        const kleidungsstueck = this.state.kleidungsstueck;
        kleidungsstueck.setName(event.target.value);
        this.setState({ kleidungsstueck });
    }

 handleTypChange = (event) => {
    const selectedTypId = event.target.value;

    const selectedTyp = this.state.kleidungstypen.find(typ => typ.getID() === selectedTypId);

    if (selectedTyp) {
        const kleidungsstueck = this.state.kleidungsstueck;
        kleidungsstueck.setTyp(selectedTyp);
        this.setState({
            kleidungsstueck,
            selectedTypId
        });
    }
 }

 handleSubmit = async () => {
    const { kleidungsstueck } = this.state;
    try {
        // Objekt vorbereiten, das die nötigen Daten enthält
        const requestData = {
            id: kleidungsstueck.getID(),
            name: kleidungsstueck.getName(),
            typ_id: kleidungsstueck.getTyp()?.getID(),
            // Bei neuem Kleidungsstück die ID aus den props
            // Bei bestehendem Kleidungsstück die ID aus dem Kleidungsstück-Objekt
            kleiderschrank_id: this.props.kleiderschrankId || kleidungsstueck.getKleiderschrankId()
        };

        if (!requestData.kleiderschrank_id) {
            throw new Error("Keine Kleiderschrank ID vorhanden");
        }
        if (requestData.id) {
            try {
                await KleiderschrankAPI.getAPI().updateKleidungsstueck(requestData);
                // Der Request war erfolgreich
                this.props.onClose(kleidungsstueck);
            } catch (error) {
                // Prüfen ob es ein JSON-Parse Fehler ist
                if (error instanceof SyntaxError && error.message.includes('JSON')) {
                    // Das Backend hat die Änderung gespeichert, aber keine valide JSON zurückgegeben
                    // Wir behandeln das vorest als Erfolg
                    this.props.onClose(kleidungsstueck);
                } else {
                    // Ein anderer Fehler ist aufgetreten
                    throw error;
                }
            }
        } else {
            await KleiderschrankAPI.getAPI().addKleidungsstueck(requestData);
            this.props.onClose(kleidungsstueck);
        }
    } catch (error) {
        console.error('Error during submit:', error);
        this.setState({
            error: 'Fehler beim Speichern des Kleidungsstücks',
            loading: false
        });
    } finally {
        this.setState({loading: false});
    }
 }

 render() {
        const { kleidungsstueck, kleidungstypen, error, loading } = this.state;
        const { show, onClose } = this.props;

        return (
            <Dialog open={show} onClose={() => onClose(null)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {kleidungsstueck.getID() ? 'Kleidungsstück bearbeiten' : 'Neues Kleidungsstück hinzufügen'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        value={kleidungsstueck.getName() || ''}
                        onChange={this.handleNameChange}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Kleidungstyp</InputLabel>
                        <Select
                            value={kleidungsstueck.getTyp()?.getID() || ''}
                            onChange={this.handleTypChange}
                        >
                            {kleidungstypen.map((typ) => (
                                <MenuItem key={typ.getID()} value={typ.getID()}>
                                    {typ.getBezeichnung()}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {error && <div style={{color: 'red', marginTop: '10px'}}>{error}</div>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => onClose(null)}>Abbrechen</Button>
                    <Button
                        onClick={this.handleSubmit}
                        disabled={loading || !kleidungsstueck.getName() || !kleidungsstueck.getTyp()}
                    >
                        Speichern
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default KleidungsstueckForm;