import React from 'react';
import { Typography, TextField, Button } from '@mui/material';

const SearchBoxWrapper = ({searchType, setter, actionFunction}) => {

  const placeholderText = `Enter ${searchType}...`

  const handleClick = () => {
    console.log('*** Handling action ***');
    actionFunction();
  }

  return (
    <div style={{backgroundColor:'', padding:2}}>
      <Typography sx={{marginBottom:0}} variant='h5'>{searchType}</Typography>
      <TextField sx={{height:10}} label={placeholderText} variant="outlined" onChange={(e)=>{setter(e.target.value)}} />
      <Button sx={{marginLeft:2, marginTop:1}} variant="contained" onClick={()=>{handleClick()}}>Search</Button>
    </div>
  )
}

export default SearchBoxWrapper;