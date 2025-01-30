import React, { Component } from 'react';
import { Box, Card, CardContent, IconButton, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KleiderschrankAPI from '../api/KleiderschrankAPI';

class StyleCard extends Component {
    state = {
        showDetailsDialog: false,
        kleidungstypen: []
    };

    componentDidMount() {
    this.loadKleidungstypen();
}

loadKleidungstypen = async () => {
    try {
        const kleidungstypen = await KleiderschrankAPI.getAPI().getKleidungstypen();
        this.setState({ kleidungstypen });
    } catch (error) {
        console.error("Fehler beim Laden der Kleidungstypen:", error);
    }
};

    handleEditClick = (e) => {
        e.stopPropagation(); // Stoppt das Event hier direkt
        this.props.onEdit(this.props.style);
    };

    handleDeleteClick = () => {
        this.setState({ showDeleteDialog: true });
    }

    handleCloseDetails = () => {
        this.setState({
            showDetailsDialog: false
        });
    };

    renderStyleDetailsDialog() {
        const { style, onEdit, onDelete } = this.props;
        const { showDetailsDialog } = this.state;

        return (
            <Dialog
                open={showDetailsDialog}
                onClose={this.handleCloseDetails}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        pr: 2
                    }}>
                        <Typography variant="h6">
                            Details für Style "{style.getName()}"
                        </Typography>
                        <Box>
                            <IconButton
                                onClick={(e) => onEdit(style, e)}
                                size="small"
                                sx={{ mr: 1 }}
                                color="primary"
                            >
                                <EditIcon />
                            </IconButton>
                            <IconButton
                                onClick={(e) => onDelete(style, e)}
                                size="small"
                                color="error"
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Features:
                        </Typography>
                        {style.getFeatures().map((feature, index) => (
                            <Typography
                                key={index}
                                color="textSecondary"
                                sx={{ ml: 2, mb: 1 }}
                            >
                                • {typeof feature === 'object' ? feature.getBezeichnung() : feature}
                            </Typography>
                        ))}
                    </Box>

                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            Constraints:
                        </Typography>
                        {style.getConstraints().kardinalitaeten?.map((k, index) => {
                            const typ = this.state.kleidungstypen.find(t => t.getID() === k.bezugsobjekt.id);
                            return (
                                <Typography
                                    key={`k-${index}`}
                                    color="textSecondary"
                                    sx={{ ml: 2, mb: 1 }}
                                >
                                    • Kardinalität: {k.minAnzahl || 0} bis {k.maxAnzahl || 0} für Typ "{typ ? typ.getBezeichnung() : 'Unbekannt'}"
                                </Typography>
                            );
                        })}
                        {style.getConstraints().mutexe?.map((m, index) => {
                            const typ1 = this.state.kleidungstypen.find(t => t.getID() === m.bezugsobjekt1.id);
                            const typ2 = this.state.kleidungstypen.find(t => t.getID() === m.bezugsobjekt2.id);
                            return (
                                <Typography
                                    key={`m-${index}`}
                                    color="textSecondary"
                                    sx={{ ml: 2, mb: 1 }}
                                >
                                    • Mutex: Typen "{typ1?.getBezeichnung() || 'Unbekannt'}" und "{typ2?.getBezeichnung() || 'Unbekannt'}" schließen sich aus
                                </Typography>
                            );
                        })}
                        {style.getConstraints().implikationen?.map((i, index) => {
                            const typ1 = this.state.kleidungstypen.find(t => t.getID() === i.bezugsobjekt1.id);
                            const typ2 = this.state.kleidungstypen.find(t => t.getID() === i.bezugsobjekt2.id);
                            return (
                                <Typography
                                    key={`i-${index}`}
                                    color="textSecondary"
                                    sx={{ ml: 2, mb: 1 }}
                                >
                                    • Implikation: Wenn Typ "{typ1?.getBezeichnung() || 'Unbekannt'}" gewählt ist, muss auch Typ "{typ2?.getBezeichnung() || 'Unbekannt'}" gewählt werden
                                </Typography>
                            );
                        })}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCloseDetails}>Schließen</Button>
                </DialogActions>
            </Dialog>
        );
    }

    render() {
        const { style, onEdit, onDelete } = this.props;

        return (
            <>
                <Card
                sx={{
                    p: 2,
                    cursor: 'pointer',
                    borderRadius: 2,
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        transition: 'all 0.2s'
                    }
                }}
                onClick={() => this.setState({ showDetailsDialog: true })}
            >
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography variant="h6">
                                {style.getName()}
                            </Typography>
                            <Typography color="textSecondary">
                                Features: {style.getFeatures().length}
                            </Typography>
                            <Typography color="textSecondary">
                                Constraints: {
                                    (style.getConstraints().kardinalitaeten?.length || 0) +
                                    (style.getConstraints().mutexe?.length || 0) +
                                    (style.getConstraints().implikationen?.length || 0)
                                }
                            </Typography>
                        </Box>
                        <Box>
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(style);
                                }}
                                sx={{ color: 'primary.main', '&:hover': { bgcolor: '#f5f5f5' } }}
                                disableRipple
                            >
                                <EditIcon />
                            </IconButton>
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(style);
                                }}
                                sx={{ color: 'error.main', '&:hover': { bgcolor: '#f5f5f5' } }}
                                disableRipple
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {this.renderStyleDetailsDialog()}
        </>
    );
}
}

export default StyleCard;