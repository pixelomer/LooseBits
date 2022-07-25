(function(window){
	const background = document.getElementById("background");

	const tile = { name:"unset", width:1, height:1}

	window.setBackgroundTile = function(tileName) {
		const imagePath = `tiles/${tileName}.png`;
		let newImage = new Image();
		newImage.onload = function(e) {
			tile.name = tileName;
			tile.height = this.naturalHeight;
			tile.width = this.naturalWidth;
			background.style.background = `url(${imagePath})`;
		}
		newImage.src = imagePath;
	}

	window.addEventListener("windowmove", function(event) {
		/** @type { { x: number, y: number } } */
		const position = event.detail.position;

		function mod(a, b) {
			return ((a % b) + b) % b;
		}

		const offset = {
			x: mod(position.x, tile.width),
			y: mod(position.y, tile.height),
		}
		background.style.top  = (-offset.y) + "px";
		background.style.left = (-offset.x) + "px";
	});

	window.setBackgroundTile("generic");
})(window);