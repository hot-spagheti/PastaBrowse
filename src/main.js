const {app, BrowserWindow, ipcMain, screen, globalShortcut} = require("electron");
const {writeFileSync, readFileSync} = require("fs");
const path = require("path");

let win;
let historyPath;
const isDev = !app.isPackaged;

if (isDev){
	historyPath = path.join(__dirname, "history.json");
} else {
	historyPath = path.join(app.getPath("userData"), "history.json");
}



function createWindow(){
	const primaryDisplay = screen.getPrimaryDisplay();
	const {width, height} = primaryDisplay.workArea;

	win = new BrowserWindow({
		width: Math.floor(0.7*width),
		height: Math.floor(0.7*height),
		minWidth: 1200,
		minHeight: 800,
		title: "PastaBrowse",
		webPreferences: {
			webviewTag: true,
			preload: path.join(__dirname, "preload.js"),
			contextIsolation: true,
			nodeIntegration: false
		},
		icon: path.join(__dirname, "..", "Icons", "pasta_icon.png"),
		frame: false,
		center: true,
		movable: true
	});
	
	if (!isDev){
		win.webContents.on("before-input-event", (event, input) => {
			if (input.key === "F12" || input.control && input.shift && input.key === "I"){
				event.preventDefault();
			}
		})

		win.webContents.on("devtools-opened", () => {
			win.webContents.closeDevTools();
		})
	}
	

	win.loadFile(path.join(__dirname, "..", "public", "index.html"));
	win.webContents.setZoomFactor(1.0);
	win.maximize();

	win.webContents.on("did-finish-load", () => {
		win.webContents.send("preload-path", path.join(__dirname, "..", "public", "settings_page", "settings_preload.js"));
	})
}

app.on("will-quit", () => {
	globalShortcut.unregisterAll();
})

ipcMain.on("kill-app", (_event, data) => {
	writeFileSync(historyPath, JSON.stringify(data));
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

ipcMain.on("get-history", () => {
	try {
		const history_json = readFileSync(historyPath);
		const history = JSON.parse(history_json);
		win.webContents.send("res-history", history);
	} catch {
		win.webContents.send("res-history", {});
	}
	
})

app.on("ready", () => {
	createWindow();
	
	globalShortcut.register("CommandOrControl+T", () => {
		if (win.isFocused()){
			win.webContents.send("ctrl-t");
		}
	})

	globalShortcut.register("CommandOrControl+W", () => {
		if (win.isFocused()){
			win.webContents.send("ctrl-w");
		}
	})


	globalShortcut.register("CommandOrControl+R", () => {
		if (win.isFocused()){
			win.webContents.send("ctrl-r");
		}
	})

	globalShortcut.register("F5", () => {
		if (win.isFocused()){
			win.webContents.send("F5");
		}
	})

	globalShortcut.register("CommandOrControl+=", () => {
		if (win.isFocused()){
			win.webContents.send("ctrl-=");
		}
	})

	globalShortcut.register("CommandOrControl+0", () => {
		if (win.isFocused()){
			win.webContents.send("ctrl-0");
		}
	})
	
	globalShortcut.register("CommandOrControl+-", () => {
		if (win.isFocused()){
			win.webContents.send("ctrl--");
		}
	})
})
