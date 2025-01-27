import React, { Component } from 'react';
import { Typography, Card, CardContent, Box, IconButton } from '@mui/material';
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
                    height: '112px',
                    display: 'flex',
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
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                            alignItems: 'center'
                        }}>
                            <Box>
                                <Typography variant="h6">
                                    {kleidungstyp.getBezeichnung()}
                                </Typography>
                                <Typography color="textSecondary">
                                    Styles: {verwendungen.length}
                                </Typography>
                            </Box>
                            <Box>
                                <IconButton
                                    onClick={this.handleEditClick}
                                    sx={{ color: 'primary.main', '&:hover': { bgcolor: '#f5f5f5' } }}
                                    disableRipple
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    onClick={this.handleDeleteClick}
                                    sx={{ color: 'error.main', '&:hover': { bgcolor: '#f5f5f5' } }}
                                    disableRipple
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

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
