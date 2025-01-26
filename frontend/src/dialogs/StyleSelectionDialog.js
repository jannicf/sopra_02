import React from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText, Typography,
} from '@mui/material';

const StyleSelectionDialog = ({ open, onClose, styles, onSelect }) => {
    return (
        <Dialog open={open} onClose={() => onClose(null)} maxWidth="sm" fullWidth>
            <DialogTitle>Style auswählen</DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    Dieses Kleidungsstück wird in mehreren Styles verwendet.
                    Wählen Sie daher einen Style aus, der Ihrem neuen Outfit zugeordnet
                    werden soll:
                </Typography>
                <List>
                    {styles.map((style) => (
                        <ListItem
                            button
                            key={style.getID()}
                            onClick={() => onSelect(style)}
                            sx={{
                                border: 1,
                                borderColor: 'divider',
                                borderRadius: 1,
                                mb: 1,
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                }
                            }}
                        >
                            <ListItemText primary={style.getName()} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(null)}>Abbrechen</Button>
            </DialogActions>
        </Dialog>
    );
};

export default StyleSelectionDialog;