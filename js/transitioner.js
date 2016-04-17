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