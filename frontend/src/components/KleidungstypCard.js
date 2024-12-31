import React, { Component } from 'react';
import { Typography, Card, CardContent, Grid, Button, ButtonGroup } from '@mui/material';
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
            <Card>
                <CardContent>
                    <Grid container spacing={2} alignItems='center'>
                        <Grid item>
                            <Typography variant='h6'>
                                {kleidungstyp.getBezeichnung()}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <ButtonGroup variant='text' size='small'>
                                <Button color='primary' onClick={this.handleEditClick}>
                                    Bearbeiten
                                </Button>
                                <Button color='secondary' onClick={this.handleDeleteClick}>
                                    Löschen
                                </Button>
                            </ButtonGroup>
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