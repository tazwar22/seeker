import React from 'react';
import { Typography, Button } from '@mui/material';

const AvoidRegionControl = ({activateSelectionMode, canAdd, resetter}) => {

  if (canAdd){
    return (
        <div style={{backgroundColor:'', marginTop:2, marginBottom:2, padding:20}}>
            <Typography variant='h5'>Avoid Region Control</Typography>
            <Button variant="contained" color='success' onClick={()=>{activateSelectionMode()}} >Add Region</Button>
        </div>
      )
  }else{
    return (
        <div style={{backgroundColor:'', marginTop:2, marginBottom:2, padding:20}}>
            <Typography variant='h5'>Avoid Region Control</Typography>
            <Button variant="contained" color='error' onClick={()=>{resetter()}} >Reset Region</Button>
        </div>
      )
    }
}

export default AvoidRegionControl