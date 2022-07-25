const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld(
	"electronAPI", {
		moveWindow: (x, y) => {
			return ipcRenderer.invoke("window:move", x, y);
		},
		quit: () => {
			ipcRenderer.invoke("quit");
		}
	}
);