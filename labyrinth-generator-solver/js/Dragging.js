class Dragger {
    constructor(ctx, rows, cols, cellSize) {
        this.ctx = ctx;
        this.rows = rows;
        this.cols = cols;
        this.cellSize = cellSize;
        this.squares = [];  
        this.draggingIndex = null;
    }

    addSquare = (index) => {
        if (this.squares.length >= 2) return; // najvec 2 kr ja

        const col = index % this.cols;
        const row = Math.floor(index / this.cols);

        const square = {
            index,
            x: col * this.cellSize + this.cellSize/10,
            y: row * this.cellSize + this.cellSize/10,
            w: this.cellSize - this.cellSize / 5
        };

        this.squares.push(square);
        this.drawSquare(square, this.squares.length-1);
    };

    drawSquare = (square, index) => {
        let color = index == 0 ? "green" : "red"; // only 2 squares, first blue second red
        this.ctx.fillStyle = color;
        this.ctx.fillRect(square.x, square.y, square.w, square.w);
    };

    clearSquareArea = (x, y, w) => {
        this.ctx.clearRect(x-2, y-2, w+4, w+4);
    };

    handleMouseDown = (e) => {
        const { offsetX, offsetY } = e;

        this.squares.forEach((square, i) => {
            if (
                offsetX >= square.x &&
                offsetX <= square.x + this.cellSize &&
                offsetY >= square.y &&
                offsetY <= square.y + this.cellSize
            ) {
                this.draggingIndex = i;
            }
        });
    };

    handleMouseMove = (e) => {
        if (this.draggingIndex == null) return;

        const bounds = this.ctx.canvas.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        const y = e.clientY - bounds.top;

        let row = Math.floor(y / this.cellSize);
        let col = Math.floor(x / this.cellSize);

        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) return;

        const newIndex = row * this.cols + col;

        for(let i = 0; i < this.squares.length; i++){
            if(i != this.draggingIndex && this.squares[i].index == newIndex) return;
        }

        let square = this.squares[this.draggingIndex];

        const oldX = square.x;
        const oldY = square.y;

        square.x = col * this.cellSize + this.cellSize/10;
        square.y = row * this.cellSize + this.cellSize/10;
        square.index = newIndex;
        
        this.clearSquareArea(oldX, oldY, square.w);

        this.drawSquare(square, this.draggingIndex);

    };

    handleMouseUp = () => {
        this.draggingIndex = null;
    };

    handleMouseLeave = () => {
        this.draggingIndex = null;
    };

    enableDragging = () => {
        const canvas = this.ctx.canvas;
        canvas.addEventListener("mousedown", this.handleMouseDown);
        canvas.addEventListener("mousemove", this.handleMouseMove);
        canvas.addEventListener("mouseup", this.handleMouseUp);
        canvas.addEventListener("mouseleave", this.handleMouseLeave);
    };

    disableDragging = () => {
        const canvas = this.ctx.canvas;
        canvas.removeEventListener("mousedown", this.handleMouseDown);
        canvas.removeEventListener("mousemove", this.handleMouseMove);
        canvas.removeEventListener("mouseup", this.handleMouseUp);
        canvas.removeEventListener("mouseleave", this.handleMouseLeave);
    };

    reset = () => {
        //this.squares.forEach(sq => {
        //    this.ctx.clearRect(sq.x, sq.y, sq.w, sq.w);
        //});
        this.ctx.reset();
        this.squares = [];
        this.isDragging = null;
        this.disableDragging();
    };
}
