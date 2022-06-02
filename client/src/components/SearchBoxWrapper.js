import React from 'react';

const SearchBoxWrapper = ({searchType, setter, actionFunction}) => {

  const placeholderText = `Enter ${searchType}...`

  const handleClick = () => {
    console.log('*** Handling action ***');
    actionFunction();
  }

  return (
    <div>
      <h4>{searchType}</h4>
      <input placeholder={placeholderText} onChange={(e)=>{setter(e.target.value)}}></input>
      <button onClick={()=>{handleClick()}}>Search</button>
    </div>
  )
}

export default SearchBoxWrapper;