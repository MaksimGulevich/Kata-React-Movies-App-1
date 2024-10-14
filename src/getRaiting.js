export default async function getRaited(id, value) {
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNzVhZjU1ZTM2MzRiMDlhYzQzOWNiMTczMmU1OWM3MiIsIm5iZiI6MTcyNzYwNjcxNC42MTY4MDEsInN1YiI6IjY2ZDQwMmU1NGM1OWFjYTQxZGI2MmU2OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.54z46DbnrFN5yhAeTFdx9AgaZLqb8Ma8SbmaCEswvxU',
    },
    body: JSON.stringify({ value }),
  }
  fetch(
    `https://api.themoviedb.org/3/movie/${id}/rating?guest_session_id=${localStorage.getItem('sessionId')}`,
    options
  )
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((err) => console.error(err))
}
