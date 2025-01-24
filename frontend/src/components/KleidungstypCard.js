import React, { Component } from 'react';
import { Typography, Card, CardContent, Grid, Button, ButtonGroup, Box, Chip } from '@mui/material';
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
            <Card sx={{ mb: 1 }}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        {kleidungstyp.getBezeichnung()}
                                    </Typography>
                                    {verwendungen && verwendungen.length > 0 ? (
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                                            {verwendungen.map(style => (
                                                <Chip
                                                    key={style.getID()}
                                                    label={style.getName()}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            ))}
                                        </Box>
                                    ) : (
                                        <Typography color="textSecondary" variant="body2">
                                            Keine Styles zugeordnet
                                        </Typography>
                                    )}
                                </Box>
                                <ButtonGroup variant="text" size="small">
                                    <Button color="primary" onClick={this.handleEditClick}>
                                        Bearbeiten
                                    </Button>
                                    <Button color="secondary" onClick={this.handleDeleteClick}>
                                        Löschen
                                    </Button>
                                </ButtonGroup>
                            </Box>
                        </Grid>
                    </Grid>
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