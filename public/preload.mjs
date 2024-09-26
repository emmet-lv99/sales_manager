import { contextBridge, ipcRenderer } from "electron";

const preloadInterface = "myPreload";

contextBridge.exposeInMainWorld(preloadInterface, {
  listenChannelMessage: (callback) => {
    console.log("in");
    ipcRenderer.on("channel", (_, data) => callback(data));
  },
  sendMessage: (data) => {
    // cole.log("click");
    ipcRenderer.send("channel", data);
  },

  //render => main
  rText: (callback) => {
    ipcRenderer.on("rT", (_, data) => {
      console.log("jjosjdfopjp");
      callback(data);
    });
  },

  // main => render
  sText: () => {
    ipcRenderer.send("sT", "");
  },

  timer: (callback) => {
    ipcRenderer.on("timer", (_, data) => {
      callback(data);
    });
  },
});

const versions = "versions";

contextBridge.exposeInMainWorld(versions, {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // we can also expose variables, not just functions
});
