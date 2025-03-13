import React from 'react';
import ClientSmartTable from './ClientSmartTable';
import { Box } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Typography } from '@mui/material';

function Client() {
  return (
    <Box p={2}>
     <Typography variant="h4">Client</Typography>
      <Typography>Voir vos clients ici<ArrowDropDownIcon/></Typography>
      <ClientSmartTable />
    </Box>
  );
}

export default Client;
