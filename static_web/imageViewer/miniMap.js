class MiniMap {
    constructor(drawImage,miniMapContainer) {
        this.drawImage = drawImage;
        this.miniMapContainer = miniMapContainer;
        this.canvas = null;
        this.ctx = null;
        // this.trackTransforms = null;
        this._initCanvas();
    }

    _initCanvas() {
        if (!this.ctx) {
            this.canvas = document.createElement('canvas');
            this.miniMapContainer.innerHTML = "";
            this.miniMapContainer.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
            // this.trackTransforms = this.drawImage.constructor.trackTransforms(this.ctx);
        }
        // this.trackTransforms.reset();
        if (this.drawImage.image) {
            this.ctx.drawImage(this.drawImage.image,0,0,this.drawImage.image.width,this.drawImage.image.height,0,0,this.canvas.width,this.canvas.height);
            // this.ctx.drawImage(this.drawImage.image,0,0);
        }
    }

    onViewChange() {

    }

    onResize() {
    }
}