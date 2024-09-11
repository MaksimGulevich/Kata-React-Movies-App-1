const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNzVhZjU1ZTM2MzRiMDlhYzQzOWNiMTczMmU1OWM3MiIsIm5iZiI6MTcyNTE3MTE0MS41MjU2NzMsInN1YiI6IjY2ZDQwMmU1NGM1OWFjYTQxZGI2MmU2OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.as1_FQXhrzYIcYh9-k2xmLPqVd0xWZMOIx8VHNo4HWo',
  },
}

export default class GetMovie {
  constructor(query) {
    this.query = query
  }

  async getResource() {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${this.query}&include_adult=false&language=en-US&page=1`,
      options
    )
    const body = await res.json()
    return body
  }

  // Получение массива жанров
  // async getGenre() {
  //   const res = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
  //   const body = await res.json()
  //   return body
  // }

  getOriginalTitle() {
    this.getResource().then((body) => body.results.forEach((item) => console.log(item.original_title)))
  }
}
