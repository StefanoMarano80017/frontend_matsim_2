import React, { useState } from 'react';
import { 
  Card, CardContent, CardActions, Typography, Box, 
  LinearProgress, Collapse, List, ListItem, ListItemText, IconButton 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Componente stilizzato per l'icona di espansione
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const countOccupiedByType = (hub, type) => {
  if (!hub || !hub.chargers) return 0;

  return hub.chargers.filter(charger => {
    const isRightType = charger.type?.toLowerCase() === type.toLowerCase();
    
    // Un caricatore è considerato occupato se:
    // 1. Il flag occupied è true
    // 2. OPPURE c'è un evId presente (veicolo connesso)
    const isOccupied = charger.occupied === true || 
                       (charger.evId !== null && charger.evId !== undefined && charger.evId !== "");
    
    return isRightType && isOccupied;
  }).length;
};


const HubCard = ({ hub }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // Logica di calcolo occupazione
  const normalCount = countOccupiedByType(hub, 'normal');
  const fastCount = countOccupiedByType(hub, 'fast');

  const normalOccupancy = normalCount / (hub.totalCapacity?.normal || 1);
  const fastOccupancy = fastCount / (hub.totalCapacity?.fast || 1);
  const isSaturated = normalOccupancy >= 1 || fastOccupancy >= 1;

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 2, // Margine tra le card
        p:0,
        borderLeft: isSaturated ? '4px solid #f44336' : '4px solid #4caf50',
      }}
    >
      <CardContent sx={{ p: 0}}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ px: 2, py:0.8}}>
          {hub.name}
        </Typography>

        <List dense sx={{maxHeight: 300, overflowY: 'auto', p:0}}>
          {hub.chargers && hub.chargers.length > 0 ? (
            hub.chargers.map((charger, idx) => (
              <ListItem
                key={charger.id || idx}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#f5f5f5' },
                  py:0
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ width: 24, fontWeight: 600, color: 'text.secondary' }}
                >
                  {idx + 1}.
                </Typography>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" fontWeight={600}>{charger.type?.toUpperCase() || 'N/A'}</Typography>
                      <Typography variant="caption" color="text.secondary">
                       {charger.chargingEnergy || 0} /{charger.plugPowerKw ? `${charger.plugPowerKw} kW` : 'n.d.'}
                        {charger.active === false && ' (OFF)'}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {charger.occupied ? `Occupato${charger.evId ? ` da ${charger.evId}` : ''}` : 'Libero'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {charger.energy || 0} kWh
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary={<Typography variant="caption" color="text.secondary">Nessun caricatore presente</Typography>} />
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  );
};

export default HubCard;