import React, { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { Spin, Alert } from 'antd'

import './FilmItem.css'

function FilmItem({ title, overview, date, poster }) {
  const [isLoaded, setLoadImg] = useState(false)

  const handleImgLoad = () => {
    setLoadImg(true)
  }

  let formattedDate
  if (!date) {
    formattedDate = 'Неизвестно' // или любое другое значение по умолчанию
  } else {
    const newDate = parseISO(date)
    formattedDate = format(newDate, 'MMMM d, yyyy')
  }
  let alert
  if (poster === null) {
    alert = <Alert message="Изображение отсутствует" type="warning" />
  } else if (!isLoaded) {
    alert = <Spin size="large" />
  }

  return (
    <section className="card">
      <div className="card__imgbox">
        {alert}
        <img
          className="card__img"
          src={`https://image.tmdb.org/t/p/original${poster}`}
          alt={`картинка к фильму ${title}`}
          style={{ display: isLoaded ? 'block' : 'none' }}
          onLoad={handleImgLoad}
        />
      </div>
      <div className="card__information">
        <h2 className="card__title">{title}</h2>
        <p className="card__date">{formattedDate}</p>
        <p className="card__genre">Drama</p>
        <p className="card__genre">Action</p>
        <p className="card__description">{overview}</p>
      </div>
    </section>
  )
}

export default FilmItem
