import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { debounce } from 'lodash'
import { Pagination } from 'antd'

import './index.css'
import FilmItem from './FilmItem/FilmItem'
import FilmList from './FilmList/FilmList'
import GetMovie from './fetch'
import Search from './Search/Search'

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

// const movie = new GetMovie({ search })

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
  const [search, setSearch] = useState('')
  const [current, setCurrent] = useState(1)
  const [totalPages, setTotalPages] = useState()

  const onChange = (page) => {
    console.log(page)
    setCurrent(page)
  }
  console.log(current)
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
    const movie = new GetMovie(`${search}`, `${current}`)

    if (search.trim() === '') {
      setInfo([])
      return
    }

    movie
      .getResource()
      .then((body) => {
        setTotalPages(body.total_pages)
        return body.results
      })
      .then((res) => {
        // Если длина полученного массива из API равна 0, то  записываем null в useState
        if (res.length === 0) {
          setInfo(null)
          return
        }

        const newInfo = res.map((element) => ({
          genre: element.genre_ids,
          id: element.id,
          date: element.release_date,
          title: element.original_title,
          overview: cutString(element.overview),
          poster: element.poster_path,
          loading: true,
        }))
        setInfo(newInfo)
      })
      .catch((err) => console.log(err))
  }, [search, current])

  // Создаем элемент  filmItem и задаем условие, что если данные из API получены,
  // то передаем их компоненту FilmItem
  let filmItem
  if (info !== null) {
    filmItem = info.map((item) => {
      const { id, ...itemProps } = item
      return <FilmItem key={id} {...itemProps} />
    })
  }

  // Реализуем запрос из инпута и применяем debounce
  const handleChange = debounce((value) => {
    setSearch(value)
    setCurrent(1)
  }, 1000)

  // Задаем классс и условие для пагинации
  let clazName = 'pagination'
  if (!filmItem || filmItem.length === 0) {
    clazName = 'pagination_none'
  }

  return (
    <main className="main">
      <Search onChange={handleChange} />
      <FilmList>{filmItem}</FilmList>
      <Pagination className={clazName} align="center" current={current} onChange={onChange} total={totalPages} />
    </main>
  )
}
const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

root.render(<App />)
