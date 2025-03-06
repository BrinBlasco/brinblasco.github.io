function setIntervalAwaitable(callback, interval){
    return new Promise(resolve => {
        let intervalId = setInterval(() => {
            let shouldStop = callback(); 
            // kdr funkcija vrne karkoli (true v tem primeru alpa false se shrani sm)
            // ce je true, se promise resolva in interval cleara.
            if(shouldStop) {
                clearInterval(intervalId);
                resolve();
            }
        }, interval)
    })
}

function drawRect(ctx, x, y, width, height, color="#000", fill=true){
    ctx.fillStyle = color;
    if (fill){
        ctx.fillRect(x, y, width, height)
    } else {
        ctx.strokeRect(x, y, width, height);
    }
}

function drawLine(ctx, xc, yc, xd, yd, color="#D8E1E9", strokeWidth = 3){
    ctx.beginPath();

    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;

    ctx.moveTo(xc, yc);
    ctx.lineTo(xd, yd);
    ctx.stroke();
    ctx.closePath();
};
