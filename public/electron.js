import { ipcMain } from "electron";

const { app, BrowserWindow } = await import("electron");
const path = await import("path");
const isDev = await import("electron-is-dev");

let mainWindow;

function createWindow() {
  const __dirname = path.resolve();

  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      devTools: isDev,
      preload: path.join(__dirname, "public/preload.mjs"),
    },
  });

  // ***중요***
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  //code:-32601 오류 발생 시작할때 console확인 가능한 창이 뜨는데 그때 뜸 실제 실행할땐 문제 없는 오류!
  if (isDev) mainWindow.webContents.openDevTools({ mode: "detach" });

  mainWindow.setResizable(true);
  mainWindow.on("closed", () => {
    mainWindow = null;
    app.quit();
  });
  mainWindow.focus();
}

app.on("ready", createWindow);

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

//render => main setting
ipcMain.on("sT", (e) => {
  setTimeout(() => {
    e.sender.send("rT", "test");
  }, 3000);
});

// setTimeout((e) => {
//   ipcMain.send("timer", "timer 3");
// }, 3000);

//ipcMain의 경우 수신만 가능
// setTimeout(() => {
//   window.webContents.send("timer", "test3");
// }, 3000);
