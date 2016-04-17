// How blocks behave.
let blockTypes = {
	EMPTY: 0,
	PLATFORM: 1,
	PIPE: 2,
	DANGER: 3
};

let positionTypes = {
	EMPTY: 0,
	CONTINUOUS: 1,
	LEFT_EDGE: 2,
	RIGHT_EDGE: 3,
	SINGLE: 4
};

let spriteTypes = {
	// EMPTY
	0: {
		// CONTINUOUS
		1: 0,
		// LEFT_EDGE
		2: 0,
		// RIGHT_EDGE
		3: 0,
		// SINGLE
		4: 0		
	},
	// PLATFORM
	1: {
		// CONTINUOUS
		1: 1,
		// LEFT_EDGE
		2: 2,
		// RIGHT_EDGE
		3: 3,
		// SINGLE
		4: 4
	},
	// PIPE
	2: {
		// CONTINUOUS
		1: 5,
		// LEFT_EDGE
		2: 5,
		// RIGHT_EDGE
		3: 5,
		// SINGLE
		4: 5
	},
	// DANGER
	3: {
		// CONTINUOUS
		1: 6,
		// LEFT_EDGE
		2: 6,
		// RIGHT_EDGE
		3: 6,
		// SINGLE
		4: 6
	}
};

// Markov chain definitions.
let transitions = {
	// EMPTY
	0: {
		// EMPTY
		0: .1,
		// PLATFORM
		1: .9
	},
	1: {
		// EMPTY
		0: .15,
		// PLATFORM
		1: .65,
		// PIPE
		2: .1,
		// DANGER
		3: .1
	},
	// PIPE
	2: {
		// PIPE 
		1: .6,
		// DANGER
		3: .4
	},
	// DANGER
	3: {
		// PLATFORM
		1: .8,
		// DANGER
		3: .2
	}
};

module.exports = {
	BLOCK_TYPES: blockTypes,
	POSITION_TYPES: positionTypes,
	SPRITE_TYPES : spriteTypes,
	TRANSITIONS: transitions
};