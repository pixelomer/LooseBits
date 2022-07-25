const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

function electronFile(name) {
	return path.resolve(app.getAppPath(), "electron", name);
}

async function main() {
	await app.whenReady();

	const win = new BrowserWindow({
		width: 400,
		height: 400,
		frame: false,
		resizable: true,
		webPreferences: {
			devTools: false,
			preload: electronFile("preload.js")
		}
	});
	ipcMain.handle("quit", () => app.quit());
	ipcMain.handle("window:move", (event, x, y) => {
		if ((typeof x !== 'number') || (typeof y !== 'number')) {
			throw new Error("x and y must be numbers");
		}
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
	win.loadFile(electronFile("index.html"));
}

main();