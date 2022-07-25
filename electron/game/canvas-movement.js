(function(window){
	const canvasList = document.getElementsByTagName("canvas");

	for (const canvas of canvasList) {
		canvas.style.width = screen.availWidth + "px";
		canvas.style.height = screen.availHeight + "px";
		canvas.width = screen.availWidth;
		canvas.height = screen.availHeight;
	}

	window.addEventListener("windowmove", function(event) {
		/** @type { { x: number, y: number } } */
		const position = event.detail.position;

		for (const canvas of canvasList) {
			canvas.style.left = -position.x + "px";
			canvas.style.top = -position.y + "px";
		}
	});
})(window);