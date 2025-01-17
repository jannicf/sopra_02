import React, { useState, useEffect } from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem,
  List, ListItem, ListItemText, IconButton, Box, Typography, Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KardinalitaetDialog from './KardinalitaetDialog';
import MutexDialog from './MutexDialog';
import ImplikationDialog from './ImplikationDialog';
import KleiderschrankAPI from '../api/KleiderschrankAPI';

const StyleForm = ({ show, style, onClose, kleiderschrankId }) => {
  // State für die Eingaben
  const [formData, setFormData] = useState({
    name: '',
    features: [],
    constraints: {
        kardinalitaeten: [],
        mutexe: [],
        implikationen: []
    }
});

  // Liste aller Kleidungstypen, damit wir sie im Features-Select anbieten können
  const [kleidungstypen, setKleidungstypen] = useState([]);

  // Steuert, welcher Constraint-Dialog offen ist (kardinalitaet|mutex|implikation|null)
  const [activeDialog, setActiveDialog] = useState(null);

  // Speichert den aktuell zu bearbeitenden Constraint (wenn wir auf „Edit“ klicken)
  const [selectedConstraint, setSelectedConstraint] = useState(null);

  // Beim ersten Rendern alle Kleidungstypen laden
  useEffect(() => {
    const loadKleidungstypen = async () => {
      try {
        const allTypes = await KleiderschrankAPI.getAPI().getKleidungstypen();
        setKleidungstypen(allTypes);
      } catch (error) {
        console.error("Fehler beim Laden der Kleidungstypen:", error);
      }
    };
    loadKleidungstypen();
  }, []);


  useEffect(() => {
    if (show && style) {
        setFormData({
            name: style.getName(),
            features: style.getFeatures(),
            constraints: {
                kardinalitaeten: style.getConstraints()?.kardinalitaeten || [],
                mutexe: style.getConstraints()?.mutexe || [],
                implikationen: style.getConstraints()?.implikationen || []
            }
        });
    } else if (!style) {
        // Neuer Style
        setFormData({
            name: '',
            features: [],
            constraints: {
                kardinalitaeten: [],
                mutexe: [],
                implikationen: []
            }
        });
    }
}, [show, style]);

  /**
   * Wird aufgerufen, wenn wir in KardinalitaetDialog / MutexDialog / ImplikationDialog speichern.
   */
const handleConstraintSave = (constraintType, constraintData) => {

    // Kopiert des aktuellen formData erstellen
    const updatedFormData = { ...formData };

    if (constraintType === 'kardinalitaet') {
        const kardinalitaet = {
            type: constraintType,
            minAnzahl: constraintData.min_anzahl,
            maxAnzahl: constraintData.max_anzahl,
            bezugsobjekt: { id: constraintData.bezugsobjekt_id }
        };

        // Hier style.addConstraint aufrufen, wenn style existiert
        if (style) {
            style.addConstraint(kardinalitaet);
        }

        if (selectedConstraint) {
            updatedFormData.constraints.kardinalitaeten = updatedFormData.constraints.kardinalitaeten.map(k =>
                k === selectedConstraint ? kardinalitaet : k
            );
        } else {
            if (!updatedFormData.constraints.kardinalitaeten) {
                updatedFormData.constraints.kardinalitaeten = [];
            }
            updatedFormData.constraints.kardinalitaeten.push(kardinalitaet);
        }
    } else {
        const constraintArrayKey = constraintType === 'mutex' ? 'mutexe' : 'implikationen';
        const constraint = {
            type: constraintType,
            bezugsobjekt1: { id: constraintData.bezugsobjekt1_id },
            bezugsobjekt2: { id: constraintData.bezugsobjekt2_id }
        };

        if (style) {
            style.addConstraint(constraint);
        }

        if (selectedConstraint) {
            updatedFormData.constraints[constraintArrayKey] = updatedFormData.constraints[constraintArrayKey].map(c =>
                c === selectedConstraint ? constraint : c
            );
        } else {
            if (!updatedFormData.constraints[constraintArrayKey]) {
                updatedFormData.constraints[constraintArrayKey] = [];
            }
            updatedFormData.constraints[constraintArrayKey].push(constraint);
        }
    }

    // Aktualisiere den State mit der neuen Version
    setFormData(updatedFormData);

    setActiveDialog(null);
    setSelectedConstraint(null);
};

  /**
   * Constraint löschen (wenn wir in der Liste auf das Mülleimer-Icon klicken)
   */
  const handleConstraintDelete = (type, index) => {
    setFormData(prev => {
      const updatedConstraints = { ...prev.constraints };
      const arrayKey = (
        type === 'kardinalitaet' ? 'kardinalitaeten'
          : type === 'mutex' ? 'mutexe'
          : 'implikationen'
      );

      // Filtert das "index"-te Element raus
      updatedConstraints[arrayKey] = prev.constraints[arrayKey].filter((_, i) => i !== index);

      return {
        ...prev,
        constraints: updatedConstraints
      };
    });
  };

  /**
   * Wenn man auf "Speichern" klickt
   */
const handleSubmit = async () => {
    try {
        // API-Instanz holen
        const api = KleiderschrankAPI.getAPI();

        const submitData = {
            id: style?.getID(),
            name: formData.name,
            features: [...new Set(formData.features.map(f => typeof f === 'object' ? f.getID() : f))],
            kleiderschrank_id: kleiderschrankId,
            constraints: {
                kardinalitaeten: formData.constraints.kardinalitaeten.map(k => ({
                    type: 'kardinalitaet',
                    min_anzahl: parseInt(k.minAnzahl),
                    max_anzahl: parseInt(k.maxAnzahl),
                    bezugsobjekt_id: k.bezugsobjekt.id
                })),
                mutexe: formData.constraints.mutexe.map(m => ({
                    type: 'mutex',
                    bezugsobjekt1_id: m.bezugsobjekt1.id,
                    bezugsobjekt2_id: m.bezugsobjekt2.id
                })),
                implikationen: formData.constraints.implikationen.map(i => ({
                    type: 'implikation',
                    bezugsobjekt1_id: i.bezugsobjekt1.id,
                    bezugsobjekt2_id: i.bezugsobjekt2.id
                }))
            }
        };

        if (style) {
            await api.updateStyle(style.getID(), submitData);
        } else {
            await api.addStyle(submitData);
        }
        onClose(true);
    } catch (error) {
        console.error("Fehler beim Speichern:", error);
    }
};

  /**
   * Zeigt alle Constraints in einer Liste an, mit Buttons zum Bearbeiten/Löschen
   */
  const renderConstraintsList = () => (
    <List>
      {formData.constraints.kardinalitaeten.map((k, idx) => {
        const typ = kleidungstypen.find(t => t.getID() === k.bezugsobjekt?.id);
        return (
            <ListItem key={`k-${idx}`}>
                <ListItemText
                    primary={`Kardinalität: ${k.minAnzahl || 0} bis ${k.maxAnzahl || 0} ${typ ? typ.getBezeichnung() : 'Unbekannt'}`}
                />
                <IconButton onClick={() => {
                    setSelectedConstraint(k);
                    setActiveDialog('kardinalitaet');
                }} color="primary">
                    <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleConstraintDelete('kardinalitaet', idx)} color="error">
                    <DeleteIcon />
                </IconButton>
            </ListItem>
        );
    })}

      {formData.constraints.mutexe.map((m, idx) => (
        <ListItem key={`m-${idx}`}>
          <ListItemText
            primary={`Mutex: ${kleidungstypen.find(t => t.getID() === m.bezugsobjekt1.id)?.getBezeichnung()} ` +
              `nicht mit ${kleidungstypen.find(t => t.getID() === m.bezugsobjekt2.id)?.getBezeichnung()}`}
          />
          <IconButton onClick={() => {
            setSelectedConstraint(m);
            setActiveDialog('mutex');
          }} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleConstraintDelete('mutex', idx)} color="error">
            <DeleteIcon />
          </IconButton>
        </ListItem>
      ))}

      {formData.constraints.implikationen.map((i, idx) => (
        <ListItem key={`i-${idx}`}>
          <ListItemText
            primary={`Implikation: Wenn ${kleidungstypen.find(t => t.getID() === i.bezugsobjekt1.id)?.getBezeichnung()}, ` +
              `dann ${kleidungstypen.find(t => t.getID() === i.bezugsobjekt2.id)?.getBezeichnung()}`}
          />
          <IconButton onClick={() => {
            setSelectedConstraint(i);
            setActiveDialog('implikation');
          }} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleConstraintDelete('implikation', idx)} color="error">
            <DeleteIcon />
          </IconButton>
        </ListItem>
      ))}
    </List>
  );

  return (
    <Dialog open={show} onClose={() => onClose(false)} maxWidth="md" fullWidth>
      <DialogTitle>
        {style ? 'Style bearbeiten' : 'Neuer Style'}
      </DialogTitle>

      <DialogContent>
        {/* Name */}
        <TextField
          fullWidth
          label="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          margin="normal"
        />

        {/* Features als Multi-Select */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Features</InputLabel>
          <Select
            multiple
            value={formData.features.map(f => f.getID())}
            onChange={(e) => {
              const selectedIDs = e.target.value; // Array von IDs
              const selectedTypes = kleidungstypen.filter(typ => selectedIDs.includes(typ.getID()));
              setFormData({ ...formData, features: selectedTypes });
            }}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {formData.features.map((feature) => (
                  <Chip key={feature.getID()} label={feature.getBezeichnung()} />
                ))}
              </Box>
            )}
          >
            {kleidungstypen.map((typ) => (
              <MenuItem key={typ.getID()} value={typ.getID()}>
                {typ.getBezeichnung()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Constraints-Bereich */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Constraints</Typography>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setSelectedConstraint(null);
                setActiveDialog('kardinalitaet');
              }}
              disableRipple
              sx={{ mr: 1 }}
            >
              + Kardinalität
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setSelectedConstraint(null);
                setActiveDialog('mutex');
              }}
              disableRipple
              sx={{ mr: 1 }}
            >
              + Mutex
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setSelectedConstraint(null);
                setActiveDialog('implikation');
              }}
              disableRipple
            >
              + Implikation
            </Button>
          </Box>
          {renderConstraintsList()}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => onClose(false)}
        disableRipple
        >
          Abbrechen
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disableRipple
        >
          {style ? 'Speichern' : 'Erstellen'}
        </Button>
      </DialogActions>

      {/* Je nach activeDialog ein passender Constraint-Dialog */}
      {activeDialog === 'kardinalitaet' && (
        <KardinalitaetDialog
          open
          onClose={() => setActiveDialog(null)}
          onSave={data => handleConstraintSave('kardinalitaet', data)}
          initialData={selectedConstraint}
          style={style}
        />
      )}
      {activeDialog === 'mutex' && (
        <MutexDialog
          open
          onClose={() => setActiveDialog(null)}
          onSave={data => handleConstraintSave('mutex', data)}
          initialData={selectedConstraint}
          style={style}
        />
      )}
      {activeDialog === 'implikation' && (
        <ImplikationDialog
          open
          onClose={() => setActiveDialog(null)}
          onSave={data => handleConstraintSave('implikation', data)}
          initialData={selectedConstraint}
          style={style}
        />
      )}
    </Dialog>
  );
};

export default StyleForm;