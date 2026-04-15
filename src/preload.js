const {contextBridge, ipcRenderer} = require("electron");


contextBridge.exposeInMainWorld("api", {
  killApp: (data) => ipcRenderer.send("kill-app", data),
  toggleMaximize: () => ipcRenderer.send("maximize"),
  minimize: () => ipcRenderer.send("minimize"),
  onCtrlT: (callback) => ipcRenderer.on("ctrl-t", (_event) => callback()),
  onCtrlW: (callback) => ipcRenderer.on("ctrl-w", (_event) => callback()),
  onCtrlR: (callback) => ipcRenderer.on("ctrl-r", (_event) => callback()),
  onF5: (callback) => ipcRenderer.on("F5", (_event) => callback()),
  onCtrlEqual: (callback) => ipcRenderer.on("ctrl-=", (_event) => callback()),
  onCtrlMinus: (callback) => ipcRenderer.on("ctrl--", (_event) => callback()),
  onCtrlZero: (callback) => ipcRenderer.on("ctrl-0", (_event) => callback()),
  getHistory: () => ipcRenderer.send("get-history"),
  onResHistory: (callback) => ipcRenderer.on("res-history", (_event, data) => callback(data)),
  onSettingsPreloadPath: (callback) => ipcRenderer.on("preload-path", (_event, data) => callback(data))
});