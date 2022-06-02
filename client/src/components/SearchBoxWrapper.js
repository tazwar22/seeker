import React from 'react';
import { Typography, TextField, Button } from '@mui/material';

const SearchBoxWrapper = ({searchType, setter, actionFunction}) => {

  const placeholderText = `Enter ${searchType}...`

  const handleClick = () => {
    console.log('*** Handling action ***');
    actionFunction();
  }

  return (
    <div>
      <Typography variant='h5'>{searchType}</Typography>
      <TextField label={placeholderText} variant="outlined" onChange={(e)=>{setter(e.target.value)}} />
      <Button variant="contained" onClick={()=>{handleClick()}}>Search</Button>
    </div>
  )
}

export default SearchBoxWrapper;