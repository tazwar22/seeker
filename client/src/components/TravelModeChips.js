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
            <Chip color='primary' label="Car" onClick={()=>{handleClick('Car')}}/>
            <Chip color='primary' label="Bus" onClick={()=>{handleClick('Bus')}}/>
            <Chip color='primary' label="Walking" onClick={()=>{handleClick('Pedestrian')}}/>
        </Stack>
    </div>
  )
}

export default TravelModeChips;