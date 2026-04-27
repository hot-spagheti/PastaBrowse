const {contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld("settingsApi", {
  setTheme: (variant) => ipcRenderer.sendToHost("theme-change", variant)
})
