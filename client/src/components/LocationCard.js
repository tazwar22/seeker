import React from 'react';
import { Typography } from '@mui/material';
import { useState } from 'react';


const LocationCard = ({location}) => {

  const parseTime = (timestamp) => {
      return new Date(timestamp).toString();
  }
  
  if(location){
    return (
        <div style={{margin:20, padding:20, border:'1px solid black'}}>
            <Typography variant='h5'>Destination: {location.name} ({location.bestRouteSummary.lengthInMeters/1000} km away)</Typography>
            <Typography variant='h5'>Travel Time (minutes): {location.bestRouteSummary.travelTimeInSeconds/60}</Typography>
            <Typography variant='h6'>Start: {parseTime(location.bestRouteSummary.departureTime)}</Typography>
            <Typography variant='h6'>Arrive: {parseTime(location.bestRouteSummary.arrivalTime)}</Typography>
        </div>
      )
  }else{
    return (
        <div style={{margin:20, padding:20}}>
        </div>
      )
  }
}

export default LocationCard