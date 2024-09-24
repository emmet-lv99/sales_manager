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
