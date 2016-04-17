let DeterministicRandom = require('../deterministic-random');
let Transitioner = require('../transitioner');

// Local transition definitions (to avoid dependency on world-config)
let transitions = {
	0: {
		0: .3,
		2: .7
	},
	1: {
		1: .8,
		3: .2
	},
	2: {
		1: .7,
		3: .3
	},
	3: {
		0: .1,
		1: .8,
		3: .1
	}
};

describe("Transitioner", () => {
	let presetOutcomes = [.1, .5, .4, .9, 0, .4, .6];
	let presetSequence = [1, 1, 1, 3, 0, 2, 1];
	let initialState = 1;

	it("should initialize properly", () => {
		expect(() => {
			let deterministicRandom = new DeterministicRandom(presetOutcomes);
			let transitioner = new Transitioner(transitions, initialState, deterministicRandom);
		}).not.toThrow();
	});

	it("should determine the right transitions", () => {
		let deterministicRandom = new DeterministicRandom(presetOutcomes);
		let transitioner = new Transitioner(transitions, initialState, deterministicRandom);

		let states = [];
		for(let i = 0, l = presetOutcomes.length; i < l; i++) {
			states.push(transitioner.transition());
		}
		expect(states).toEqual(presetSequence);
	});
});