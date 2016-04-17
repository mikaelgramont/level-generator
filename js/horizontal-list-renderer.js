class HorizontalListRenderer {
	constructor(spriteList, srcCanvasEl, destCtx, verticalPosition, blockWidth, blockHeight) {
		this.spriteList_ = spriteList;
		this.srcCanvasEl_ = srcCanvasEl;
		this.destCtx_ = destCtx;
		this.verticalPosition_ = verticalPosition;
		this.blockWidth_ = blockWidth;
		this.blockHeight_ = blockHeight;
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