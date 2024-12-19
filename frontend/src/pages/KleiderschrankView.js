import React, { Component } from 'react';
import { Grid, Typography, Button, Card, CardContent, List, ListItem, ListItemText } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import KleidungsstueckForm from './dialogs/KleidungsstueckForm';

class KleiderschrankView extends Component {
    constructor(props) {
        super(props);
        // empty state initialisieren
        this.state = {
            kleidungsstuecke: [],
            showKleidungsstueckForm: false,
            selectedKleidungsstueck: null,


        }
    }
}
