import React, { Component } from 'react';
import {Box, Card, CardContent, Grid, Typography} from '@mui/material';
import StyleCard from './StyleCard';
import AddIcon from "@mui/icons-material/Add";

class StyleList extends Component {
    render() {
        const { styles, onEdit, onDelete, onStyleClick, onCreateClick } = this.props;

        return (
            <Grid container spacing={3}>
                {/* Neue Style Kachel */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card
                        sx={{
                            cursor: 'pointer',
                            height: '100%',
                            p: 2,
                            borderRadius: 2,
                            boxShadow: 2,
                            bgcolor: 'primary.main',
                            color: 'white',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                transition: 'all 0.2s'
                            }
                        }}
                        onClick={onCreateClick}
                    >
                        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <AddIcon sx={{ fontSize: 40, color: 'white', mb: 1 }} />
                                <Typography variant="h6" color="white">
                                    Neuer Style
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {styles.map((style) => (
                    <Grid item xs={12} sm={6} md={4} key={style.getID()}>
                        <StyleCard
                            style={style}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onClick={onStyleClick}
                        />
                    </Grid>
                ))}
            </Grid>
        );
    }
}

export default StyleList;