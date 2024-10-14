import React, { useState, useEffect, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import { debounce } from 'lodash'
import { Pagination } from 'antd'

import MyContext from './MyContext'
import './index.css'
import FilmItem from './FilmItem/FilmItem'
import FilmList from './FilmList/FilmList'
import GetMovie from './fetch'
import Search from './Search/Search'
import GetGuestSession from './gestSession'
import ButtonsSearchRaited from './ButtonsSearchRaited/ButtonsSearchRaited'
import getRaited from './getRaiting'
import deleteRaited from './deleteRaiting'
import getGenre from './getGenre'

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
  const [current, setCurrent] = useState(1)
  const [currentRaited, setCurrentRaited] = useState(1)
  const [totalPages, setTotalPages] = useState()
  const [totalPagesRaited, setTotalPagesRaited] = useState()
  const [raitedFilm, setRaitedFilm] = useState([])
  const [menu, setMenu] = useState('search')
  const [genrus, setGenre] = useState([])

  const valuee = useMemo(() => ({ genrus }), [genrus])
  // добавление массива с жанрами

  useEffect(() => {
    getGenre()
      .then((genr) => genr.genres)
      .then((res) => {
        setGenre(res)
      })
  }, [])

  /// / ///////////
  useEffect(() => {
    const gestSession = new GetGuestSession()

    gestSession.getSessionId()
  }, [])

  /// Функция для установки текущей страницы списка найденных фильмов
  const onChange = (page) => {
    setCurrent(page)
  }
  /// Функция для установки текущей страницы списка оцененных фильмов
  const onChangeRaited = (page) => {
    console.log(page)
    setCurrentRaited(page)
  }

  useEffect(() => {
    const movie = new GetMovie(`${search}`, `${current}`)

    if (search.trim() === '') {
      setInfo([])
      return
    }

    movie
      .getResource()
      .then((body) => {
        setTotalPages(body.total_results)
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
                return null
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
  }, [search, current])

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
          onGetRaiting={(v) => {
            const rait = [...info]
            const a = rait.map((ii) => {
              if (v > 0) {
                if (ii.id === id) {
                  getRaited(ii.id, v)
                  setRaitedFilm((prev) => {
                    const findId = prev.find((p) => p.id === ii.id)
                    if (findId) {
                      return prev.map((film) => (film.id === ii.id ? { ...film, rating: v } : film))
                    }
                    return [...prev, { ...ii, rating: v }]
                  })
                  setInfo((prev) => {
                    return prev.map((film) => (film.id === ii.id ? { ...film, rating: v } : film))
                  })
                  return ii
                }
              } else if (ii.id === id) {
                deleteRaited(ii.id, v)
                setRaitedFilm((p) => {
                  const filt = p.filter((ps) => ps.id !== ii.id)
                  return filt
                })
                return ii
              }
              return ii
            })

            return a
          }}
        />
      )
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

  useEffect(() => {
    const optionssss = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNzVhZjU1ZTM2MzRiMDlhYzQzOWNiMTczMmU1OWM3MiIsIm5iZiI6MTcyNzYwNjcxNC42MTY4MDEsInN1YiI6IjY2ZDQwMmU1NGM1OWFjYTQxZGI2MmU2OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.54z46DbnrFN5yhAeTFdx9AgaZLqb8Ma8SbmaCEswvxU',
      },
    }

    fetch(
      `https://api.themoviedb.org/3/guest_session/${localStorage.getItem('sessionId')}/rated/movies?language=en-US&page=${currentRaited}&sort_by=created_at.asc`,
      optionssss
    )
      .then((response) => {
        if (response.status >= 400 && response.status <= 499) {
          console.log('Извините, избранных фильмов не найдено!')
          return []
        }
        if (!response.ok) {
          throw new Error('Произошла ошибка при загрузке данных.')
        }

        return response.json()
      })
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
            title: cutString(element.original_title, 40),
            overview: cutString(element.overview, 150),
            poster: element.poster_path,
            loading: true,
          }))
          setRaitedFilm(newRaited)
        }
      })
      .catch((err) => console.log('Ошибка при получении данных:', err))
  }, [
    // raitedFilm,
    currentRaited,
  ])

  let filmRaiting
  if (raitedFilm !== null) {
    filmRaiting = raitedFilm.map((item) => {
      const { id, ...itemProps } = item
      return (
        <FilmItem
          key={id}
          {...itemProps}
          onGetRaiting={(v) => {
            const rait = [...raitedFilm]
            const a = rait.map((ii) => {
              if (v > 0) {
                if (ii.id === id) {
                  getRaited(ii.id, v)
                  setRaitedFilm((prev) => {
                    const findId = prev.find((p) => p.id === ii.id)
                    if (findId) {
                      return prev.map((film) => (film.id === ii.id ? { ...film, rating: v } : film))
                    }
                    return [...prev, { ...ii, rating: v }]
                  })
                  if (info) {
                    setInfo((prev) => {
                      return prev.map((film) => (film.id === ii.id ? { ...film, rating: v } : film))
                    })
                  }
                  return ii
                }
              } else if (ii.id === id) {
                deleteRaited(ii.id, v)
                if (info) {
                  setInfo((prev) => {
                    const findId = prev.find((p) => p.id === ii.id)
                    if (findId) {
                      return prev.map((film) => (film.id === ii.id ? { ...film, rating: v } : film))
                    }
                    return prev
                  })
                }
                setRaitedFilm((p) => {
                  const filt = p.filter((ps) => ps.id !== ii.id)
                  return filt
                })
                return ii
              }
              return ii
            })
            return a
          }}
        />
      )
    })
  }

  if (filmRaiting.length === 0) {
    filmRaiting = undefined
  }

  let clazzName = 'pagination'
  if (!filmRaiting || filmRaiting.length === 0) {
    clazzName = 'pagination_none'
  }
  let abc
  if (menu === 'search') {
    abc = filmItem
  } else if (menu === 'rated') {
    abc = filmRaiting
  }
  return (
    <main className="main">
      <ButtonsSearchRaited isFilter={menu} onSearh={() => setMenu('search')} onRaited={() => setMenu('rated')} />
      {menu === 'search' && <Search onChange={handleChange} />}
      <MyContext.Provider value={valuee}>
        <FilmList>{abc}</FilmList>
      </MyContext.Provider>
      {menu === 'rated' && (
        <Pagination
          defaultPageSize={20}
          className={clazzName}
          align="center"
          current={currentRaited}
          onChange={onChangeRaited}
          total={totalPagesRaited}
        />
      )}
      {menu === 'search' && (
        <Pagination
          defaultPageSize={20}
          className={clazName}
          align="center"
          current={current}
          onChange={onChange}
          total={totalPages}
        />
      )}
    </main>
  )
}
const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

root.render(<App />)
