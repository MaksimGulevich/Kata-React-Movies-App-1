import React from 'react'
import './FilmList.css'
import { Alert } from 'antd'

function FilmList({ children }) {
  let clazzName = 'filmList'
  if (!children) {
    clazzName = 'filmList_block'
  }
  return (
    <div className={clazzName}>
      {!children ? <Alert className="alert" message="К сожалению, ничего не удалось найти=(" type="info" /> : children}
    </div>
  )
}

export default FilmList
