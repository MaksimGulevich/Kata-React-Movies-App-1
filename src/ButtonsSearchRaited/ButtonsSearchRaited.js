import React from 'react'
import './ButtonsSearchRaited.css'
import PropTypes from 'prop-types'

export default function ButtonsSearchRaited({ onSearh, onRaited, isFilter }) {
  const button = [
    { name: 'search', label: 'Search' },
    { name: 'rated', label: 'Rated' },
  ]

  const buttons = button.map(({ name, label }) => {
    const isActive = isFilter === name
    let clasName
    if (isActive === true) {
      clasName = 'selected'
    }

    let searchOrRaited

    if (name === 'search') {
      searchOrRaited = onSearh
    } else if (name === 'rated') {
      searchOrRaited = onRaited
    }

    return (
      <li key={name}>
        <button type="button" className={`button ${clasName}`} onClick={() => searchOrRaited()}>
          {label}
        </button>
      </li>
    )
  })
  let dinamicClass
  if (isFilter === 'search') {
    dinamicClass = 'transL'
  } else if (isFilter === 'rated') {
    dinamicClass = 'transR'
  }
  return (
    <div className="button_box">
      <ul className="buttons">{buttons}</ul>
      <div className={`trans ${dinamicClass}`} />
    </div>
  )
}

ButtonsSearchRaited.propTypes = {
  onSearh: PropTypes.func.isRequired,
  onRaited: PropTypes.func.isRequired,
  isFilter: PropTypes.string.isRequired,
}
