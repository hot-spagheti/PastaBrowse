const {contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld("api", {
  killApp: () => ipcRenderer.send("kill-app"),
  toggleMaximize: () => ipcRenderer.send("maximize"),
  minimize: () => ipcRenderer.send("minimize"),
  onCtrlT: (callback) => ipcRenderer.on("ctrl-t", (_event) => callback()),
  onCtrlW: (callback) => ipcRenderer.on("ctrl-w", (_event) => callback())
});