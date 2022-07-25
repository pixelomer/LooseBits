(function(window){
	const BORDER_SIZE = 20;

	const game = document.getElementById("game");
	Object.defineProperty(window, "borderSize", { writable: false, value: BORDER_SIZE });
	game.style.border = `${BORDER_SIZE}px gray solid`;
})(window);