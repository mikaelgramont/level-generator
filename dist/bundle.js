(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
let WorldConfig = require('./world-config');

class Generator {
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
},{"./world-config":5}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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
},{"./generator":1,"./logger":2,"./transitioner":4,"./world-config":5}],4:[function(require,module,exports){
class Transitioner {
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
},{}],5:[function(require,module,exports){
let blockTypes = {
	EMPTY: 0,
	GRASS_CONTINUOUS: 1,
	GRASS_LEFT_EDGE: 2,
	GRASS_RIGHT_EDGE: 3
};

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
},{}]},{},[3]);
