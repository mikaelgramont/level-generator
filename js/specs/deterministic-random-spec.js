let DeterministicRandom = require('../deterministic-random');

describe("DeterministicRandom", () => {
	let presetOutcomes = [3, 2, 1, 0, 1, 2, 3];

	it("should initialize properly", () => {
		let init = () => {
			let random = new DeterministicRandom(presetOutcomes);
		};
		expect(init).not.toThrow();
	});

	it("should generate the preset sequence", () => {
		let deterministicRandom = new DeterministicRandom(presetOutcomes);
		let values = [];
		let i = 0;
		while(i < presetOutcomes.length) {
			values.push(deterministicRandom.random());
			i++;
		}
		expect(values).toEqual(presetOutcomes);
	});
});