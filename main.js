const {app, BrowserWindow, ipcMain} = require("electron");

const winSize = {width: 1600, height: 900}
let win;

function createWindow(){
	win = new BrowserWindow({
		width: winSize.width,
		height: winSize.height,
		title: "PastaBrowse",
		webPreferences: {
			webviewTag: true,
			preload: __dirname + "/preload.js",
			contextIsolation: true,
			nodeIntegration: false
		},
		icon: "./pasta_icon.png",
		frame: false,
		center: true,
		movable: true
	});

	win.loadFile("public/index.html");
	win.maximize();
	win.webContents.setZoomFactor(1.0);
}

ipcMain.on("kill-app", () => {
	app.quit();
})

ipcMain.on("maximize", () => {
	if (win.isMaximized()){
		win.unmaximize();
	} else {
		win.maximize();
	}
})

ipcMain.on("minimize", () => {
	win.minimize();
})

app.whenReady().then(createWindow)
