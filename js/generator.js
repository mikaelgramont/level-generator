let WorldConfig = require('./world-config');

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