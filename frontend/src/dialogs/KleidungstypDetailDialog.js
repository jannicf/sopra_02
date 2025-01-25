import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Chip,
    Paper
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
                            flexDirection: 'column',
                            gap: 2
                        }}>
                            {verwendungen.map(style => (
                                <Paper
                                    key={style.getID()}
                                    variant="outlined"
                                    sx={{ p: 2 }}
                                >
                                    <Typography variant="subtitle2" gutterBottom>
                                        {style.getName()}
                                    </Typography>
                                    <Box sx={{
                                        display: 'flex',
                                        gap: 1,
                                        flexWrap: 'wrap'
                                    }}>
                                        <Chip
                                            label={`ID: ${style.getID()}`}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                        />
                                        {/* Add more style details as needed */}
                                    </Box>
                                </Paper>
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