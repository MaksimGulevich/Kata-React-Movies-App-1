import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'

import FilmItem from './FilmItem/FilmItem'
import FilmList from './FilmList/FilmList'
import GetMovie from './fetch'

// window.addEventListener('offline', () => {
//   console.log('offline')
// })

// window.addEventListener('online', () => {
//   console.log('online')
// })

window.addEventListener('load', () => {
  const handleNetworkChange = () => {
    if (navigator.onLine) {
      console.log('Онлайн')
    } else {
      throw new Error('Отсутствует подключения к сети интернет')
    }
  }

  window.addEventListener('online', handleNetworkChange)
  window.addEventListener('offline', handleNetworkChange)
})

const movie = new GetMovie('pirates')

// Функция для сокращения строки описания фильма
function cutString(string) {
  let str = string
  while (str.length > 330) {
    str = str.split(' ')
    str.pop()
    str = str.join(' ')
  }
  return str
}

function App() {
  const [info, setInfo] = useState([])

  // добавление массива с жанрами
  // const [genre, setGenre] = useState([])

  // useEffect(() => {
  //   movie
  //     .getGenre()
  //     .then((genr) => genr.genres)
  //     .then((res) => {
  //       console.log(res)
  //       setGenre(res)
  //     })
  // }, [])

  useEffect(() => {
    movie
      .getResource()
      .then((body) => body.results)
      .then((res) => {
        console.log(res)
        res.forEach((element) => {
          setInfo((prev) => [
            ...prev,
            {
              genre: element.genre_ids,
              id: element.id,
              date: element.release_date,
              title: element.original_title,
              overview: cutString(element.overview),
              poster: element.poster_path,
              loading: true,
            },
          ])
        })
      })
      .catch((err) => console.log(err))
  }, [])

  const filmItem = info.map((item) => {
    const { id, ...itemProps } = item
    return <FilmItem key={id} {...itemProps} />
  })
  return <FilmList>{filmItem}</FilmList>
}
const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

root.render(<App />)
