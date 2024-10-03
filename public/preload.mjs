import { contextBridge, ipcRenderer } from 'electron'

const preloadInterface = 'myPreload'

contextBridge.exposeInMainWorld(preloadInterface, {
  // main => render
  copyFile: () => {
    ipcRenderer.send('COPY_FILE', 'hi')
  },

  copiedPath: () => {
    ipcRenderer.on('COPIED_PATH', (i, args) => {
      console.log(args)
    })
  },
})

const versions = 'versions'

contextBridge.exposeInMainWorld(versions, {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // we can also expose variables, not just functions
})
