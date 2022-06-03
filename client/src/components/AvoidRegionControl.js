import React from 'react';
import { Typography, Button } from '@mui/material';

const AvoidRegionControl = ({activateSelectionMode, canAdd, resetter}) => {

  if (canAdd){
    return (
        <div>
            <Typography variant='h4'>Avoid Region Control</Typography>
            <Button variant="contained" onClick={()=>{activateSelectionMode()}} >Add Region</Button>
        </div>
      )
  }else{
    return (
        <div>
            <Typography variant='h4'>Avoid Region Control</Typography>
            <Button variant="contained" onClick={()=>{resetter()}} >Reset Region</Button>
        </div>
      )
    }
}

export default AvoidRegionControl