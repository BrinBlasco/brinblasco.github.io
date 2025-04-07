document.addEventListener("DOMContentLoaded", function () {
    var canvas = document.getElementById("myCanvas");
    canvas.width = window.innerWidth * 0.60;
    canvas.height = window.innerHeight * 0.65;
    var ctx = canvas.getContext("2d");

    const currencyTypes = [
        { name: 'CurrencyUpgradeToMagic', file: 'CurrencyUpgradeToMagic.png', points: 1, weight: 30 },
        { name: 'CurrencyRerollMagic', file: 'CurrencyRerollMagic.png', points: 4, weight: 20 },
        { name: 'CurrencyUpgradeRandomly', file: 'CurrencyUpgradeRandomly.png', points: 10, weight: 15 },
        { name: 'CurrencyRerollRare', file: 'CurrencyRerollRare.png', points: 20, weight: 10 },
        { name: 'CurrencyModValues', file: 'CurrencyModValues.png', points: 50, weight: 8 },
        { name: 'FracturingOrbCombined', file: 'FracturingOrbCombined.png', points: 100, weight: 5 },
        { name: 'CurrencyDuplicate', file: 'CurrencyDuplicate.png', points: 500, weight: 1 },
        { name: 'CurrencyImprintOrb', file: 'CurrencyImprintOrb.png', points: 500, weight: 1 }
    ];
    const ballIconFile = 'VaalOrb.png';
    const scoreIconFile = 'HeistCoinCurrency.png'; 
    const assetPath = './assets/';

    var images = {};
    var ballIcon = new Image(); 
    var scoreIcon = new Image();
    var imagesLoaded = 0;
    var totalImagesToLoad = currencyTypes.length + 1; 
    var allImagesLoaded = false;

    function loadImage(src, callback) {
        var img = new Image();
        img.onload = function () {
            imagesLoaded++;

            if (imagesLoaded === totalImagesToLoad) {
                allImagesLoaded = true;
                console.log("All images loaded.");
            }
            if (callback) callback(img);
        };
        img.onerror = function () {
            console.error("Failed to load image:", src);
            imagesLoaded++;
            if (imagesLoaded === totalImagesToLoad) {
                allImagesLoaded = true;
                console.warn("Finished loading images, but some failed.");
            }
        }
        img.src = assetPath + src;
        return img;
    }

    currencyTypes.forEach(currency => {
        images[currency.name] = loadImage(currency.file);
    });
    scoreIcon = loadImage(scoreIconFile);
    ballIcon = loadImage(ballIconFile);

    var x = canvas.width / 2;
    var y = canvas.height - 30;
    var dx = 2;
    var dy = -3;
    var r = 10;

    var objects = []; 

   
    var score = 0;
    var highScore = localStorage.getItem('brickHighScore') ? parseInt(localStorage.getItem('brickHighScore')) : 0;

    var sliderWidth = 100;
    var sliderHeight = 20;
    var sliderX = (canvas.width - sliderWidth) / 2;
    var sliderSpeed = 7; 
    var rightPressed = false;
    var leftPressed = false;

    var gameState = 'menu'; // 'menu', 'playing', 'won', 'lost'

    let cumulativeWeights = [];
    let totalWeight = 0;
    currencyTypes.forEach(currency => {
        totalWeight += currency.weight;
        cumulativeWeights.push({ weight: totalWeight, currency: currency });
    });

    function getRandomWeightedCurrency() {
        const randomWeight = Math.random() * totalWeight;
        for (let i = 0; i < cumulativeWeights.length; i++) {
            if (randomWeight <= cumulativeWeights[i].weight) {
                return cumulativeWeights[i].currency;
            }
        }
        
        return currencyTypes[currencyTypes.length - 1];
    }


    function setupObjects() {
        objects = [];
        var brickWidth = 45; 
        var brickHeight = 45;
        var padding = 5;
        var cols = Math.floor((canvas.width * 0.8) / (brickWidth + padding)); 
        var rows = 5;
        var totalWidth = cols * (brickWidth + padding) - padding;
        var startX = (canvas.width - totalWidth) / 2 + brickWidth / 2;
        var startY = brickHeight / 2 + 60; 

        for (var i = 0; i < cols; i++) {
            for (var j = 0; j < rows; j++) {
                var brickX = startX + i * (brickWidth + padding);
                var brickY = startY + j * (brickHeight + padding);

                
                const chosenCurrency = getRandomWeightedCurrency();

                objects.push({
                    x: brickX,
                    y: brickY,
                    width: brickWidth,
                    height: brickHeight,
                    currency: chosenCurrency, 
                    image: images[chosenCurrency.name] 
                });
            }
        }
    }

    function drawElements() {
        if (!allImagesLoaded) return; 

        objects.forEach((obj) => {
            if (obj.image && obj.image.complete) { 
                ctx.drawImage(obj.image, obj.x - obj.width / 2, obj.y - obj.height / 2, obj.width, obj.height);
            } else {
                ctx.fillStyle = 'grey';
                ctx.fillRect(obj.x - obj.width / 2, obj.y - obj.height / 2, obj.width, obj.height);
            }
        });
    }

    function checkCollisions() {
        if (!allImagesLoaded) return;

        for (var i = objects.length - 1; i >= 0; i--) { 
            var obj = objects[i];
            if (
                x + r > obj.x - obj.width / 2 &&
                x - r < obj.x + obj.width / 2 &&
                y + r > obj.y - obj.height / 2 &&
                y - r < obj.y + obj.height / 2
            ) {

                var overlapX = (r + obj.width / 2) - Math.abs(x - obj.x);
                var overlapY = (r + obj.height / 2) - Math.abs(y - obj.y);

                if (overlapX < overlapY) {
                    dx = -dx; 
                    x += (x < obj.x ? -overlapX : overlapX) * 0.1;
                } else {
                    dy = -dy; 
                    y += (y < obj.y ? -overlapY : overlapY) * 0.1;
                }

                score += obj.currency.points;
                updateHighScore(); 

                objects.splice(i, 1);
                
                return; 
            }
        }
    }

    function updateHighScore() {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('brickHighScore', highScore); 
        }
    }

    function drawScore() {
        ctx.font = "30px cinzel";
        ctx.fillStyle = "#eee"; 
        ctx.textAlign = "left"; 

        const scoreX = 25;
        const scoreY = 30;
        const iconSize = 24;
        const textPadding = 5;

        
        if (scoreIcon && scoreIcon.complete) {
            ctx.drawImage(scoreIcon, scoreX, scoreY - iconSize * 0.8, iconSize, iconSize); 
        }

        
        ctx.fillText(": " + score, scoreX + iconSize + textPadding, scoreY);

        
        ctx.textAlign = "right"; 
        ctx.fillText("High Score: " + highScore, canvas.width - 20, scoreY);
    }


    function gameLoop() {
        if (gameState === 'playing') {
            ctx.clearRect(0, 0, canvas.width, canvas.height); 

            if (!allImagesLoaded) {

                ctx.font = "20px Arial";
                ctx.fillStyle = "#fff";
                ctx.textAlign = "center";
                ctx.fillText("Loading Assets...", canvas.width / 2, canvas.height / 2);

            } else {
                drawElements(); 
                drawBall();
                drawSlider();
                drawScore(); 

                x += dx;
                y += dy;

                checkCollisions();

                if (x + dx > canvas.width - r || x + dx < r) {
                    dx = -dx;
                }
                if (y + dy < r) {
                    dy = -dy;
                    y = r; 
                }

                
                if (y + dy > canvas.height - sliderHeight - r && 
                    y < canvas.height - sliderHeight 
                ) {
                    if (x + r > sliderX && x - r < sliderX + sliderWidth) { 
                        
                        let speed = Math.sqrt(dx * dx + dy * dy);
                        let hitPosition = (x - (sliderX + sliderWidth / 2)) / (sliderWidth / 2); 
                        let maxAngle = 75 * Math.PI / 180; 
                        let angle = hitPosition * maxAngle;

                        
                        const minDY = -speed * Math.cos(maxAngle);
                        let newDY = -speed * Math.cos(angle);
                        dy = Math.min(newDY, minDY * 0.8); 

                        dx = speed * Math.sin(angle);
                        y = canvas.height - sliderHeight - r - 1; 
                    }
                }
                
                else if (y + dy > canvas.height) {  // - r
                    gameState = 'lost';
                    updateHighScore(); 
                    Swal.fire({
                        title: "Game Over!",
                        text: "You lost. Your score: " + score,
                        icon: 'error',
                        confirmButtonText: 'Try Again'
                    }).then(() => {
                        
                        window.location.reload();
                    });
                    
                    requestAnimationFrame(gameLoop); 
                    return;
                }
                if (rightPressed && sliderX < canvas.width - sliderWidth) {
                    sliderX += sliderSpeed;
                } else if (leftPressed && sliderX > 0) {
                    sliderX -= sliderSpeed;
                }

                if (objects.length === 0) {
                    gameState = 'won';
                    updateHighScore(); 
                    Swal.fire({
                        title: "Congratulations!",
                        text: "You cleared all the bricks! Your score: " + score,
                        icon: 'success',
                        confirmButtonText: 'Play Again'
                    }).then(() => {
                        window.location.reload(); 
                    });
                    requestAnimationFrame(gameLoop); 
                    return;
                }
            } 

        } else if (gameState === 'menu') {
            //nema menuja
        }
        requestAnimationFrame(gameLoop);
    }


    function drawBall() {
        ctx.drawImage(ballIcon, x-r*1.3, y-r*1.3, 2.5*r, 2.5*r);
    }

    function drawSlider() {
        ctx.beginPath();
        ctx.rect(sliderX, canvas.height - sliderHeight, sliderWidth, sliderHeight);
        ctx.fillStyle = "#";
        ctx.fill();
        ctx.closePath();
    }

    function resetGame() {
        score = 0; 
        x = canvas.width / 2;
        y = canvas.height - 50; 
        dx = (Math.random() < 0.5 ? 1 : -1) * 1.5;
        dy = -1.5; 
        objects = [];
        if (allImagesLoaded) { 
            setupObjects();
        }
        sliderX = (canvas.width - sliderWidth) / 2;
    }

    function showMenu() {
        gameState = 'menu';
        document.getElementById("menu").style.display = "flex";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }


    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);

    function keyDownHandler(e) {
        if (gameState !== 'playing') return;
        if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
        else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
    }

    function keyUpHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
        else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
    }

    document.getElementById("playBtn").addEventListener("click", function () {
        document.getElementById("menu").style.display = "none";
        gameState = 'playing';
        resetGame(); 
   
    });

    document.getElementById("infoBtn").addEventListener("click", function () {
        info();
    });


    requestAnimationFrame(gameLoop);

    showMenu(); 

}); 