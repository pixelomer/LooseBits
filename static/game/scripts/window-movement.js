(function(){
	const body = document.body;
	let lastWindowPosition = { x:0, y:0 };

	window.getWindowPosition = function() {
		return { ...lastWindowPosition };
	};

	window.moveWindow = function(x, y){
		window.electronAPI.moveWindow(x, y).then((position) => {
			lastWindowPosition = position;
			const event = new CustomEvent("windowmove", {
				detail: { position: { ...position } }
			});
			window.dispatchEvent(event);
		});
	};

	/** @param {MouseEvent} ev */
	body.onmousemove = function(ev) {
		if (ev.buttons & 1) {
			window.moveWindow(ev.movementX, ev.movementY);
		}
	};

	window.moveWindow(0, 0);
})();