import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('myPreload', {
  // main => render
  copyFile: () => {
    ipcRenderer.send('COPY_FILE', 'hi')
  },

  tmp: cb => {
    ipcRenderer.on('COPIED_PATH', (i, args) => cb(args))
  },
})

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // we can also expose variables, not just functions
})


window.abcd = {}

ipcRenderer.on('abcd', (evt, payload) => {
  window.abcd = {payload}
  console.log('페이로드를 받았습니다')
})