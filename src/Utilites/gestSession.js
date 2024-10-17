const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNzVhZjU1ZTM2MzRiMDlhYzQzOWNiMTczMmU1OWM3MiIsIm5iZiI6MTcyNzYwNjcxNC42MTY4MDEsInN1YiI6IjY2ZDQwMmU1NGM1OWFjYTQxZGI2MmU2OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.54z46DbnrFN5yhAeTFdx9AgaZLqb8Ma8SbmaCEswvxU',
  },
}

export default class GetGuestSession {
  constructor(sessionId) {
    this.sessionId = sessionId
  }

  async getSessionId() {
    if (!localStorage.getItem('sessionId')) {
      const res = await fetch('https://api.themoviedb.org/3/authentication/guest_session/new', options)
      // console.log(res)
      const response = await res.json()
      const sessionId = await response.guest_session_id
      localStorage.setItem('sessionId', sessionId)
      const dateCreation = new Date().getTime()
      localStorage.setItem('timeCreation', dateCreation)
      if (!localStorage.getItem('ratings')) {
        // Если его нет, записываем пустой объект
        localStorage.setItem('rated', JSON.stringify({}))
      }
      this.sessionId = sessionId
      // console.log('Если нет ID')
      return this.sessionId
    }
    const currentDate = new Date().getTime()
    const time = currentDate - 60 * 60 * 1000
    if (time >= localStorage.getItem('timeCreation')) {
      const res = await fetch('https://api.themoviedb.org/3/authentication/guest_session/new', options)
      const response = await res.json()
      const sessionId = await response.guest_session_id
      localStorage.setItem('timeCreation', currentDate)
      localStorage.setItem('sessionId', sessionId)
      localStorage.setItem('rated', JSON.stringify({}))

      // console.log('Если есть, но он истек ID')
      this.sessionId = sessionId
      return this.sessionId
    }
    // console.log('Если есть ID')
    this.sessionId = localStorage.getItem('sessionId')
    return this.sessionId
  }
}
