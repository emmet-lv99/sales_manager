import * as Excel from 'exceljs'
import { useEffect, useState } from 'react'

const workbook = new Excel.Workbook()

export const Page = () => {
  const [message, setMessage] = useState(null)
  const [fileObj, setFileObj] = useState(null)

  useEffect(() => {
    window.myPreload.tmp(setMessage)
  }, [])

  const handleClick = () => {
    window.myPreload.copyFile()
  }

  return (
    // TODO: UI 디자인
    <div className="App">
      <div>{`This app is using Chrome (v${window.versions.chrome()}), Node.js (v${window.versions.node()}), and Electron (v${window.versions.electron()})`}</div>
      <button onClick={handleClick}>Click me</button>
      <>{message}</>
    </div>
  )
}

export default Page
