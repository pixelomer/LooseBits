(
	/** @param {(a: number, b: number) => number} random */
	function(window, random){
		/** @type {HTMLCanvasElement} */
		const canvas = document.getElementById("creatures");
		const context = canvas.getContext("2d");

		function draw(x, y, size) {
			context.fillRect(x, y, size, size);
		}

		function startErase() {
			context.save();
			context.globalCompositeOperation = 'destination-out';
		}

		/**
		 * @param {number?} x Initial x position on game area
		 * @param {number?} y Initial y position on game area
		 */
		function newCreature(x, y) {
			if (x == null) {
				x = random(100, getRealWidth()-100);
			}
			if (y == null) {
				y = random(100, getRealHeight()-100);
			}
			const length = random(7, 15);
			const direction = {
				x: random(-1, 1),
				y: random(-1, 1)
			};
			const body = [ {x, y} ];
			const nextDirectionChange = random(1, 3);
			const size = random(5, 9);
			const speed = random(3, size-3);
			
			return {
				length,
				direction,
				body,
				nextDirectionChange,
				speed,
				size
			};
		}

		/** @type {ReturnType<newCreature>[]} */
		let creatures = [];
		
		window.resetCreatures = function(creatureCount = 35) {
			creatures = [];
			context.clearRect(0, 0, canvas.width, canvas.height);
			for (let i=0; i<creatureCount; i++) {
				creatures.push(newCreature());
			}
		}

		window.addEventListener("didshoot", function(event) {
			/** @type { { x: number, y: number, width: number, height: number } } */
			const region = event.detail.region;

			let combo = 0;
			for (let i = creatures.length-1; i>=0; i--) {
				const creature = creatures[i];
				const head = creature.body[creature.body.length-1];
				if (
					!window.deadPixelAt(head.x, head.y) &&
					(region.x < head.x) && ((region.x + region.width) > head.x) &&
					(region.y < head.y) && ((region.y + region.height) > head.y)
				) {
					// Hit!
					combo++;
					startErase();
					draw(head.x - 2, head.y - 2, creature.size + 4);
					creature.body.pop();
					for (const part of creature.body) {
						draw(part.x, part.y, creature.size);
					}
					creatures.splice(i, 1);
					context.restore();

					const event = new CustomEvent("didhitcreature", {
						detail: { combo }
					});
					window.dispatchEvent(event);
				}
			}

			if (combo > 1) {
				const event = new CustomEvent("didhitcombo", {
					detail: { combo }
				});
				window.dispatchEvent(event);
			}
		});

		setInterval(() => {
			for (const creature of creatures) {

				// Erase tail and old head
				startErase();
				while (creature.body.length >= creature.length) {
					const pos = creature.body.shift();
					if (creature.body.some((val) => (val.x === pos.x) && (val.y === pos.y))) {
						continue;
					}
					draw(pos.x, pos.y, creature.size, creature.size);
				}
				const pos = { ...creature.body[creature.body.length-1] };
				draw(pos.x - 2, pos.y - 2, creature.size + 4);
				context.restore();

				// Draw neck
				context.fillStyle = "rgba(255, 0, 0, 1.0)";
				for (let i = creature.body.length-1; ((i >= creature.body.length-3) && (i >= 0)); i--) {
					const { x, y } = creature.body[i];
					draw(x, y, creature.size);
				}

				// Draw new head
				const direction = creature.direction;
				pos.x += direction.x * creature.speed;
				pos.y += direction.y * creature.speed;
				creature.body.push(pos);
				draw(pos.x - 2, pos.y - 2, creature.size + 4);

				// New direction
				creature.nextDirectionChange--;
				if (creature.nextDirectionChange === 0) {
					creature.nextDirectionChange = random(7, 15);
					let newDirection = { x:0, y:0 };
					function decideDirection(coordinate, available) {
						if (pos[coordinate] < 100) {
							newDirection[coordinate] = random(0,1);
						}
						else if (pos[coordinate] > (available - 100)) {
							newDirection[coordinate] = random(-1,0);
						}
						else {
							newDirection[coordinate] = random(-1,1)
						}
					}
					decideDirection("x", getRealWidth());
					decideDirection("y", getRealHeight());
					if ((newDirection.y === 0) && (newDirection.x === 0)) {
						newDirection[random(0, 1) ? "x" : "y"] = random(0, 1) ? 1 : -1;
					}
					else if ((newDirection.y === -direction.y) && (newDirection.x === -direction.x)) {
						const a = random(0, 1) ? "x" : "y";
						newDirection[a] = -newDirection[a];
					}
					creature.direction = newDirection;
				}
			}
		}, 1000/40);
	}
)(window, random);