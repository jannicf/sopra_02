import React, { Component } from 'react';
import { Box, Card, CardContent, IconButton, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

class StyleCard extends Component {
    state = {
        showDetailsDialog: false
    };

    handleEditClick = (e) => {
        e.stopPropagation(); // Stoppt das Event hier direkt
        this.props.onEdit(this.props.style);
    };

    handleDeleteClick = (e) => {
        e.stopPropagation(); // Stoppt das Event hier direkt
        this.props.onDelete(this.props.style);
    };

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
                        {style.getConstraints().kardinalitaeten?.map((k, index) => (
                            <Typography
                                key={`k-${index}`}
                                color="textSecondary"
                                sx={{ ml: 2, mb: 1 }}
                            >
                                • Kardinalität: {k.minAnzahl} bis {k.maxAnzahl} für Typ "{k.bezugsobjekt_id}"
                            </Typography>
                        ))}
                        {style.getConstraints().mutexe?.map((m, index) => (
                            <Typography
                                key={`m-${index}`}
                                color="textSecondary"
                                sx={{ ml: 2, mb: 1 }}
                            >
                                • Mutex: Typen "{m.bezugsobjekt1_id}" und "{m.bezugsobjekt2_id}" schließen sich aus
                            </Typography>
                        ))}
                        {style.getConstraints().implikationen?.map((i, index) => (
                            <Typography
                                key={`i-${index}`}
                                color="textSecondary"
                                sx={{ ml: 2, mb: 1 }}
                            >
                                • Implikation: Wenn Typ "{i.bezugsobjekt1_id}" gewählt ist, muss auch Typ "{i.bezugsobjekt2_id}" gewählt werden
                            </Typography>
                        ))}
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
                        cursor: 'pointer',
                        '&:hover': {
                            boxShadow: 3,
                            transform: 'scale(1.02)',
                            transition: 'all 0.2s ease-in-out'
                        }
                    }}
                    onClick={() => this.setState({ showDetailsDialog: true })}
                >
                    <CardContent>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start'
                        }}>
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
                                    onClick={this.handleEditClick}
                                    size="small"
                                    sx={{ mr: 1 }}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    onClick={this.handleDeleteClick}
                                    size="small"
                                    color="error"
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