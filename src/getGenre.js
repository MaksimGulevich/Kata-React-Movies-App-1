// Функция фетч запроса списка жанров
export default async function getGenre() {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNzVhZjU1ZTM2MzRiMDlhYzQzOWNiMTczMmU1OWM3MiIsIm5iZiI6MTcyNTE3MTE0MS41MjU2NzMsInN1YiI6IjY2ZDQwMmU1NGM1OWFjYTQxZGI2MmU2OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.as1_FQXhrzYIcYh9-k2xmLPqVd0xWZMOIx8VHNo4HWo',
    },
  }
  const res = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
  const body = await res.json()
  return body
}
