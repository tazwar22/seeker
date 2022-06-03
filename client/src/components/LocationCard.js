import React from 'react';
import { Typography } from '@mui/material';
import { useState } from 'react';


const LocationCard = ({location, travelMode}) => {

  const parseTime = (timestamp) => {
    const date = new Date(timestamp);
    const hour = date.getHours();
    const min = date.getMinutes();
    const seconds = date.getSeconds();
    const locale = date.toLocaleTimeString('en-us',{timeZoneName:'short'}).split(' ')[2];
    return `${hour}:${min}:${seconds} (${locale})`;
  }

  const parseTravelTime = (time) => {
    const minutes = Math.floor(time/60);
    const seconds = time - minutes*60;
    return `${minutes}m:${seconds}s`;
  }

  /*
  @param: distance (in meters)
  @returns: distance (in km)
  */
  const parseDistance = (dist)=>{
    return (dist/1000).toFixed(2);
  }
  
  if(location){
    return (
        <div style={{margin:20, padding:20, border:''}}>
            <Typography variant='h5'>Destination: {location.name} ({parseDistance(location.bestRouteSummary.lengthInMeters)} km away)</Typography>
            <Typography variant='h5'>Travelling by: {travelMode}</Typography>
            <Typography variant='h5'>Travel Time (minutes): {parseTravelTime(location.bestRouteSummary.travelTimeInSeconds)}</Typography>
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