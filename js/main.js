let Generator = require('./generator');
let Logger = require('./logger');
let Transitioner = require('./transitioner');
let WorldConfig = require('./world-config');

const SIZE = 30;
const RUNS = 1

let logger = new Logger(window);
let initialState = WorldConfig.BLOCK_TYPES.GRASS_CONTINUOUS;
let transitioner = new Transitioner(
	WorldConfig.TRANSITIONS,
	initialState
);
let generator = new Generator(SIZE, transitioner);
for(let i = 0; i < RUNS; i++) {
	let blockTypes = generator.getAll();
	logger.log("block types", i, blockTypes);
	generator.reset(initialState);
}