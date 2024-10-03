import { useEffect } from 'react'

export const Page = () => {
  // const [copiedFilePath, setCopiedFilePath] = setState('')
  useEffect(() => {
    window.myPreload.copiedPath()
  }, [])

  const handleClick = () => {
    window.myPreload.copyFile()
  }

  return (
    <div className="App">
      <div>{`This app is using Chrome (v${window.versions.chrome()}), Node.js (v${window.versions.node()}), and Electron (v${window.versions.electron()})`}</div>
      <button onClick={handleClick}>Click me</button>
    </div>
  )
}

export default Page
