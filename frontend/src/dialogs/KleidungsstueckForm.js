import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
        FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import KleiderschrankAPI from '../api/KleiderschrankAPI';

class KleidungsstueckForm extends Component {
 constructor(props) {
    super(props);
    this.state = {
     kleidungsstueck: props.kleidungsstueck ? props.kleidungsstueck : {
       name: '',
       typ: null,
     },
     kleidungstypen: [],
     error: null,
     loading: false
    };
 }

 componentDidMount() {
   this.loadKleidungstypen();
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
   this.setState({
     kleidungsstueck: { ...this.state.kleidungsstueck, name: event.target.value }
   });
 }

 handleTypChange = (event) => {
   this.setState({
     kleidungsstueck: { ...this.state.kleidungsstueck, typ: event.target.value }
   });
 }

 handleSubmit = async () => {
   const { kleidungsstueck } = this.state;
   try {
     this.setState({ loading: true });
     if (kleidungsstueck.id) {
       await KleiderschrankAPI.getAPI().updateKleidungsstueck(kleidungsstueck);
     } else {
       await KleiderschrankAPI.getAPI().addKleidungsstueck(kleidungsstueck);
     }
     this.props.onClose(kleidungsstueck);
   } catch (error) {
     this.setState({ error: 'Fehler beim Speichern des Kleidungsstücks' });
   } finally {
     this.setState({ loading: false });
   }
 }

 render() {
   const { kleidungsstueck, kleidungstypen, error, loading } = this.state;
   const { show, onClose } = this.props;

   return (
     <Dialog open={show} onClose={() => onClose(null)} maxWidth="sm" fullWidth>
       <DialogTitle>
         {kleidungsstueck.id ? 'Kleidungsstück bearbeiten' : 'Neues Kleidungsstück hinzufügen'}
       </DialogTitle>
       <DialogContent>
         <TextField
           autoFocus
           margin="dense"
           label="Name"
           type="text"
           fullWidth
           value={kleidungsstueck.name}
           onChange={this.handleNameChange}
         />
         <FormControl fullWidth margin="dense">
           <InputLabel>Kleidungstyp</InputLabel>
           <Select
             value={kleidungsstueck.typ || ''}
             onChange={this.handleTypChange}
           >
             {kleidungstypen.map((typ) => (
               <MenuItem key={typ.id} value={typ}>
                 {typ.bezeichnung}
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
           disabled={loading || !kleidungsstueck.name || !kleidungsstueck.typ}
         >
           Speichern
         </Button>
       </DialogActions>
     </Dialog>
   );
 }
}

export default KleidungsstueckForm;