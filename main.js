const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

async function main() {
	await app.whenReady();

	const win = new BrowserWindow({
		width: 400,
		height: 400,
		frame: false,
		resizable: true,
		webPreferences: {
			devTools: false,
			preload: path.resolve(app.getAppPath(), "preload.js")
		}
	});
	ipcMain.handle("quit", () => app.quit());
	ipcMain.handle("window:move", (event, x, y) => {
		const [oldX, oldY] = win.getPosition();
		const newPosition = {
			x: oldX+x,
			y: oldY+y
		};
		if ((x !== 0) || (y !== 0)) {
			win.setPosition(newPosition.x, newPosition.y, false);
		}
		return newPosition;
	})
	win.loadFile(path.resolve(app.getAppPath(), "static", "game", "index.html"));
}

main();