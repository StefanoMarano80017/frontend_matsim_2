import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Chip,
  Paper,
  Stack,
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EvStationIcon from '@mui/icons-material/EvStation';
import TimelineIcon from '@mui/icons-material/Timeline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WifiIcon from '@mui/icons-material/Wifi';
import { useSystemStatus } from '../hooks/useSystemStatus'; 

import bannerImage from '../assets/SCH_logo.png'; 

const DashboardSelection = () => {
  const navigate = useNavigate();
  
  // Sostituisci l'URL con il tuo endpoint API reale
  // const UserStatus = useSystemStatus('prova'); 
  // const isUserOnline = UserStatus.online;
  const isUserOnline        = true;
  const isSimulationOnline  = true;
  const isHubOnline         = true;

  // Mock per lo stato dei servizi
  const isSystemOnline = isUserOnline && isSimulationOnline && isHubOnline;

  const dashboards = [
    {
      id: 'user',
      title: 'User Dashboard',
      description: 'Pianifica la tua ricarica',
      icon: <DirectionsCarIcon sx={{ fontSize: 40, color: '#2196f3' }} />,
      route: '/user/dashboard',
      enabled: isUserOnline,
      badge: null,
    },
    {
      id: 'simulation',
      title: 'Simulation Dashboard',
      description: 'Configura e monitora simulazioni multi-veicolo',
      icon: <TimelineIcon sx={{ fontSize: 40, color: '#4caf50' }} />,
      route: '/simulation/setup',
      enabled: isSimulationOnline,
      badge:  null,
    },
    {
      id: 'hub-manager',
      title: 'Hub Manager Dashboard',
      description: 'Gestisci hub di ricarica e monitora l\'occupazione',
      icon: <EvStationIcon sx={{ fontSize: 40, color: '#ff9800' }} />,
      route: '/hub/dashboard',
      enabled: isHubOnline,
      badge: null,
    },
  ];

  return (
    <Box sx={{ 
      width: '100%', 
      minHeight: '100vh', 
      bgcolor: 'background.default',
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }}>
      
      {/* 1. SEZIONE BANNER HERO */}
      <Box sx={{ 
        width: '100%', 
        height: { xs: 200, md: 300 }, 
        paddingBottom: 5,
        // --- USA L'IMMAGINE IMPORTATA ---
        backgroundImage: `url(${bannerImage})`,
        // -------------------------------------------
        backgroundSize: 'cover', // 'cover' riempirà il box, 'contain' mostrerà tutta l'immagine senza tagliarla
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end',
        borderBottom: 3,
        borderColor: '#0056b3'
      }}>
      </Box>

      {/* Container principale */}
      <Box sx={{ px: { xs: 2, md: 6 }, maxWidth: '1600px', mx: 'auto', width: '100%' }}>
        
        {/* 2. SEZIONE STATUS BOX (Invariata) */}
        <Paper 
          elevation={0} 
          variant="outlined" 
          sx={{ 
            p: 2, 
            mb: 4, 
            borderRadius: 2, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            bgcolor: isSystemOnline ? 'rgba(76, 175, 80, 0.04)' : 'rgba(244, 67, 54, 0.04)',
            borderColor: isSystemOnline ? 'success.light' : 'error.light'
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ 
              position: 'relative', 
              display: 'flex', 
              width: 44, height: 44, 
              borderRadius: '50%', 
              bgcolor: isSystemOnline ? 'success.main' : 'error.main',
              color: 'white',
              alignItems: 'center', 
              justifyContent: 'center'
            }}>
              <WifiIcon />
              {isSystemOnline && (
                <Box sx={{
                  position: 'absolute',
                  width: '100%', height: '100%',
                  borderRadius: '50%',
                  border: '2px solid',
                  borderColor: 'success.main',
                  animation: 'ripple 1.5s infinite ease-in-out',
                  '@keyframes ripple': {
                    '0%': { transform: 'scale(.8)', opacity: 1 },
                    '100%': { transform: 'scale(1.8)', opacity: 0 }
                  }
                }} />
              )}
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                System Status
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isSystemOnline 
                  ? "Tutti i servizi sono operativi e online." 
                  : "Attenzione: alcuni servizi potrebbero non essere disponibili."}
              </Typography>
            </Box>
          </Stack>
          
          <Chip 
            icon={isSystemOnline ? <CheckCircleIcon /> : <ErrorIcon />} 
            label={isSystemOnline ? "Online" : "Issues Detected"} 
            color={isSystemOnline ? "success" : "error"} 
            variant="outlined"
          />
        </Paper>

        {/* 3. SEZIONE DASHBOARD CARDS (Invariata) */}
        <Stack direction="row" spacing={2} alignItems="center">
            {dashboards.map((dashboard) => (
              <Card
                variant="outlined"
                onClick={() => dashboard.enabled && navigate(dashboard.route)}
                sx={{
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  opacity: dashboard.enabled ? 1 : 0.7,
                  cursor: dashboard.enabled ? 'pointer' : 'not-allowed',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': dashboard.enabled ? {
                    borderColor: 'primary.main',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                    transform: 'translateY(-6px)'
                  } : {},
                }}
              >
                <CardContent sx={{ p: 4, flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 2, 
                      bgcolor: 'action.hover',
                      display: 'flex'
                    }}>
                      {dashboard.icon}
                    </Box>
                    {dashboard.badge && (
                      <Chip label={dashboard.badge} color="primary" size="small" sx={{ fontWeight: 'bold' }} />
                    )}
                  </Box>

                  <Typography variant="h5" fontWeight="700" gutterBottom>
                    {dashboard.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                    {dashboard.description}
                  </Typography>
                </CardContent>
                
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button 
                    fullWidth 
                    variant={dashboard.enabled ? "contained" : "outlined"}
                    disabled={!dashboard.enabled}
                    disableElevation
                    sx={{ 
                      borderRadius: 2, 
                      py: 1,
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    {dashboard.enabled ? 'Accedi' : 'Non disponibile'}
                  </Button>
                </CardActions>
              </Card>
            ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default DashboardSelection;