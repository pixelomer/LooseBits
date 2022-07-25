(function(window){
	document.onkeydown = function(event) {
		if (event.code === "Space") {
			if (!isIngame()) {
				return;
			}
			const { x, y } = getWindowPosition();
			const region = {
				x: x + 140,
				y: y + 140,
				width: 80,
				height: 80
			};
			const event = new CustomEvent("didshoot", {
				detail: { region }
			});
			window.dispatchEvent(event);
		}
		else if (event.code === "Escape") {
			if (!isIngame()) {
				return;
			}
			giveUp();
		}
		else if (event.code === "KeyQ") {
			if (isIngame()) {
				return;
			}
			window.electronAPI.quit();
		}
		else if (event.code === "Enter") {
			if (isIngame()) {
				return;
			}
			startGame();
		}
		/*
		else if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) {
			const event = new CustomEvent("arrowkeydown", {
				detail: { key: event.code.slice(5).toLowerCase() }
			});
			window.dispatchEvent(event);
		}*
		*/
	}
})(window);