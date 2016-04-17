(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
class Generator {
	/**
	 * This class manages a transitioner object.
	 */
	constructor(size, transitioner) {
		this.steps_ = 0;
		this.size_ = size;
		this.transitioner_ = transitioner;
	}

	step() {
		if (this.steps_ < this.size_) {
			this.steps_++;
			return this.transitioner_.transition();
		}
	}

	getAll() {
		let values = [];
		while (this.steps_ < this.size_) {
			values.push(this.transitioner_.transition());
			this.steps_++;
		}
		return values;
	}

	reset(state) {
		this.transitioner_.setState(state);
		this.steps_ = 0;
	}
}

module.exports = Generator;
},{}],3:[function(require,module,exports){
let ProxyDebugger = require('./proxydebugger');

class HorizontalListRenderer {
	constructor(spriteList, srcCanvasEl, destCtx, verticalPosition, blockWidth, blockHeight, logger) {
		this.spriteList_ = spriteList;
		this.srcCanvasEl_ = srcCanvasEl;
		this.destCtx_ = destCtx;
		this.verticalPosition_ = verticalPosition;
		this.blockWidth_ = blockWidth;
		this.blockHeight_ = blockHeight;
		this.logger_ = logger;

		// this.destCtx_ = ProxyDebugger.instrumentContext(
		// 	this.destCtx_, 'render', this.logger_, {});
	}

	render() {
		this.destCtx_.translate(0, this.verticalPosition_);
		let positionX = 0;
		this.spriteList_.forEach((spriteId) => {
			this.destCtx_.drawImage(
				this.srcCanvasEl_,
				spriteId * this.blockWidth_, 0,
				this.blockWidth_, this.blockHeight_, 
				positionX, 0,
				this.blockWidth_, this.blockHeight_
			);
			positionX += this.blockWidth_;
		});
	}
}

module.exports = HorizontalListRenderer;
},{"./proxydebugger":6}],4:[function(require,module,exports){
class Logger {
	constructor(global) {
		this.enabled_ = typeof(global.console) != 'undefined';
		this._logger = global.console;
	}

	enable() {
		this.enabled_ = true;
	}

	disable() {
		this.enabled_ = false;
	}

	log() {
		if (this.enabled_) {
			this._logger.log.apply(this._logger, arguments);
		}
	}

	group() {
		if (this.enabled_) {
			this._logger.group.apply(this._logger, arguments);
		}
	}

	groupCollapsed() {
		if (this.enabled_) {
			this._logger.groupCollapsed.apply(this._logger, arguments);
		}
	}

	groupEnd() {
		if (this.enabled_) {
			this._logger.groupEnd.apply(this._logger, arguments);
		}
	}
}
module.exports = Logger;
},{}],5:[function(require,module,exports){
let BlockListDecorator = require('./block-list-decorator');
let Generator = require('./generator');
let HorizontalListRenderer = require('./horizontal-list-renderer');
let Logger = require('./logger');
let Transitioner = require('./transitioner');
let WorldConfig = require('./world-config');

let imgEl = document.createElement("img");
imgEl.addEventListener("load", () => {
	// document.body.appendChild(imgEl);
	const BLOCK_COUNT_H = 30;
	const BLOCK_COUNT_V = 3;
	const BLOCK_WIDTH = 32;
	const BLOCK_HEIGHT = 32;
	const VERTICAL_POSITION = (BLOCK_COUNT_V - 1) * BLOCK_HEIGHT;

	let logger = new Logger(window);
	let initialState = WorldConfig.BLOCK_TYPES.PLATFORM;
	let transitioner = new Transitioner(
		WorldConfig.TRANSITIONS,
		initialState
	);
	let generator = new Generator(BLOCK_COUNT_H, transitioner);
	let blockTypeList = generator.getAll();
	logger.log("block types", blockTypeList);

	let decorator = new BlockListDecorator(WorldConfig);
	let spriteTypeList = decorator.decorate(blockTypeList);
	logger.log("sprite types", spriteTypeList);

	let spriteCanvasEl = document.createElement("canvas");
	spriteCanvasEl.width = imgEl.width;
	spriteCanvasEl.height = imgEl.height;
	let spriteCtx = spriteCanvasEl.getContext("2d");
	spriteCtx.drawImage(imgEl, 0, 0, imgEl.width, imgEl.height);
	// document.body.appendChild(spriteCanvasEl);

	let renderCanvasEl = document.createElement("canvas");
	renderCanvasEl.width = BLOCK_WIDTH * BLOCK_COUNT_H;
	renderCanvasEl.height = BLOCK_HEIGHT * BLOCK_COUNT_V;
	let renderCtx = renderCanvasEl.getContext("2d");
	renderCtx.fillStyle = "#2c7bff";
	renderCtx.fillRect(0, 0, renderCanvasEl.width, renderCanvasEl.height);
	document.body.appendChild(renderCanvasEl);

	let horizontalListRenderer = new HorizontalListRenderer(
		spriteTypeList, spriteCanvasEl, renderCtx, VERTICAL_POSITION,
		BLOCK_WIDTH, BLOCK_HEIGHT, logger);
	horizontalListRenderer.render();
})
imgEl.src = "sprites.png";





// TODO: break up a canvas element into the right amount of blocks
// pull up a sprite sheet, and render accordingly.

// TODO: remove the different types of grass from the block type list
// and start making distinctions later in a second pass, so we can
// vary the types of things we render.
},{"./block-list-decorator":1,"./generator":2,"./horizontal-list-renderer":3,"./logger":4,"./transitioner":7,"./world-config":8}],6:[function(require,module,exports){
let ProxyDebugger = {
	instrumentContext: (original, logName, logger, modifiers) => {
		// The object that all calls will go through
		let proxyObj = {};

		for (let propName in original) {
			if (original[propName] instanceof Function) {
				// Proxying methods.
				proxyObj[propName] = (...args) => {
					let argsForLogging = args;
					if (propName in modifiers) {
						argsForLogging = modifiers[propName](args);
					}
					logger.log(`${logName}.${propName}`, argsForLogging);  
					original[propName].apply(original, args);
				};
			} else {
				// Setters and getters for proxy'ed properties.
				Object.defineProperty(proxyObj, propName, {
					set: function(value) {
					 	original[propName] = value;
						logger.log(`${logName}.${propName} = ${value}`);
					},
					get: function(name)	{
						return original[propName];
					}
				});    
			}
		}
		return proxyObj;
	}
}

module.exports = ProxyDebugger;
},{}],7:[function(require,module,exports){
class Transitioner {
	/**
	 * This object handles transitions through Markov chains defined in its
	 * constructor arguments.
	 */
	constructor(transitions, initialState, randomObj) {
		this.transitions_ = transitions;
		this.currentState_ = initialState;
		this.randomObj_ = randomObj || Math;
	}

	transition() {
		let possibleTransitions = this.transitions_[this.currentState_];
		let randomValue = this.randomObj_.random();

		let lowerLimit = 0;
		let highLimit = 0;

		for(let destination in possibleTransitions) {
			let width = possibleTransitions[destination];
			lowerLimit = highLimit;
			highLimit = highLimit + width;

			if (lowerLimit <= randomValue && randomValue < highLimit) {
				this.currentState_ = destination;
				return parseInt(destination, 10);
			}
		}
		throw Error("Did not return any value");
	}

	setState(state) {
		this.currentState_ = state;
	}
}

module.exports = Transitioner;
},{}],8:[function(require,module,exports){
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
},{}]},{},[5]);
