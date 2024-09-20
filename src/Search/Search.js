import React from 'react'
import './Search.css'

function Search({ onChange }) {
  const onChanges = (event) => {
    onChange(event.target.value)
  }
  return <input className="input" type="text" placeholder="Type to search..." onChange={onChanges} />
}

export default Search
