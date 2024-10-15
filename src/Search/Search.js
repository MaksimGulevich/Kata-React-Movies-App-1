import React from 'react'
import './Search.css'
import PropTypes from 'prop-types'

function Search({ onChange }) {
  const onChanges = (event) => {
    onChange(event.target.value)
  }
  return <input className="input" type="text" placeholder="Type to search..." onChange={onChanges} />
}

export default Search

Search.propTypes = {
  onChange: PropTypes.func,
}
