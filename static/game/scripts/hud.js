(function(window){
	let didPlayFirstGame = false;
	let isIngame = false;

	window.isIngame = function() {
		return isIngame;
	}
	
	function setIngame(ingame) {
		isIngame = ingame;
		function updateElements(className, display) {
			for (const element of document.getElementsByClassName(className)) {
				element.style.display = display;
			}
		}
		updateElements("ingame", ingame ? null : "none");
		updateElements("not-ingame", ingame ? "none" : null);
		updateElements("replay", (ingame || !didPlayFirstGame) ? "none" : null);

		if (ingame && !didPlayFirstGame) {
			didPlayFirstGame = true;
			updateElements("first-game", "none");
		}
	}

	const killCounter = document.getElementById("kill-count");
	const totalBugs = document.getElementById("total-bugs");
	const score = document.getElementById("score");
	const gameoverMessage = document.getElementById("gameover-message");
	const combo = document.getElementById("combo");

	function updateCounter(element, change) {
		element.innerText = (+element.innerText) + change;
	}

	let killCounterTimeout = null;
	let endGameTimeout = null;
	window.addEventListener("didhitcreature", function(event) {
		updateCounter(killCounter, +1);
		clearTimeout(killCounterTimeout);
		killCounter.style.color = "red";
		setTimeout(() => {
			killCounter.style.color = "";
		}, 500);
		
		if (killCounter.innerText === totalBugs.innerText) {
			clearTimeout(endGameTimeout);
			endGameTimeout = setTimeout(() => {
				gameoverMessage.innerText = `score: ${score.innerText}`;
				setIngame(false);
			}, 1500);
		}
	});


	window.addEventListener("didshoot", function() {
		updateCounter(score, -10);
	});

	window.addEventListener("didhitcreature", function() {
		updateCounter(score, +100);
	});

	let comboTimeout = null;

	window.addEventListener("didhitcombo", function(event) {
		const comboCount = event.detail.combo;
		combo.innerText = `(combo x${comboCount})`;
		updateCounter(score, ((comboCount * comboCount) - comboCount) * 100);
		clearTimeout(comboTimeout);
		setTimeout(() => {
			combo.innerText = "";
		}, 1500);
	});


	window.startGame = function(enemyCount = 35) {
		totalBugs.innerText = "" + enemyCount;
		combo.innerText = "";
		killCounter.innerText = "0";
		score.innerText = "0";
		resetDeadPixels();
		resetCreatures(enemyCount);

		setIngame(true);
	}

	window.giveUp = function() {
		gameoverMessage.innerText = "you gave up.";
		setIngame(false);
	}

	setIngame(false);
})(window);