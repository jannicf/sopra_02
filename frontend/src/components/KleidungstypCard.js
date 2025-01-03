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
        };
    }

    handleEditClick = () => {
        this.setState({ showEditDialog: true });
    }

    handleDeleteClick = () => {
        this.setState({ showDeleteDialog: true });
    }

    handleEditDialogClosed = (editedKleidungstyp) => {
        if (editedKleidungstyp) {
            this.props.onUpdate();
        }
        this.setState({ showEditDialog: false });
    }

    handleDeleteDialogClosed = async (deletedKleidungstyp) => {
        if (deletedKleidungstyp) {
            // Rufe die übergebene onDelete-Funktion auf
            await this.props.onDelete(deletedKleidungstyp);
            // Nach erfolgreichem Löschen die Liste aktualisieren
            this.props.onUpdate();
        }
        this.setState({ showDeleteDialog: false });
    }

    render() {
        const { kleidungstyp } = this.props;
        const { showEditDialog, showDeleteDialog } = this.state;

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
                                    {kleidungstyp.getVerwendungen().length > 0 && (
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                                            {kleidungstyp.getVerwendungen().map(style => (
                                                <Chip
                                                    key={style.getID()}
                                                    label={style.getName()}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            ))}
                                        </Box>
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
                    onClose={this.handleEditDialogClosed}
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