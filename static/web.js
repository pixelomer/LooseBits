(function(window){
	const game = document.getElementById("game-window");
	/** @type {HTMLIFrameElement} */
	const iframe = game.getElementsByTagName("iframe")[0];

	window.addEventListener("message", function(event) {
		const { action } = event.data;
		switch (action) {
			case "quit":
				game.parentElement.removeChild(game);
				break;
			case "move":
				let { x, y, id } = event.data;
				x = parseInt(game.style.left) + x;
				y = parseInt(game.style.top) + y;
				game.style.left = x + "px";
				game.style.top = y + "px";
				event.source.postMessage({ action: "move", id, x, y }, "*");
				break;
		}
	});

	iframe.src = `game/index.html#${window.innerWidth},${window.innerHeight}`;

	window.addEventListener("resize", function(event) {
		iframe.contentWindow.postMessage({
			action: "update-dimensions",
			width: window.innerWidth,
			height: window.innerHeight
		}, "*");
	})
})(window);