import React, { Component } from 'react';
import {Box, Card, CardContent, Grid, Typography} from '@mui/material';
import StyleCard from './StyleCard';
import AddIcon from "@mui/icons-material/Add";

class StyleList extends Component {
    render() {
        const { styles, onEdit, onDelete, onStyleClick, onCreateClick } = this.props;

        return (
            <Grid container spacing={3}>
                {/* Neue Style Kachel mit exakt gleicher Struktur wie StyleCard */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card
                        sx={{
                            cursor: 'pointer',
                            '&:hover': {
                                boxShadow: 3,
                                transform: 'scale(1.02)',
                                transition: 'all 0.2s ease-in-out'
                            }
                        }}
                        onClick={onCreateClick}
                    >
                        <CardContent>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <AddIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                                <Typography variant="h6" color="primary">
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