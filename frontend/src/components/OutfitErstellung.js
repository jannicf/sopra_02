// OutfitErstellung.js
import React, { Component } from 'react';
import { Card, CardContent, Radio, RadioGroup, FormControlLabel, Typography } from '@mui/material';
import StyleBasiertesOutfit from './StyleBasiertesOutfit.js';
import KleidungsstueckBasiertesOutfit from './KleidungsstueckBasiertesOutfit.js';

class OutfitErstellung extends Component {
    constructor(props) {
        super(props);
        this.state = {
            erstellungsMethode: ''
        };
    }

    handleMethodenChange = (e) => {
        this.setState({ erstellungsMethode: e.target.value });
    }

    render() {
        const { erstellungsMethode } = this.state;

        return (
            <div className="w-full p-4">
                <Typography variant="h4" className="mb-4">Outfit erstellen</Typography>
                <Card className="mb-4">
                    <CardContent>
                        <Typography variant="h6">Wie möchten Sie Ihr Outfit erstellen?</Typography>
                        <RadioGroup
                            value={erstellungsMethode}
                            onChange={this.handleMethodenChange}
                        >
                            <FormControlLabel
                                value="style"
                                control={<Radio />}
                                label="Nach Style erstellen"
                            />
                            <FormControlLabel
                                value="kleidungsstueck"
                                control={<Radio />}
                                label="Basierend auf Kleidungsstück erstellen"
                            />
                        </RadioGroup>
                    </CardContent>
                </Card>

                {erstellungsMethode === 'style' && <StyleBasiertesOutfit />}
                {erstellungsMethode === 'kleidungsstueck' && <KleidungsstueckBasiertesOutfit />}
            </div>
        );
    }
}

export default OutfitErstellung;