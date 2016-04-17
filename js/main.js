let BlockListDecorator = require('./block-list-decorator');
let Generator = require('./generator');
let HorizontalListRenderer = require('./horizontal-list-renderer');
let Transitioner = require('./transitioner');
let WorldConfig = require('./world-config');

let parentEl = document.getElementById("level-gen-container") || document.body;
let imgEl = document.createElement("img");
imgEl.addEventListener("load", () => {
	const BLOCK_WIDTH = 32;
	const BLOCK_HEIGHT = 32;
	const BLOCK_COUNT_H = Math.ceil(parentEl.clientWidth / BLOCK_WIDTH);
	const BLOCK_COUNT_V = 3;
	const VERTICAL_POSITION = (BLOCK_COUNT_V - 1) * BLOCK_HEIGHT;

	let initialState = WorldConfig.BLOCK_TYPES.PLATFORM;
	let transitioner = new Transitioner(
		WorldConfig.TRANSITIONS,
		initialState
	);
	let generator = new Generator(BLOCK_COUNT_H, transitioner);
	let blockTypeList = generator.getAll();

	let decorator = new BlockListDecorator(WorldConfig);
	let spriteTypeList = decorator.decorate(blockTypeList);

	let spriteCanvasEl = document.createElement("canvas");
	spriteCanvasEl.width = imgEl.width;
	spriteCanvasEl.height = imgEl.height;
	let spriteCtx = spriteCanvasEl.getContext("2d");
	spriteCtx.drawImage(imgEl, 0, 0, imgEl.width, imgEl.height);

	let renderCanvasEl = document.createElement("canvas");
	renderCanvasEl.width = BLOCK_WIDTH * BLOCK_COUNT_H;
	renderCanvasEl.height = BLOCK_HEIGHT * BLOCK_COUNT_V;
	let renderCtx = renderCanvasEl.getContext("2d");
	renderCtx.fillStyle = "#2c7bff";
	renderCtx.fillRect(0, 0, renderCanvasEl.width, renderCanvasEl.height);
	parentEl.appendChild(renderCanvasEl);

	let horizontalListRenderer = new HorizontalListRenderer(
		spriteTypeList, spriteCanvasEl, renderCtx, VERTICAL_POSITION,
		BLOCK_WIDTH, BLOCK_HEIGHT);
	horizontalListRenderer.render();
})
imgEl.src = parentEl.getAttribute("data-level-gen-sprite");





// TODO: break up a canvas element into the right amount of blocks
// pull up a sprite sheet, and render accordingly.

// TODO: remove the different types of grass from the block type list
// and start making distinctions later in a second pass, so we can
// vary the types of things we render.