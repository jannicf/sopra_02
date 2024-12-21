import React, { Component } from 'react';
import { Grid, Typography, Button, Card, CardContent, List, ListItem, ListItemText } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import KleidungsstueckCard from './components/KleidungsstueckCard';

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



     // Handler für Updates und Löschungen implementieren
    handleUpdate = (updatedKleidungsstueck) => {
    // API-Call zum Aktualisieren
    }

    handleDelete = (deletedKleidungsstueck) => {
    // API-Call zum Löschen
    }
}


export default KleiderschrankView;