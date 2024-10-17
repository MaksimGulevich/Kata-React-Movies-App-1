import React, { useState, useEffect, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import { debounce } from 'lodash'
import { Pagination } from 'antd'

import MyContext from './MyContext'
import './index.css'
import FilmItem from './FilmItem/FilmItem'
import FilmList from './FilmList/FilmList'
import GetMovie from './Utilites/fetch'
import Search from './Search/Search'
import GetGuestSession from './Utilites/gestSession'
import ButtonsSearchRaited from './ButtonsSearchRaited/ButtonsSearchRaited'
import getRaited from './Utilites/getRaited'
import deleteRaited from './Utilites/deleteRaiting'
import getGenre from './Utilites/getGenre'
import getRatedFilms from './Utilites/getRatedFilms'

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

// Функция для сокращения строки описания фильма
function cutString(string, number) {
  let str = string
  while (str.length > number) {
    str = str.split(' ')
    str.pop()
    str = `${str.join(' ')}...`
  }
  return str
}

function App() {
  const [info, setInfo] = useState([])
  const [search, setSearch] = useState('')
  const [currentPages, setCurrentPages] = useState(1)
  const [currentRatedPage, setCurrentRatedPage] = useState(1)
  const [totalSearchedPages, setTotalSearchedPages] = useState()
  const [totalPagesRaited, setTotalPagesRaited] = useState()
  const [raitedFilm, setRaitedFilm] = useState([])
  const [menu, setMenu] = useState('search')
  const [genrus, setGenre] = useState([])
  const valuee = useMemo(() => ({ genrus }), [genrus])

  // Совершаем запрос гостевой сессии
  useEffect(() => {
    const gestSession = new GetGuestSession()

    gestSession.getSessionId()
  }, [])

  // добавление массива с жанрами

  useEffect(() => {
    getGenre()
      .then((genr) => genr.genres)
      .then((res) => {
        setGenre(res)
      })
  }, [])

  useEffect(() => {
    const movie = new GetMovie(`${search}`, `${currentPages}`)

    if (search.trim() === '') {
      setInfo([])
      return
    }

    movie
      .getResource()
      .then((body) => {
        setTotalSearchedPages(body.total_results)
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
          rated: element.vote_average.toFixed(1),
          rating: Number(
            raitedFilm
              .map((i) => {
                if (element.id === i.id) {
                  return i.rating
                }
                return JSON.parse(localStorage.getItem('rated'))[element.id]
                  ? JSON.parse(localStorage.getItem('rated'))[element.id]
                  : null
              })
              .join('')
          ),
          id: element.id,
          date: element.release_date,
          title: cutString(element.original_title, 60),
          overview: cutString(element.overview, 150),
          poster: element.poster_path,
          loading: true,
        }))
        setInfo(newInfo)
      })
      .catch((err) => console.log(err))
  }, [search, currentPages])

  // Создаем элемент  filmItem и задаем условие, что если данные из API получены,
  // то передаем их компоненту FilmItem
  let filmItem
  if (info !== null) {
    filmItem = info.map((item) => {
      const { id, ...itemProps } = item
      return (
        <FilmItem
          key={id}
          {...itemProps}
          onGetRaiting={(ratingValue) => {
            const rait = [...info]
            const newRatedItems = rait.map((ratedItem) => {
              if (ratingValue > 0) {
                if (ratedItem.id === id) {
                  getRaited(ratedItem.id, ratingValue)
                  const rated = JSON.parse(localStorage.getItem('rated'))
                  rated[ratedItem.id] = ratingValue
                  localStorage.setItem('rated', JSON.stringify(rated))
                  // setRaitedFilm((prev) => {
                  //   const findId = prev.find((p) => p.id === ratedItem.id)
                  //   if (findId) {
                  //     return prev.map((film) => (film.id === ratedItem.id ? { ...film, rating: ratingValue } : film))
                  //   }
                  //   return [...prev, { ...ratedItem, rating: ratingValue }]
                  // })
                  // setInfo((prev) => {
                  //   return prev.map((film) => (film.id === ratedItem.id ? { ...film, rating: ratingValue } : film))
                  // })
                  return ratedItem
                }
              } else if (ratedItem.id === id) {
                deleteRaited(ratedItem.id)
                const rated = JSON.parse(localStorage.getItem('rated'))
                delete rated[ratedItem.id]
                localStorage.setItem('rated', JSON.stringify(rated))
                setRaitedFilm((prev) => {
                  const filt = prev.filter((prevItem) => prevItem.id !== ratedItem.id)
                  return filt
                })
                return ratedItem
              }
              return ratedItem
            })

            return newRatedItems
          }}
        />
      )
    })
  }

  // Реализуем запрос из инпута и применяем debounce
  const handleChange = debounce((value) => {
    setSearch(value)
    setCurrentPages(1)
  }, 1000)

  useEffect(() => {
    // Ожидание в 1,5 секунду запрос
    const timeoutId = setTimeout(() => {
      getRatedFilms(currentRatedPage)
        .then((response) => {
          setTotalPagesRaited(response.total_results)
          return response.results
        })
        .then((res) => {
          if (res !== undefined) {
            const newRaited = res.map((element) => ({
              genre: element.genre_ids,
              rated: element.vote_average.toFixed(1),
              rating: element.rating,
              id: element.id,
              date: element.release_date,
              title: cutString(element.original_title, 60),
              overview: cutString(element.overview, 150),
              poster: element.poster_path,
              loading: true,
            }))
            setRaitedFilm(newRaited)
          }
        })
        .catch((err) => console.log('Ошибка при получении данных:', err))
    }, 1500)

    // Чистка таймера, если компонент размонтируется или флаг изменится
    return () => clearTimeout(timeoutId)
  }, [menu, currentRatedPage])

  let filmRaiting
  if (raitedFilm !== null) {
    filmRaiting = raitedFilm.map((item) => {
      const { id, ...itemProps } = item
      return (
        <FilmItem
          key={id}
          {...itemProps}
          onGetRaiting={(ratingValue) => {
            const rait = [...raitedFilm]
            const newRatedItems = rait.map((ratedItem) => {
              if (ratingValue > 0) {
                if (ratedItem.id === id) {
                  getRaited(ratedItem.id, ratingValue)
                  localStorage.setItem(`${ratedItem.id}`, ratingValue)
                  const rated = JSON.parse(localStorage.getItem('rated'))
                  rated[ratedItem.id] = ratingValue
                  localStorage.setItem('rated', JSON.stringify(rated))
                  // setRaitedFilm((prev) => {
                  //   const findId = prev.find((p) => p.id === ratedItem.id)
                  //   if (findId) {
                  //     return prev.map((film) => (film.id === ratedItem.id ? { ...film, rating: ratingValue } : film))
                  //   }
                  //   return [...prev, { ...ratedItem, rating: ratingValue }]
                  // })
                  // if (info) {
                  //   setInfo((prev) => {
                  //     return prev.map((film) => (film.id === ratedItem.id ? { ...film, rating: ratingValue } : film))
                  //   })
                  // }
                  return ratedItem
                }
              } else if (ratedItem.id === id) {
                deleteRaited(ratedItem.id)
                const rated = JSON.parse(localStorage.getItem('rated'))
                delete rated[ratedItem.id]
                localStorage.setItem('rated', JSON.stringify(rated))
                if (info) {
                  setInfo((prev) => {
                    const findId = prev.find((prevItem) => prevItem.id === ratedItem.id)
                    if (findId) {
                      return prev.map((film) => (film.id === ratedItem.id ? { ...film, rating: ratingValue } : film))
                    }
                    return prev
                  })
                }
                setRaitedFilm((prev) => {
                  const filt = prev.filter((prevItem) => prevItem.id !== ratedItem.id)
                  return filt
                })
                // Если удаляем элемент с n-ой страницы и он на ней последний, то нас перебрасывает
                // на предыдущую страницу
                setCurrentRatedPage((prev) => prev > 1 && prev - 1)
                return ratedItem
              }
              return ratedItem
            })
            return newRatedItems
          }}
        />
      )
    })
  }

  if (filmRaiting.length === 0) {
    filmRaiting = undefined
  }

  // Задаем переменную для поиска найденных фильмов, либо  оцененных
  let searchOrRatedFilms
  // Задаем переменные для написания логики пагинации
  let currentPage
  let totalPages
  let onChanges
  // Прописываем логику для отображения найденных или оцененных фильмов, а так же логику
  // отображения пагинации в зависимости от того, какая вкладка открыта Search или Rated
  if (menu === 'search') {
    searchOrRatedFilms = filmItem
    currentPage = currentPages
    totalPages = totalSearchedPages
    onChanges = setCurrentPages
  } else if (menu === 'rated') {
    searchOrRatedFilms = filmRaiting
    currentPage = currentRatedPage
    totalPages = totalPagesRaited
    onChanges = setCurrentRatedPage
  }

  // Задаем классс и условие для скрытия или отображения пагинации

  let clazzName = 'pagination'
  if (!searchOrRatedFilms || searchOrRatedFilms.length === 0) {
    clazzName = 'pagination_none'
  }

  return (
    <main className="main">
      <ButtonsSearchRaited isFilter={menu} onSearh={() => setMenu('search')} onRaited={() => setMenu('rated')} />
      {menu === 'search' && <Search onChange={handleChange} />}
      <MyContext.Provider value={valuee}>
        <FilmList>{searchOrRatedFilms}</FilmList>
      </MyContext.Provider>
      <Pagination
        defaultPageSize={20}
        className={clazzName}
        align="center"
        current={currentPage}
        onChange={onChanges}
        total={totalPages}
      />
    </main>
  )
}
const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

root.render(<App />)
