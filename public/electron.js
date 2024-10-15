import { dialog, globalShortcut, ipcMain, Menu } from 'electron'
import Exceljs from 'exceljs'
import fs from 'fs'

const workbook = new Exceljs.Workbook()

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
      // contextIsolation: true,
      devTools: isDev,
      preload: path.join(__dirname, 'public/preload.mjs'),
    },
  })

  //개발자 도구 강제 실행
  mainWindow.webContents.openDevTools()

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



const isMac = process.platform === 'darwin'

const template = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' },
          ],
        },
      ]
    : []),
  {
    label: 'File',
    submenu: [
      {
        label: 'Open',
        click: initFile,
        accelerator: process.platform === 'darwin' ? 'Command+O' : 'Ctrl+O',
      },
      { type: 'separator' },
      {
        label: 'Extract',
        click: () => {
          log('Extract')
        },
        accelerator:
          process.platform === 'darwin' ? 'Command+Shift+E' : 'Ctrl+Shift+E',
      },
    ],
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          await shell.openExternal('https://electronjs.org')
        },
      },
    ],
  },
]
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

// 새로고침 방지
app.on('browser-window-focus', () => {
  globalShortcut.register('CommandOrControl+R', () => {
    console.log('CommandOrControl+R is pressed: Shortcut Disabled')
  })
  globalShortcut.register('F5', () => {
    console.log('F5 is pressed: Shortcut Disabled')
  })
})

// 새로고침 단축키 해제
app.on('browser-window-blur', () => {
  globalShortcut.unregister('CommandOrControl+R')
  globalShortcut.unregister('F5')
})



// 파일 초기화
async function initFile() {

  // 원본 파일 경로 추출
  const filePathFull = await extractOrgPath()
  // 복사할 파일 경로 생성
  const copyPath = await makeCopyPath(filePathFull)

  // 복사 파일 생성
  try{
    fs.copyFileSync(filePathFull, copyPath, fs.constants.COPYFILE_EXCL) 
    copyFileCb(copyPath)
    mainWindow.webContents.send('abcd', '파일이 카피 되었습니다.')  
  } catch (e) {
    log(e)
  }



  // const rs = await fs.copyFile(filePathFull, copyPath, fs.constants.COPYFILE_EXCL, err =>
  //   copyFileCb(copyPath, err),
  // )



}

async function extractOrgPath() {
  const options = {
    defaultPath: '/Users/gimdachan/Downloads',
    filters: [{ name: 'EXCEL', extensions: ['xls', 'xlsx'] }],
  }
  const fileInfo = await dialog.showOpenDialog(null, options)
  const { canceled, filePaths } = fileInfo
  const filePathFull = filePaths[0]

  return filePathFull
}

async function makeCopyPath(filePathFull) {
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

  return copyPath
}

async function copyFileCb(copyPath, err) {
  if (err) {
    const alreadCheckFlag = err.message.includes('file already exists')
    if (alreadCheckFlag) {
      dialog.showMessageBox({
        message: '이미 존재하는 파일명입니다.',
      })
    } else {
      alert('다시 시도해주세요.')
    }
  } else {
    // 데이터 구조화, 특정 row 이하로 데이터 읽어오는 로직 필요
    const worksheet = await workbook.xlsx.readFile(copyPath)
    worksheet.eachSheet(sheet => {
      sheet.eachRow(row => {
        row.eachCell(cell => {
          // console.log(cell.value)
        })
      })
    })
  }
}

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

  const copyFileCb = async err => {
    if (err) {
      const alreadCheckFlag = err.message.includes('file already exists')
      if (alreadCheckFlag) {
        dialog.showMessageBox({ message: '이미 존재하는 파일명입니다.' })
      } else {
        alert('다시 시도해주세요.')
      }
    } else {
      log('복사되었습니다.')

      // 데이터 구조화, 특정 row 이하로 데이터 읽어오는 로직 필요
      const worksheet = await workbook.xlsx.readFile(copyPath)
      worksheet.eachSheet(sheet => {
        sheet.eachRow(row => {
          row.eachCell(cell => {
            console.log(cell.value)
          })
        })
      })
      event.reply('COPIED_PATH', copyPath)
    }
  }

  fs.copyFile(filePathFull, copyPath, fs.constants.COPYFILE_EXCL, err =>
    copyFileCb(err),
  )
})
