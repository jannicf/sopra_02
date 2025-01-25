import React, { Component } from 'react';
import { Typography, Card, CardContent, Box, IconButton, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KleidungstypForm from '../dialogs/KleidungstypForm';
import KleidungstypDeleteDialog from '../dialogs/KleidungstypDeleteDialog';
import KleidungstypDetailDialog from '../dialogs/KleidungstypDetailDialog';

class KleidungstypCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showEditDialog: false,
            showDeleteDialog: false,
            showDetailDialog: false,
            kleiderschrankId: props.kleiderschrankId
        };
    }

    // Event handlers remain unchanged
    handleEditClick = () => {
        const { kleidungstyp } = this.props;
        console.log("Edit Kleidungstyp:", {
            id: kleidungstyp.getID(),
            bezeichnung: kleidungstyp.getBezeichnung(),
            verwendungen: kleidungstyp.getVerwendungen(),
            kleiderschrankId: kleidungstyp.getKleiderschrankId()
        });
        this.setState({ showEditDialog: true });
    }

    handleDeleteClick = () => {
        this.setState({ showDeleteDialog: true });
    }

    handleEditDialogClosed = async (editedKleidungstyp) => {
        if (editedKleidungstyp && this.props.onUpdate) {
            try {
                await this.props.onUpdate();
            } catch (error) {
                console.error("Fehler beim Aktualisieren der Liste:", error);
            }
        }
        this.setState({ showEditDialog: false });
    };

    handleDeleteDialogClosed = async (deletedKleidungstyp) => {
        this.setState({ showDeleteDialog: false });
        if (deletedKleidungstyp && this.props.onDelete) {
            try {
                await this.props.onDelete(deletedKleidungstyp);
                if (this.props.onUpdate) {
                    await this.props.onUpdate();
                }
            } catch (error) {
                console.error("Fehler beim Löschen:", error);
            }
        }
    };

    handleCardClick = (event) => {
        // Only open detail dialog if we didn't click on an action button
        if (!event.target.closest('button')) {
            this.setState({ showDetailDialog: true });
        }
    };

    handleDetailDialogClose = () => {
        this.setState({ showDetailDialog: false });
    };

    render() {
        const { kleidungstyp, kleiderschrankId } = this.props;
        const { showEditDialog, showDeleteDialog, showDetailDialog } = this.state;
        const verwendungen = kleidungstyp.getVerwendungen();

        return (
            <>
                <Card sx={{
                    cursor: 'pointer',
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 2,
                    height: '112px',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        transition: 'all 0.2s'
                    }
                }}
                onClick={this.handleCardClick}
                >
                    <CardContent sx={{
                        p: 0,
                        '&:last-child': { pb: 0 },
                        height: '100%',
                        position: 'relative'
                    }}>
                        {/* Main content area */}
                        <Box sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            pr: 16  // Increased right padding to accommodate buttons
                        }}>
                            <Typography variant="h6" align="center" gutterBottom>
                                {kleidungstyp.getBezeichnung()}
                            </Typography>

                            <Chip
                                label={`${verwendungen.length} ${verwendungen.length === 1 ? 'Style' : 'Styles'}`}
                                color="primary"
                                variant="outlined"
                                size="small"
                            />
                        </Box>

                        {/* Action buttons container - Now horizontally arranged */}
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',  // Center vertically
                            right: 8,    // Maintain some right margin
                            transform: 'translateY(-50%)',  // Perfect vertical centering
                            display: 'flex',
                            flexDirection: 'row',  // Changed to row for horizontal layout
                            gap: 1  // Add space between buttons
                        }}>
                            <IconButton
                                onClick={this.handleEditClick}
                                sx={{
                                    color: 'primary.main',
                                    '&:hover': { bgcolor: '#f5f5f5' }
                                }}
                                disableRipple
                                size="small"
                            >
                                <EditIcon />
                            </IconButton>
                            <IconButton
                                onClick={this.handleDeleteClick}
                                sx={{
                                    color: 'error.main',
                                    '&:hover': { bgcolor: '#f5f5f5' }
                                }}
                                disableRipple
                                size="small"
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </CardContent>
                </Card>

                {/* Dialogs */}
                <KleidungstypForm
                    show={showEditDialog}
                    kleidungstyp={kleidungstyp}
                    kleiderschrankId={kleiderschrankId}
                    onClose={this.handleEditDialogClosed}
                    onUpdate={this.props.onUpdate}
                />
                <KleidungstypDeleteDialog
                    show={showDeleteDialog}
                    kleidungstyp={kleidungstyp}
                    onClose={this.handleDeleteDialogClosed}
                />
                <KleidungstypDetailDialog
                    open={showDetailDialog}
                    kleidungstyp={kleidungstyp}
                    onClose={this.handleDetailDialogClose}
                />
            </>
        );
    }
}

export default KleidungstypCard;