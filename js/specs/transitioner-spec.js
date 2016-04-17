let DeterministicRandom = require('../deterministic-random');
let Transitioner = require('../transitioner');
let WorldConfig = require('../world-config');

describe("Transitioner", () => {
	let presetOutcomes = [.1, .5, .4, .9, 0, .4, .6];
	let presetSequence = [1, 1, 1, 3, 0, 2, 1];
	let transitions = WorldConfig.TRANSITIONS;
	let initialState = WorldConfig.BLOCK_TYPES.GRASS_CONTINUOUS;

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