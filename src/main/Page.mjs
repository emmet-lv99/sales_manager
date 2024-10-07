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

  const handleExcel = async () => {
    const file =
      '/Users/gimdachan/Downloads/2023 연말정산 체크리스트(작성 후 제출요청)_copied.xlsx'
  }

  const handleInputFile = e => {
    setFileObj(e.target.files[0])
    const reader = new FileReader()
    const tmp = reader.readAsArrayBuffer(fileObj)
    alert(tmp)
  }

  return (
    <div className="App">
      <div>{`This app is using Chrome (v${window.versions.chrome()}), Node.js (v${window.versions.node()}), and Electron (v${window.versions.electron()})`}</div>
      <button onClick={handleClick}>Click me</button>
      <>{message}</>
      <button onClick={handleExcel}>Excel</button>
      <input type="file" onChange={handleInputFile} />
    </div>
  )
}

export default Page
