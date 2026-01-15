import React, { useState } from 'react';

import { 
  Paper, Typography, Tabs, Tab, Box, List, ListItem, 
  ListItemText, ListItemIcon, IconButton, Card, CardContent, 
  LinearProgress, Stack, Button 
} from '@mui/material';

import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import { POI_TYPES } from './poiRegistry';

const FloatingMenu = ({ pois, onTogglePin, onAddPoi }) => {
  const [tabIndex, setTabIndex] = useState(0);

  // Filtriamo i POI in base alla tab selezionata
  const mobilePois = pois.filter(p => POI_TYPES[p.type]?.category === 'mobile');
  const fixedPois = pois.filter(p => POI_TYPES[p.type]?.category === 'fixed');

  return (
    <Paper elevation={4} sx={{
      position: 'absolute', 
      top: '30px', 
      left: '20px', 
      width: '360px',
      zIndex: 1000, 
      borderRadius: '16px', 
      overflow: 'hidden', 
      maxHeight: '85vh', 
      display: 'flex', 
      flexDirection: 'column'
    }}>
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6" fontWeight="bold">Berlin Dashboard</Typography>
      </Box>

      <Tabs 
        value={tabIndex} 
        onChange={(e, newVal) => setTabIndex(newVal)} 
        variant="fullWidth"
        indicatorColor="primary"
      >
        <Tab label="Veicoli" />
        <Tab label="Strutture" />
      </Tabs>

      <Box sx={{ p: 2, overflowY: 'auto', flexGrow: 1 }}>
        {/* TAB 0: VEICOLI (CARD STYLE) */}
        {tabIndex === 0 && (
          <Stack spacing={2}>
            {mobilePois.length === 0 && <Typography variant="body2" color="text.secondary">Nessun veicolo attivo.</Typography>}
            {mobilePois.map(v => (
              <Card key={v.id} variant="outlined" sx={{ borderLeft: v.pinned ? '4px solid #2196f3' : '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" fontWeight="bold">{v.model || v.name}</Typography>
                    <IconButton size="small" onClick={() => onTogglePin(v.id)}>
                      {v.pinned ? <PushPinIcon fontSize="small" color="primary" /> : <PushPinOutlinedIcon fontSize="small" />}
                    </IconButton>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">SoC: {v.soc}%</Typography>
                  <LinearProgress variant="determinate" value={v.soc} sx={{ mt: 1, height: 6, borderRadius: 2 }} />
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}

        {/* TAB 1: STRUTTURE (LIST STYLE) */}
        {tabIndex === 1 && (
          <List dense>
            {fixedPois.length === 0 && <Typography variant="body2" color="text.secondary">Nessuna struttura censita.</Typography>}
            {fixedPois.map(f => (
              <ListItem key={f.id} divider sx={{ px: 0 }}>
                <ListItemIcon sx={{ color: POI_TYPES[f.type].color, minWidth: 40 }}>
                  {POI_TYPES[f.type].icon}
                </ListItemIcon>
                <ListItemText 
                  primary={f.name} 
                  secondary={POI_TYPES[f.type].label} 
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* FOOTER: AZIONI RAPIDE */}
      <Box sx={{ p: 2, borderTop: '1px solid #eee', bgcolor: '#fafafa' }}>
        <Typography variant="caption" display="block" sx={{ mb: 1, fontWeight: 'bold' }}>AGGIUNGI NUOVO:</Typography>
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="contained" onClick={() => onAddPoi('vehicle')}>Veicolo</Button>
          <Button size="small" variant="outlined" onClick={() => onAddPoi('hub')}>Hub</Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default FloatingMenu;