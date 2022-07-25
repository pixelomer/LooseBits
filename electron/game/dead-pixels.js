(
	/** @param {(a: number, b: number) => number} random */
	function(window, random){
		/** @type {HTMLCanvasElement} */
		const canvas = document.getElementById("dead-pixels");
		const context = canvas.getContext("2d");

		window.deadPixelAt = function(x, y) {
			const imageData = context.getImageData(x, y, 1, 1);
			const [r, g, b, a] = imageData.data;
			if ((r === 0) && (g === 0) && (b === 0) && (a === 0)) {
				return false;
			}
			return true;
		};

		window.resetDeadPixels = function() {
			context.clearRect(0, 0, canvas.width, canvas.height);
		}
		
		window.addEventListener("didshoot", function(event) {
			/** @type { { x: number, y: number, width: number, height: number } } */
			const region = event.detail.region;
			region.x -= region.x % 4;
			region.y -= region.y % 4;
	
			for (let y = region.y; y < region.y + region.height; y += 4) {
				for (let x = region.x; x < region.x + region.width; x += 4) {
					context.fillStyle = `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 1.0)`;
					context.fillRect(x, y, 4, 4);
				}
			}
		});
	}
)(window, random);