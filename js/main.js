let Generator = require('./generator');
let Logger = require('./logger');
let Transitioner = require('./transitioner');
let WorldConfig = require('./world-config');

const SIZE = 30;

let logger = new Logger(window);
let initialState = WorldConfig.BLOCK_TYPES.GRASS_CONTINUOUS;
let transitioner = new Transitioner(
	WorldConfig.TRANSITIONS,
	initialState
);
let generator = new Generator(SIZE, transitioner);
let blockTypes = generator.getAll();
logger.log("block types", blockTypes);

// TODO: break up a canvas element into the right amount of blocks
// pull up a sprite sheet, and render accordingly.

// TODO: remove the different types of grass from the block type list
// and start making distinctions later in a second pass, so we can
// vary the types of things we render.