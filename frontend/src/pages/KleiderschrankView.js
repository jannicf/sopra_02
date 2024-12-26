// KleiderschrankView.js
import React, { Component } from 'react';
import { Grid, Typography, Button } from '@mui/material';
import KleidungsstueckCard from '../components/KleidungsstueckCard';

class KleiderschrankView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            kleidungsstuecke: [],
            showKleidungsstueckForm: false,
            selectedKleidungsstueck: null,
        };
    }

    render() {
        return (
            <div>
                <Typography variant="h4">Mein Kleiderschrank</Typography>
                <Grid container spacing={2}>
                    {this.state.kleidungsstuecke.map((kleidungsstueck) => (
                        <Grid item xs={12} sm={6} md={4} key={kleidungsstueck.id}>
                            <KleidungsstueckCard
                                kleidungsstueck={kleidungsstueck}
                                onUpdate={this.handleUpdate}
                                onDelete={this.handleDelete}
                            />
                        </Grid>
                    ))}
                </Grid>
            </div>
        );
    }
}

export default KleiderschrankView;