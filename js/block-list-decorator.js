class BlockListDecorator {
	constructor(config) {
		this.config_ = config;
	}

	decorate(blockTypeList) {
		let spriteTypeList = [];
		let sections = this.generateSections(blockTypeList);
		sections.forEach((section) => {
			spriteTypeList = spriteTypeList.concat(this.processSection(section));
		})
		return spriteTypeList;
	}

	generateSections(fullList) {
		let lastType = null;
		let currentSection = null;
		let sections = [];

		fullList.forEach((currentBlockType) => {
			if (currentBlockType !== lastType) {
				if (currentSection !== null) {
					sections.push(currentSection);
				}
				currentSection = [];
			}
			currentSection.push(currentBlockType);
			lastType = currentBlockType;
		});
		if (currentSection !== null) {
			sections.push(currentSection);
		}
		return sections;
	}

	processSection(section) {
		// - if empty section, return array of 0s
		// - build a sprite type section
		// - if length is 1, use single
		// - otherwise fill with continuous, adjust edges
		if (!section.length) {
			return [];
		}

		let sprites = [];
		let blockType = section[0];

		if (section.length == 1) {
			sprites[0] = this.config_.SPRITE_TYPES[blockType][4];
		} else {
			// Can't seem to use Array.fill in phantomjs
			for(let i = 0, l = section.length; i < l; i++) {
				if (i == 0) {
					sprites[i] = this.config_.SPRITE_TYPES[blockType][2];
				} else if (i == l - 1) {
					sprites[i] = this.config_.SPRITE_TYPES[blockType][3];
				} else {
					sprites[i] = this.config_.SPRITE_TYPES[blockType][1];
				}
			}
		}
		return sprites;
	}
}

module.exports = BlockListDecorator;