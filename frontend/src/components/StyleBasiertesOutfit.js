import React, { Component } from 'react';
import { Card, CardContent, List, ListItem, ListItemText, Button, Typography } from '@mui/material';
import KleiderschrankAPI from '../api/KleiderschrankAPI';

class StyleBasiertesOutfit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            styles: [],
            ausgewaehlterStyle: null,
            vorgeschlageneKleidung: [],
            ausgewaehlteKleidung: []
        };
    }

    componentDidMount() {
        this.stylesLaden();
    }

    stylesLaden = async () => {
        const styleListe = await KleiderschrankAPI.getAPI().getStyles();
        this.setState({ styles: styleListe });
    };

    handleStyleAuswahl = async (style) => {
        this.setState({ ausgewaehlterStyle: style });
        const moeglicheKleidung = await KleiderschrankAPI.getAPI()
            .getPossibleOutfitsForStyle(style.getID());
        this.setState({ vorgeschlageneKleidung: moeglicheKleidung });
    };

    handleKleidungAuswahl = (kleidung) => {
        this.setState({
            ausgewaehlteKleidung: [...this.state.ausgewaehlteKleidung, kleidung]
        });
    };

    handleOutfitErstellen = async () => {
        await KleiderschrankAPI.getAPI().createOutfit({
            style_id: this.state.ausgewaehlterStyle.getID(),
            kleidungsstueck_ids: this.state.ausgewaehlteKleidung.map(kleidung => kleidung.getID())
        });
    };

    render() {
        const { styles, ausgewaehlterStyle, vorgeschlageneKleidung, ausgewaehlteKleidung } = this.state;

        return (
            <div>
                <Card className="mb-4">
                    <CardContent>
                        <Typography variant="h6">Style auswählen</Typography>
                        <List>
                            {styles.map(style => (
                                <ListItem
                                    key={style.getID()}
                                    button
                                    selected={ausgewaehlterStyle?.getID() === style.getID()}
                                    onClick={() => this.handleStyleAuswahl(style)}
                                >
                                    <ListItemText primary={style.getName()} />
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
                                        onClick={() => this.handleKleidungAuswahl(kleidung)}
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

export default StyleBasiertesOutfit;