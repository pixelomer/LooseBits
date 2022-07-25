// Code that bridges the game with the web browser or Electron

(function(window){
	if (window.electronAPI == null) {
		// Web browser
		let messageID = 0;

		let [realWidth, realHeight] = window.location.hash.slice(1).split(",").map((a) => +a);

		console.log(realWidth, realHeight);

		window.getRealWidth = () => realWidth;
		window.getRealHeight = () => realHeight;

		window.addEventListener("message", function(event) {
			if (event.data.action === "update-dimensions") {
				realWidth = event.data.width;
				realHeight = event.data.height;
				
				const dimensionEvent = new Event("dimensionschanged");
				window.dispatchEvent(dimensionEvent);
			}
		});

		window.electronAPI = {
			moveWindow(x, y) {
				return new Promise((resolve) => {
					const currentID = messageID++;
					window.parent.postMessage({ action: "move", id: currentID, x, y }, "*");
					const listener = (event) => {
						const { action } = event.data;
						if (action !== "move") {
							return;
						}
						const { id, x, y } = event.data;
						if (id !== currentID) {
							return;
						}
						window.removeEventListener("message", listener);
						resolve({ x, y });
					};
					window.addEventListener("message", listener);
				});
			},
			quit() {
				window.parent.postMessage({ action: "quit" }, "*");
			}
		};
	}
	else {
		// Electron
		window.getRealWidth = () => screen.availWidth;
		window.getRealHeight = () => screen.availHeight;
	}
})(window);