export default async function getRatedFilm(currentRaited) {
  const optionssss = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNzVhZjU1ZTM2MzRiMDlhYzQzOWNiMTczMmU1OWM3MiIsIm5iZiI6MTcyNzYwNjcxNC42MTY4MDEsInN1YiI6IjY2ZDQwMmU1NGM1OWFjYTQxZGI2MmU2OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.54z46DbnrFN5yhAeTFdx9AgaZLqb8Ma8SbmaCEswvxU',
    },
  }

  return fetch(
    `https://api.themoviedb.org/3/guest_session/${localStorage.getItem('sessionId')}/rated/movies?language=en-US&page=${currentRaited}&sort_by=created_at.asc`,
    optionssss
  ).then((response) => {
    if (response.status >= 400 && response.status <= 499) {
      console.log('Извините, избранных фильмов не найдено!')
      return []
    }
    if (!response.ok) {
      throw new Error('Произошла ошибка при загрузке данных.')
    }

    return response.json()
  })
}
