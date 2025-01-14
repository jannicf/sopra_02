import React, { Component } from 'react';
import {
    Typography,
    Button,
    Box,
    Grid,
    Card,
    CardContent,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import StyleForm from "../dialogs/StyleForm";
import StyleDeleteDialog from "../dialogs/StyleDeleteDialog";
import KleiderschrankAPI from '../api/KleiderschrankAPI';

class StylesView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            styles: [],
            selectedStyle: null,
            showFormDialog: false,
            showDeleteDialog: false,
            showDetailsDialog: false,
            loadingInProgress: false,
            error: null,
            kleiderschrankId: null
        };
    }

    componentDidMount() {
        KleiderschrankAPI.getAPI()
            .getPersonByGoogleId(this.props.user?.uid)
            .then(person => {
                if (person && person.getKleiderschrank()) {
                    const kleiderschrankId = person.getKleiderschrank().getID();
                    this.setState({
                        kleiderschrankId: kleiderschrankId
                    }, () => {
                        this.loadStyles();
                    });
                }
            }).catch(error => {
                this.setState({
                    error: "Fehler beim Laden des Kleiderschranks"
                });
            });
    }

    loadStyles = () => {
        this.setState({ loadingInProgress: true, error: null });
        KleiderschrankAPI.getAPI()
            .getStyles()
            .then(styles => {
                const filteredStyles = styles.filter(style => {
                    return style.getKleiderschrankId() === this.state.kleiderschrankId;
                });

                this.setState({
                    styles: filteredStyles,
                    loadingInProgress: false
                });
            })
            .catch(error => {
                this.setState({
                    error: error.message,
                    loadingInProgress: false
                });
            });
    };

    handleCreateClick = () => {
        this.setState({ selectedStyle: null, showFormDialog: true });
    };

    handleEditClick = (style, event) => {
        event.stopPropagation();
        this.setState({ selectedStyle: style, showFormDialog: true });
    };

    handleDeleteClick = (style, event) => {
        event.stopPropagation();
        this.setState({ selectedStyle: style, showDeleteDialog: true });
    };

    handleStyleClick = (style) => {
        this.setState({
            selectedStyle: style,
            showDetailsDialog: true
        });
    };

    handleCloseDetails = () => {
        this.setState({
            showDetailsDialog: false,
            selectedStyle: null
        });
    };

    handleFormDialogClosed = (updatedStyle) => {
        if (updatedStyle) {
            this.loadStyles();
        }
        this.setState({ showFormDialog: false, selectedStyle: null });
    };

    handleDeleteDialogClosed = (deletedStyle) => {
        if (deletedStyle) {
            this.loadStyles();
        }
        this.setState({ showDeleteDialog: false, selectedStyle: null });
    };

    renderStyleDetailsDialog() {
        const { selectedStyle, showDetailsDialog } = this.state;
        if (!selectedStyle) return null;

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
                            Details für Style "{selectedStyle.getName()}"
                        </Typography>
                        <Box>
                            <IconButton
                                onClick={(e) => this.handleEditClick(selectedStyle, e)}
                                size="small"
                                sx={{ mr: 1 }}
                            >
                                <EditIcon />
                            </IconButton>
                            <IconButton
                                onClick={(e) => this.handleDeleteClick(selectedStyle, e)}
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
                        {selectedStyle.getFeatures().map((feature, index) => (
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
                        {selectedStyle.getConstraints().kardinalitaeten?.map((k, index) => (
                            <Typography
                                key={`k-${index}`}
                                color="textSecondary"
                                sx={{ ml: 2, mb: 1 }}
                            >
                                • Kardinalität: {k.minAnzahl} bis {k.maxAnzahl} für Typ "{k.bezugsobjekt_id}"
                            </Typography>
                        ))}
                        {selectedStyle.getConstraints().mutexe?.map((m, index) => (
                            <Typography
                                key={`m-${index}`}
                                color="textSecondary"
                                sx={{ ml: 2, mb: 1 }}
                            >
                                • Mutex: Typen "{m.bezugsobjekt1_id}" und "{m.bezugsobjekt2_id}" schließen sich aus
                            </Typography>
                        ))}
                        {selectedStyle.getConstraints().implikationen?.map((i, index) => (
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
        const { styles, selectedStyle, showFormDialog, showDeleteDialog } = this.state;

        return (
            <div>
                <Typography variant="h4" sx={{ mt: 2, mb: 4 }}>
                    Meine Styles
                </Typography>

                <Grid container spacing={3}>
                    {styles.map((style) => (
                        <Grid item xs={12} sm={6} md={4} key={style.getID()}>
                            <Card
                                sx={{
                                    cursor: 'pointer',
                                    '&:hover': {
                                        boxShadow: 3,
                                        transform: 'scale(1.02)',
                                        transition: 'all 0.2s ease-in-out'
                                    }
                                }}
                                onClick={() => this.handleStyleClick(style)}
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
                                                onClick={(e) => this.handleEditClick(style, e)}
                                                size="small"
                                                sx={{ mr: 1 }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={(e) => this.handleDeleteClick(style, e)}
                                                size="small"
                                                color="error"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Style Details Dialog */}
                {this.renderStyleDetailsDialog()}

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={this.handleCreateClick}
                    sx={{
                        position: 'fixed',
                        bottom: '4.5rem',
                        right: '2rem'
                    }}
                >
                    Neuer Style
                </Button>

                {showFormDialog && (
                    <StyleForm
                        show={showFormDialog}
                        style={selectedStyle}
                        onClose={this.handleFormDialogClosed}
                        kleiderschrankId={this.state.kleiderschrankId}
                    />
                )}

                {showDeleteDialog && (
                    <StyleDeleteDialog
                        show={showDeleteDialog}
                        style={selectedStyle}
                        onClose={this.handleDeleteDialogClosed}
                    />
                )}
            </div>
        );
    }
}

export default StylesView;