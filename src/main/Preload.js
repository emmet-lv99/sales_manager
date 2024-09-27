import { useEffect, useState } from 'react'

export const Preload = () => {
  const [message, setMessage] = useState('')
  const [ver, setVer] = useState('')
  useEffect(() => {
    console.log(message)
    console.log('inin')
    returnCall()
    window.myPreload.timer(data => {
      alert(data)
    })
  }, [])

  // main => render 구조가 가능한지 테스트 실패
  const returnCall = () => {
    window.myPreload.rText(data => {
      alert(data)
    })
  }
  const handleClick = () => {
    // window.myPreload.sendMessage("send message by preload");
    // window.myPreload.listenChannelMessage(setMessage);

    window.myPreload.sText()
  }
  return (
    <div className="App">
      <h1>Recive: {message}</h1>
      <div>{`This app is using Chrome (v${window.versions.chrome()}), Node.js (v${window.versions.node()}), and Electron (v${window.versions.electron()})`}</div>
      <button onClick={handleClick}>Click me</button>
    </div>
  )
}
