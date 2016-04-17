// The type of blocks we can deal with
let blockTypes = {
	EMPTY: 0,
	GRASS_CONTINUOUS: 1,
	GRASS_LEFT_EDGE: 2,
	GRASS_RIGHT_EDGE: 3
};

// Markov chain definitions.
let transitions = {
	// EMPTY
	0: {
		// EMPTY
		0: .3,
		// GRASS_LEFT_EDGE
		2: .7
	},
	1: {
		// GRASS_CONTINUOUS
		1: .8,
		// GRASS_RIGHT_EDGE
		3: .2
	},
	2: {
		// GRASS_CONTINUOUS
		1: .7,
		// GRASS_RIGHT_EDGE
		3: .3
	},
	3: {
		// EMPTY
		0: .1,
		// GRASS_CONTINUOUS
		1: .8,
		// GRASS_RIGHT_EDGE
		3: .1
	}
};

module.exports = {
	BLOCK_TYPES : blockTypes,
	TRANSITIONS: transitions
};