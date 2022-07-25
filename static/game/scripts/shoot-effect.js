(
	/** @param {(a: number, b: number) => number} random */
	function(window, random){
		const flash = document.getElementById("flash");
		let flashTimeout = null;
		window.addEventListener("didshoot", function(event) {		
			flash.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
			if (flashTimeout != null) {
				clearTimeout(flashTimeout);
			}
			flashTimeout = setTimeout(() => {
				flash.style.backgroundColor = "";
			}, 1000 / 15);
			const shake = [
				{ x: 3, y: 9 },
				{ x: -8, y: -6 },
				{ x: 7, y: 1 },
				{ x: -4, y: -6 },
				{ x: 2, y: 2 },
			].sort(() => random(0,1) ? 1 : -1);
			let shakeIndex = 0;
			const shakeInterval = setInterval(() => {
				const shakePattern = shake[shakeIndex++];
				if (shakePattern == null) {
					clearInterval(shakeInterval);
					return;
				}
				moveWindow(shakePattern.x, shakePattern.y);
			}, 50);
		});
	}
)(window, random);