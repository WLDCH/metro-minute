import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ width: '100%', mt: 'auto' }}>
      <Box sx={{ backgroundColor: '#1a73e8', height: '1px', width: '100%' }} />
      <Box sx={{ backgroundColor: '#5a96e3', color: 'white', padding: '20px 0', width: '100%', position: 'relative', top: '-1px' }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Box sx={{ marginBottom: 2 }}>
            <img src='/static/images/logo.png' alt="Logo" style={{ width: '100px' }} />
          </Box>
          <Typography variant="body2">
            Copyright © 2024 Metro-Minute (v2) - All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;
