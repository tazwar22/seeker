import React from 'react'
import { Typography, Stack, Chip} from '@mui/material';

const TravelModeChips = ({modeSetter}) => {

  const handleClick = (mode)=>{
    console.log('Travel Mode... \n');
    console.log(mode);
    modeSetter(mode);
  };

  return (
    <div>
        <Typography variant='h5'>Select Travel Mode: </Typography>
        <Stack direction="row" spacing={2}>
            <Chip label="Car" onClick={()=>{handleClick('car')}}/>
            <Chip label="Bus" onClick={()=>{handleClick('bus')}}/>
            <Chip label="Walking" onClick={()=>{handleClick('pedestrian')}}/>
        </Stack>
    </div>
  )
}

export default TravelModeChips;