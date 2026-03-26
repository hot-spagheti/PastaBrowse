const {app, BrowserWindow, ipcMain, screen} = require("electron");

function createWindow(){
	const primaryDisplay = screen.getPrimaryDisplay();
	const {screen_width, screen_height} = primaryDisplay.workArea;

	win = new BrowserWindow({
		width: Math.floor(0.7*screen_width),
		height: Math.floor(0.7*screen_height),
		minWidth: 1200,
		minHeight: 800,
		title: "PastaBrowse",
		webPreferences: {
			webviewTag: true,
			preload: __dirname + "/preload.js",
			contextIsolation: true,
			nodeIntegration: false
		},
		icon: "./Icons/pasta_icon.png",
		frame: false,
		center: true,
		movable: true
	});

	win.loadFile("public/index.html");
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
