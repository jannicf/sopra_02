// KleiderschrankView.js
import React, { Component } from 'react';
import { Grid, Typography, Card, CardContent } from '@mui/material';
import KleiderschrankAPI from '../api/KleiderschrankAPI';

class KleiderschrankView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            kleidungsstuecke: []
        };
    }

    componentDidMount() {
        this.loadKleidungsstuecke();
    }

    loadKleidungsstuecke = () => {
        KleiderschrankAPI.getAPI().getKleidungsstuecke()
            .then(kleidungsstuecke => {
                this.setState({
                    kleidungsstuecke: kleidungsstuecke
                });
            })
            .catch(error => console.log(error));
    }

    render() {
        const { kleidungsstuecke } = this.state;

        return (
            <div>
                <Typography variant="h4" gutterBottom>
                    Mein Kleiderschrank
                </Typography>
                <Grid container spacing={2} marginBottom={8}>
                    {kleidungsstuecke.map((kleidungsstueck) => (
                        <Grid item xs={4} sm={6} md={4} key={kleidungsstueck.getID()}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">
                                        {kleidungsstueck.getName()}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        Typ: {kleidungsstueck.getTyp()?.getBezeichnung() || 'Nicht zugewiesen'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>
        );
    }
}

export default KleiderschrankView;