import React, { Component } from 'react';
import { Card, CardContent, List, ListItem, ListItemText, Button, Typography } from '@mui/material';
import { KleiderschrankAPI } from '../api';

class KleidungsstueckBasiertesOutfit extends Component {
   constructor(props) {
       super(props);
       this.state = {
           kleidungsstuecke: [],
           ausgewaehltesBasisKleidungsstueck: null,
           vorgeschlageneKleidung: [],
           ausgewaehlteKleidung: []
       };
   }

   componentDidMount() {
       this.kleidungLaden();
   }

   kleidungLaden = async () => {
       const kleidungListe = await KleiderschrankAPI.getAPI().getKleidungsstuecke();
       this.setState({ kleidungsstuecke: kleidungListe });
   };

   handleKleidungsstueckAuswahl = async (kleidungsstueck) => {
       this.setState({ ausgewaehltesBasisKleidungsstueck: kleidungsstueck });
       const vervollstaendigungen = await KleiderschrankAPI.getAPI()
           .getPossibleOutfitCompletions(kleidungsstueck.getID());
       this.setState({ vorgeschlageneKleidung: vervollstaendigungen });
   };

   handleAusgewaehlteKleidungChange = (kleidung) => {
       this.setState({
           ausgewaehlteKleidung: [...this.state.ausgewaehlteKleidung, kleidung]
       });
   };

   handleOutfitErstellen = async () => {
       await KleiderschrankAPI.getAPI().createOutfitFromBaseItem(
           this.state.ausgewaehltesBasisKleidungsstueck.getID(),
           this.state.ausgewaehlteKleidung.map(kleidung => kleidung.getID())
       );
   };

   render() {
       const { kleidungsstuecke, ausgewaehltesBasisKleidungsstueck, vorgeschlageneKleidung, ausgewaehlteKleidung } = this.state;

       return (
           <div>
               <Card className="mb-4">
                   <CardContent>
                       <Typography variant="h6">Basis-Kleidungsstück auswählen</Typography>
                       <List>
                           {kleidungsstuecke.map(kleidung => (
                               <ListItem
                                   key={kleidung.getID()}
                                   button
                                   selected={ausgewaehltesBasisKleidungsstueck?.getID() === kleidung.getID()}
                                   onClick={() => this.handleKleidungsstueckAuswahl(kleidung)}
                               >
                                   <ListItemText
                                       primary={kleidung.getName()}
                                       secondary={kleidung.getTyp().getBezeichnung()}
                                   />
                               </ListItem>
                           ))}
                       </List>
                   </CardContent>
               </Card>

               {vorgeschlageneKleidung.length > 0 && (
                   <Card className="mb-4">
                       <CardContent>
                           <Typography variant="h6">Passende Kleidungsstücke</Typography>
                           <List>
                               {vorgeschlageneKleidung.map(kleidung => (
                                   <ListItem
                                       key={kleidung.getID()}
                                       button
                                       selected={ausgewaehlteKleidung.includes(kleidung)}
                                       onClick={() => this.handleAusgewaehlteKleidungChange(kleidung)}
                                   >
                                       <ListItemText
                                           primary={kleidung.getName()}
                                           secondary={kleidung.getTyp().getBezeichnung()}
                                       />
                                   </ListItem>
                               ))}
                           </List>
                       </CardContent>
                   </Card>
               )}

               {ausgewaehlteKleidung.length > 0 && (
                   <Button
                       variant="contained"
                       color="primary"
                       onClick={this.handleOutfitErstellen}
                   >
                       Outfit erstellen
                   </Button>
               )}
           </div>
       );
   }
}

export default KleidungsstueckBasiertesOutfit;