(function(window){
	const canvasList = document.getElementsByTagName("canvas");

	for (const canvas of canvasList) {
		canvas.style.width = getRealWidth() + "px";
		canvas.style.height = getRealHeight() + "px";
		canvas.width = getRealWidth();
		canvas.height = getRealHeight();
	}

	window.addEventListener("dimensionschanged", function(){
		for (const canvas of canvasList) {
			const context = canvas.getContext("2d");
			let imageData = null;
			function backupImageData() {
				if (imageData != null) return;
				imageData = context.getImageData(0, 0, canvas.width, canvas.height);
			}

			if (canvas.width < getRealWidth()) {
				backupImageData();
				canvas.width = getRealWidth();
				canvas.style.width = getRealWidth() + "px";
			}
			if (canvas.height < getRealHeight()) {
				backupImageData();
				canvas.style.height = getRealHeight() + "px";
				canvas.height = getRealHeight();
			}

			if (imageData != null) {
				canvas.getContext("2d").putImageData(imageData, 0, 0);
			}
		}
	});

	window.addEventListener("windowmove", function(event) {
		/** @type { { x: number, y: number } } */
		const position = event.detail.position;

		for (const canvas of canvasList) {
			canvas.style.left = -position.x + "px";
			canvas.style.top = -position.y + "px";
		}
	});
})(window);