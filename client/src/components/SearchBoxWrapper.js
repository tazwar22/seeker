import React from 'react';

const SearchBoxWrapper = ({destinationSetter, searchFunction}) => {

  const handleClick = () => {
    console.log('*** Searching... ***');
    searchFunction();
  }

  return (
    <div>
      <input placeholder='Enter Destination...' onChange={(e)=>{destinationSetter(e.target.value)}}></input>
      <button onClick={()=>{handleClick()}}>Search</button>
    </div>
  )
}

export default SearchBoxWrapper;