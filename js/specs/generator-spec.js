let Generator = require('../generator');
let DeterministicRandom = require('../deterministic-random');

describe("Generator", () => {
	let defaultGeneratorConfig = {size: 8};

	it("should initialize properly", () => {
		let init = () => {
			let generator = new Generator(defaultGeneratorConfig);
		};
		expect(init).not.toThrow();
	});

	it("should generate a preset blockType array", () => {
		let presetSequence = [1, 1, 1, 1, 3, 0, 2, 1];

		let TransitionerMock = () => {};
		TransitionerMock.prototype.transition = () => {
			return 0;
		};
		let transitioner = new TransitionerMock();
		
		let generator = new Generator(
			presetSequence.length,
			transitioner
		);

		let blockTypeArray = generator.getAll();
		expect(blockTypeArray.length).toEqual(presetSequence.length);
	});
});