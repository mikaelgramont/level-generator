class DeterministicRandom {
	/**
	 * As the funny class name might indicate, this class is used to force the values that
	 * a random object is going to return. This is useful to write tests.
	 */
	constructor(sequence) {
		this.sequence_ = sequence;
		this.index = 0;
	}

	isDone() {
		return this.index >= this.sequence_.length;
	}

	random() {
		if (this.isDone()) {
			throw new Error("Sequence is out of values to return");
		}
		return this.sequence_[this.index++];
	}
}

module.exports = DeterministicRandom;