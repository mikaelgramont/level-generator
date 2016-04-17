let BlockListDecorator = require('../block-list-decorator');
let WorldConfig = require('../world-config');

describe("BlockListDecorator", () => {
	it("should initialise properly", () => {
		expect(() => {
			let decorator = new BlockListDecorator();
		}).not.toThrow();
	});

	it("should generate sections", () => {
		let blockTypeList = [0, 1, 1, 1, 0, 1, 0];
		let expectedSections = [
			[0], [1, 1, 1], [0], [1], [0]
		];
		let decorator = new BlockListDecorator(WorldConfig);
		let sections = decorator.generateSections(blockTypeList);
		expect(sections).toEqual(expectedSections);
	});

	it("should generate correct position types", () => {
		let section;
		let expectedSprites;		
		let spriteTypes;
		let decorator = new BlockListDecorator(WorldConfig);

		// Long platform
		section = [1, 1, 1];
		expectedSprites = [2, 1, 3];
		spriteTypes = decorator.processSection(section);
		expect(spriteTypes).toEqual(expectedSprites);

		// Single platform
		section = [1];
		expectedSprites = [4];
		spriteTypes = decorator.processSection(section);
		expect(spriteTypes).toEqual(expectedSprites);

		// Long empty
		section = [0, 0, 0, 0];
		expectedSprites = [0, 0, 0, 0];
		spriteTypes = decorator.processSection(section);
		expect(spriteTypes).toEqual(expectedSprites);

		// Single empty
		section = [0];
		expectedSprites = [0];
		spriteTypes = decorator.processSection(section);
		expect(spriteTypes).toEqual(expectedSprites);

		// Lots of pipes
		section = [2, 2, 2, 2];
		expectedSprites = [5, 5, 5, 5];
		spriteTypes = decorator.processSection(section);
		expect(spriteTypes).toEqual(expectedSprites);

		// Single pipe
		section = [2];
		expectedSprites = [5];
		spriteTypes = decorator.processSection(section);
		expect(spriteTypes).toEqual(expectedSprites);

		// Lots of dangers
		section = [3, 3, 3, 3];
		expectedSprites = [6, 6, 6, 6];
		spriteTypes = decorator.processSection(section);
		expect(spriteTypes).toEqual(expectedSprites);

		// Single danger
		section = [3];
		expectedSprites = [6];
		spriteTypes = decorator.processSection(section);
		expect(spriteTypes).toEqual(expectedSprites);
	});

	it("should decorate platform sprites according to their position", () => {
		let blockTypeList = [0, 1, 1, 1, 0, 1, 0];
		let expectedSpriteTypeList = [0, 2, 1, 3, 0, 4, 0];
		let decorator = new BlockListDecorator(WorldConfig);
		let spriteTypeList = decorator.decorate(blockTypeList);
		expect(spriteTypeList).toEqual(expectedSpriteTypeList);
	});
});