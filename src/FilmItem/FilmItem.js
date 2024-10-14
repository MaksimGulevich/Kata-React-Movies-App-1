import React, {
  useContext,
  useState,
  // , useEffect
} from 'react'
import { format, parseISO } from 'date-fns'
import { Spin, Alert, Rate } from 'antd'

import './FilmItem.css'
import MyContext from '../MyContext'
// import getGenre from '../getGenre'

function FilmItem({ genre, title, overview, date, poster, rated, rating, onGetRaiting }) {
  const [isLoaded, setLoadImg] = useState(false)
  // const [genrus, setGenrus] = useState([])
  const { genrus } = useContext(MyContext)
  const handleImgLoad = () => {
    setLoadImg(true)
  }

  const genreNames = genre.map((ids) => {
    const a = genrus.map((g) => {
      if (ids === g.id) {
        return (
          <p key={g.name} className="card__genre">
            {g.name}
          </p>
        )
      }
      return null
    })
    return a
  })
  let formattedDate
  if (!date) {
    formattedDate = 'Описание отсутствует' // или любое другое значение по умолчанию
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

  let classNameCircle
  if (rated <= 3) {
    classNameCircle = 'red'
  } else if (rated > 3 && rated <= 5) {
    classNameCircle = 'orange'
  } else if (rated > 5 && rated <= 7) {
    classNameCircle = 'yellow'
  } else {
    classNameCircle = 'green'
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
        {genreNames}
      </div>
      <div className="card__description_and_rate">
        <p className="card__description">{overview}</p>
        <Rate allowHalf className="card__rate" defaultValue={rating} count={10} onChange={onGetRaiting} />
      </div>
      <div className={`card__circle ${classNameCircle}`}>
        <span className="card__ratenumber">{rated === '10.0' ? '10' : rated}</span>
      </div>
    </section>
  )
}

export default FilmItem
