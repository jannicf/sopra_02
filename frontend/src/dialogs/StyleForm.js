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

const StyleForm = ({ show, style, onClose }) => {
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
        features: style.getFeatures(), // Array von KleidungstypBO
        constraints: {
          kardinalitaeten: style.getConstraints().filter(c => c.constructor.name === 'KardinalitaetBO'),
          mutexe: style.getConstraints().filter(c => c.constructor.name === 'MutexBO'),
          implikationen: style.getConstraints().filter(c => c.constructor.name === 'ImplikationBO')
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
    setFormData(prev => {
      const updatedConstraints = { ...prev.constraints };

      // Wähle das richtige Array (kardinalitaeten|mutexe|implikationen)
      const constraintArrayKey = (
        constraintType === 'kardinalitaet' ? 'kardinalitaeten'
          : constraintType === 'mutex' ? 'mutexe'
          : 'implikationen'
      );

      if (selectedConstraint) {
        // Bearbeiten eines existierenden Constraints
        updatedConstraints[constraintArrayKey] = updatedConstraints[constraintArrayKey].map(c =>
          c === selectedConstraint ? { ...c, ...constraintData } : c
        );
      } else {
        // Neuen Constraint hinzufügen
        updatedConstraints[constraintArrayKey] = [
          ...updatedConstraints[constraintArrayKey],
          constraintData
        ];
      }

      return {
        ...prev,
        constraints: updatedConstraints
      };
    });

    // Dialog schließen
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

      // Filtere das "index"-te Element raus
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
      const api = KleiderschrankAPI.getAPI();

      // Constraints zusammenführen
      const allConstraints = [
        ...formData.constraints.kardinalitaeten,
        ...formData.constraints.mutexe,
        ...formData.constraints.implikationen
      ];

      // JSON fürs Backend
      const submitData = {
        name: formData.name,
        // Features als IDs
        features: formData.features.map(f => f.getID()),
        // Constraints als Array; wir haben sie "Roh" in formData
        constraints: allConstraints
      };

      // Unterscheide Update vs. Neuerstellung
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
      {formData.constraints.kardinalitaeten.map((k, idx) => (
        <ListItem key={`k-${idx}`}>
          <ListItemText
            primary={`Kardinalität: ${k.minAnzahl} bis ${k.maxAnzahl} ` +
              `${kleidungstypen.find(t => t.getID() === k.bezugsobjekt.id)?.getBezeichnung()}`}
          />
          <IconButton onClick={() => {
            setSelectedConstraint(k);
            setActiveDialog('kardinalitaet');
          }}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleConstraintDelete('kardinalitaet', idx)}>
            <DeleteIcon />
          </IconButton>
        </ListItem>
      ))}

      {formData.constraints.mutexe.map((m, idx) => (
        <ListItem key={`m-${idx}`}>
          <ListItemText
            primary={`Mutex: ${kleidungstypen.find(t => t.getID() === m.bezugsobjekt1.id)?.getBezeichnung()} ` +
              `nicht mit ${kleidungstypen.find(t => t.getID() === m.bezugsobjekt2.id)?.getBezeichnung()}`}
          />
          <IconButton onClick={() => {
            setSelectedConstraint(m);
            setActiveDialog('mutex');
          }}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleConstraintDelete('mutex', idx)}>
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
          }}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleConstraintDelete('implikation', idx)}>
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
            >
              + Implikation
            </Button>
          </Box>
          {renderConstraintsList()}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => onClose(false)}>Abbrechen</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
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
