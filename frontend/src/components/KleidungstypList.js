import React, { Component } from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import KleidungstypCard from './KleidungstypCard';
import AddIcon from '@mui/icons-material/Add';

class KleidungstypList extends Component {
    handleKleidungstypDelete = async (kleidungstyp) => {
        try {
            // Rufe die von der übergeordneten Komponente übergebene onDelete-Funktion auf
            await this.props.onDelete(kleidungstyp);
        } catch (error) {
            console.error('Error deleting Kleidungstyp:', error);
        }
    }

    render() {
        const { kleidungstypen, onDelete, onUpdate, kleiderschrankId, onCreateClick } = this.props;
       console.log("KleidungstypList - Kleidungstypen mit Verwendungen:",
            this.props.kleidungstypen.map(kt => ({
                id: kt.getID(),
                bezeichnung: kt.getBezeichnung(),
                verwendungen: kt.getVerwendungen()
            }))
        );

        return (
            <Grid container spacing={3}>
                {/* Add Button Card */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card
                        sx={{
                            cursor: 'pointer',
                            p: 2,
                            borderRadius: 2,
                            boxShadow: 2,
                            bgcolor: 'primary.main',
                            color: 'white',
                            height: '112px',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                transition: 'all 0.2s'
                            }
                        }}
                        onClick={onCreateClick}
                    >
                        <CardContent sx={{
                                    p: 0,
                                    '&:last-child': { pb: 0 },
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <AddIcon sx={{ fontSize: 40, color: 'white', mb: 1 }} />
                                <Typography variant="h6" color="white">
                                    Neuer Kleidungstyp
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Kleidungstyp Cards */}
                {kleidungstypen.map(kleidungstyp => (
                    <Grid item xs={12} sm={6} md={4} key={`kleidungstyp-${kleidungstyp.getID()}-${kleidungstyp.getBezeichnung()}`}>
                        <KleidungstypCard
                            kleidungstyp={kleidungstyp}
                            kleiderschrankId={kleiderschrankId}
                            onDelete={onDelete}
                            onUpdate={onUpdate}
                        />
                    </Grid>
                ))}
            </Grid>
        );
    }
}

export default KleidungstypList;