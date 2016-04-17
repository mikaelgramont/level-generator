let HorizontalListRenderer = require('../horizontal-list-renderer');

let srcCanvasEL = document.createElement("canvas").getContext("2d");
let destCtx = document.createElement("canvas").getContext("2d");

describe("HorizontalListRenderer", () => {
	it("should initialize properly", () => {
		expect(() => {
		let horizontalListRenderer = new HorizontalListRenderer(
			[], srcCanvasEL, destCtx, 100, 32, 32);
		}).not.toThrow();
	});

	it("should perform the right calls to context2d", () => {
		spyOn(destCtx, 'translate');
		let horizontalListRenderer = new HorizontalListRenderer(
			[], srcCanvasEL, destCtx, 100, 32, 32);
		horizontalListRenderer.render();
		expect(destCtx.translate).toHaveBeenCalledWith(0, 100);
	});
});



/*
ctx.drawImage(
	image,
	sx, sy,
	sWidth, sHeight,
	dx, dy,
	dWidth, dHeight);
ctx.drawImage(
	sprite,
	this.sprite[0], this.sprite[1],
	this.sprite[2], this.sprite[3],
	0, 0,
	this.sprite[2], this.sprite[3]);

	*/