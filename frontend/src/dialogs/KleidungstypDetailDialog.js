import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Chip
} from '@mui/material';

const KleidungstypDetailDialog = ({ open, kleidungstyp, onClose }) => {
    const verwendungen = kleidungstyp?.getVerwendungen() || [];

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                <Typography variant="h6">
                    Details für Kleidungstyp: {kleidungstyp?.getBezeichnung()}
                </Typography>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Zugeordnete Styles ({verwendungen.length}):
                    </Typography>

                    {verwendungen.length > 0 ? (
                        <Box sx={{
                            display: 'flex',
                            gap: 1,
                            flexWrap: 'wrap'
                        }}>
                            {verwendungen.map(style => (
                                <Chip
                                    key={style.getID()}
                                    label={style.getName()}
                                    variant="outlined"
                                    color="primary"
                                />
                            ))}
                        </Box>
                    ) : (
                        <Typography color="textSecondary">
                            Diesem Kleidungstyp sind keine Styles zugeordnet.
                        </Typography>
                    )}
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>
                    Schließen
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default KleidungstypDetailDialog;
