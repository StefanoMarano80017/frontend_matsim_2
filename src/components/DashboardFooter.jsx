import React from 'react';
import { Box, Button, Stack, Typography, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

const DashboardFooter = ({ showHomeButton = true }) => {
  const navigate = useNavigate();

  if (!showHomeButton) return null;

  return (
    <Paper
      elevation={2}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        p: 2,
        borderRadius: 0,
        display: 'flex',
        justifyContent: 'center',
        bgcolor: '#fafafa',
        zIndex: 100,
      }}
    >
      <Button
        startIcon={<HomeIcon />}
        onClick={() => navigate('/')}
        variant="outlined"
        sx={{ minWidth: 200 }}
      >
        Back to Dashboard Selection
      </Button>
    </Paper>
  );
};

export default DashboardFooter;
