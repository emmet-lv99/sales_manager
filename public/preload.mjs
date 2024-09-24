import { contextBridge, ipcRenderer } from "electron";

const preloadInterface = "myPreload";

contextBridge.exposeInMainWorld(preloadInterface, {
  listenChannelMessage: (callback) => {
    console.log("in");
    ipcRenderer.on("channel", (_, data) => callback(data));
  },
  sendMessage: (data) => {
    console.log("click");
    ipcRenderer.send("channel", data);
  },
});

const versions = "versions";

contextBridge.exposeInMainWorld(versions, {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // we can also expose variables, not just functions
});
