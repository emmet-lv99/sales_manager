import { dialog, ipcMain } from 'electron'
import fs from 'fs'

const { app, BrowserWindow } = await import('electron')
const path = await import('path')
const isDev = await import('electron-is-dev')

let mainWindow
const log = console.log

function createWindow() {
  const __dirname = path.resolve()

  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: true,
      devTools: isDev,
      preload: path.join(__dirname, 'public/preload.mjs'),
    },
  })

  // ***중요***
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`,
  )

  //code:-32601 오류 발생 시작할때 console확인 가능한 창이 뜨는데 그때 뜸 실제 실행할땐 문제 없는 오류!
  // if (isDev) mainWindow.webContents.openDevTools({ mode: "detach" });

  mainWindow.setResizable(true)
  mainWindow.on('closed', () => {
    mainWindow = null
    app.quit()
  })
  mainWindow.focus()
}

app.on('ready', createWindow)

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

//render => main setting
ipcMain.on('COPY_FILE', async (event, payload) => {
  log(payload)
  const options = {
    defaultPath: '/Users/gimdachan/Downloads',
    filters: [{ name: 'EXCEL', extensions: ['xls', 'xlsx'] }],
  }
  const fileInfo = await dialog.showOpenDialog(null, options)
  const { canceled, filePaths } = fileInfo
  const filePathFull = filePaths[0]

  //파일 이름 + 확장자
  const fileNameFull = filePathFull.substring(
    filePathFull.lastIndexOf('/') + 1,
    filePathFull.length,
  )

  //파일 패스
  const filePath = filePathFull.replace(fileNameFull, '')

  //파일 이름
  const fileName = fileNameFull.substring(fileNameFull.lastIndexOf('.'), 0)

  //파일 확장자
  const fileExtension = fileNameFull.substring(
    fileNameFull.lastIndexOf('.'),
    fileNameFull.length,
  )

  //복사 파일 경로
  const copyPath = filePath + fileName + '_copied' + fileExtension

  fs.copyFile(filePathFull, copyPath, err => {
    if (err) console.log('err')
    else {
      log('복사되었습니다.')
      event.sender.send('COPIED_PATH', copyPath)
    }
  })
})
