import React, { Component } from 'react';
import { Typography, Card, CardContent, Grid, Button, ButtonGroup, Box, Chip, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KleidungstypForm from '../dialogs/KleidungstypForm';
import KleidungstypDeleteDialog from '../dialogs/KleidungstypDeleteDialog';

class KleidungstypCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showEditDialog: false,
            showDeleteDialog: false,
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

    render() {
        const { kleidungstyp, kleiderschrankId } = this.props;
        const { showEditDialog, showDeleteDialog } = this.state;
        const verwendungen = kleidungstyp.getVerwendungen();

        console.log("KleidungstypCard render:", {
            id: kleidungstyp.getID(),
            bezeichnung: kleidungstyp.getBezeichnung(),
            verwendungen: verwendungen
        });

        return (
            <Card sx={{
                p: 2,
                cursor: 'pointer',
                borderRadius: 2,
                '&:hover': {
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s'
                }
            }}>
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography variant="h6">
                                {kleidungstyp.getBezeichnung()}
                            </Typography>
                            {verwendungen && verwendungen.length > 0 ? (
                                <Box sx={{ mt: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
            {verwendungen.map(style => (
                <Chip
                    key={style.getID()}
                    label={style.getName()}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ width: 'fit-content' }}
                />
            ))}
        </Box>
        </Box>
        ) : (
            <Typography color="textSecondary" variant="body2">
                Keine Styles zugeordnet
            </Typography>
        )}
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
            </Card>
        );
    }
}

export default KleidungstypCard;