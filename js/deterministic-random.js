class DeterministicRandom {
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