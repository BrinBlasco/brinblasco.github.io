document.addEventListener("DOMContentLoaded", function () {
    var canvas = document.getElementById("myCanvas");
    canvas.width = Math.min(window.innerWidth * 0.6, 1000); // Added max width
    canvas.height = Math.min(window.innerHeight * 0.65, 700); // Added max height
    var ctx = canvas.getContext("2d");

    const currencyTypes = [
        {
            name: "CurrencyUpgradeToMagic",
            file: "CurrencyUpgradeToMagic.png",
            points: 1,
            weight: 30,
        },
        { name: "CurrencyRerollMagic", file: "CurrencyRerollMagic.png", points: 4, weight: 20 },
        {
            name: "CurrencyUpgradeRandomly",
            file: "CurrencyUpgradeRandomly.png",
            points: 10,
            weight: 15,
        },
        { name: "CurrencyRerollRare", file: "CurrencyRerollRare.png", points: 20, weight: 10 },
        { name: "CurrencyModValues", file: "CurrencyModValues.png", points: 50, weight: 8 },
        {
            name: "FracturingOrbCombined",
            file: "FracturingOrbCombined.png",
            points: 100,
            weight: 5,
        },
        { name: "CurrencyDuplicate", file: "CurrencyDuplicate.png", points: 500, weight: 1 },
        { name: "CurrencyImprintOrb", file: "CurrencyImprintOrb.png", points: 500, weight: 1 },
    ];
    const ballIconFile = "VaalOrb.png";
    const scoreIconFile = "HeistCoinCurrency.png";
    const paddleImageFile = "paddle.png"; // Added paddle image file
    const assetPath = "./assets/";

    var images = {};
    var ballIcon = new Image();
    var scoreIcon = new Image();
    var paddleImage = new Image(); // Added paddle image object
    var imagesLoaded = 0;
    var totalImagesToLoad = currencyTypes.length + 3; // Increased count for score, ball, and paddle
    var allImagesLoaded = false;

    function loadImage(src, callback) {
        var img = new Image();
        img.onload = function () {
            imagesLoaded++;
            if (imagesLoaded === totalImagesToLoad) {
                allImagesLoaded = true;
                if (gameState === "playing") { // Ensure objects setup if game started before loading finished
                    setupObjects();
                }
                console.log("All images loaded.");
            }
            if (callback) callback(img);
        };
        img.onerror = function () {
            console.error("Failed to load image:", src);
            imagesLoaded++;
            if (imagesLoaded === totalImagesToLoad) {
                allImagesLoaded = true;
                 if (gameState === "playing") {
                    setupObjects();
                 }
                console.warn("Finished loading images, but some failed.");
            }
        };
        img.src = assetPath + src;
        return img;
    }

    currencyTypes.forEach((currency) => {
        images[currency.name] = loadImage(currency.file);
    });
    scoreIcon = loadImage(scoreIconFile);
    ballIcon = loadImage(ballIconFile);
    paddleImage = loadImage(paddleImageFile); // Load the paddle image

    var x = canvas.width / 2;
    var y = canvas.height - 50; // Start slightly higher
    var dx = 5;
    var dy = -5;
    var r = 10; // Ball radius

    var objects = [];

    var score = 0;
    var highScore = localStorage.getItem("brickHighScore")
        ? parseInt(localStorage.getItem("brickHighScore"))
        : 0;

    var sliderWidth = 170;
    var sliderHeight = 20; // Still used for collision logic height
    var sliderX = (canvas.width - sliderWidth) / 2;
    var sliderSpeed = 10;
    var rightPressed = false;
    var leftPressed = false;

    var gameState = "menu"; // 'menu', 'playing', 'won', 'lost'

    let cumulativeWeights = [];
    let totalWeight = 0;
    currencyTypes.forEach((currency) => {
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
        var cols = Math.floor((canvas.width * 0.85) / (brickWidth + padding)); // Adjusted width usage
        var rows = 5;
        var totalWidth = cols * (brickWidth + padding) - padding;
        var startX = (canvas.width - totalWidth) / 2; // Center calculation
        var startY = 70; // Start bricks lower

        for (var i = 0; i < cols; i++) {
            for (var j = 0; j < rows; j++) {
                 // Center of brick calculation
                var brickX = startX + i * (brickWidth + padding) + brickWidth / 2;
                var brickY = startY + j * (brickHeight + padding) + brickHeight / 2;

                const chosenCurrency = getRandomWeightedCurrency();

                objects.push({
                    x: brickX,
                    y: brickY,
                    width: brickWidth,
                    height: brickHeight,
                    currency: chosenCurrency,
                    image: images[chosenCurrency.name],
                });
            }
        }
    }

     function populateLegend() {
        const legendList = document.getElementById('legend-list');
        if (!legendList) return;
        legendList.innerHTML = ''; // Clear existing legend items

        // Sort currencies by points for better readability
        const sortedCurrencies = [...currencyTypes].sort((a, b) => a.points - b.points);

        sortedCurrencies.forEach(currency => {
            const listItem = document.createElement('li');

            const img = document.createElement('img');
            img.src = assetPath + currency.file;
            img.alt = currency.name;

            const text = document.createElement('span');
            text.textContent = `: ${currency.points} pts`;

            listItem.appendChild(img);
            listItem.appendChild(text);
            legendList.appendChild(listItem);
        });
    }


    function drawElements() {
        if (!allImagesLoaded) return;

        objects.forEach((obj) => {
            if (obj.image && obj.image.complete) {
                ctx.drawImage(
                    obj.image,
                    obj.x - obj.width / 2,
                    obj.y - obj.height / 2,
                    obj.width,
                    obj.height
                );
            } else {
                // Fallback drawing if image not loaded (less likely now with checks)
                ctx.fillStyle = "grey";
                ctx.fillRect(obj.x - obj.width / 2, obj.y - obj.height / 2, obj.width, obj.height);
            }
        });
    }

    function checkCollisions() {
        if (!allImagesLoaded) return;

        for (var i = objects.length - 1; i >= 0; i--) {
            var obj = objects[i];
            // Ball-Brick Collision Check
            if (
                x + r > obj.x - obj.width / 2 &&
                x - r < obj.x + obj.width / 2 &&
                y + r > obj.y - obj.height / 2 &&
                y - r < obj.y + obj.height / 2
            ) {
                // Simple collision response: determine dominant overlap direction
                var overlapX = (r + obj.width / 2) - Math.abs(x - obj.x);
                var overlapY = (r + obj.height / 2) - Math.abs(y - obj.y);

                if (overlapX < overlapY) { // Horizontal collision is dominant
                    dx = -dx;
                    // Nudge ball out horizontally slightly to prevent sticking
                    x += Math.sign(x - obj.x) * overlapX * 0.1;
                } else { // Vertical collision is dominant
                    dy = -dy;
                     // Nudge ball out vertically slightly
                    y += Math.sign(y - obj.y) * overlapY * 0.1;
                }

                score += obj.currency.points;
                updateHighScore();
                objects.splice(i, 1); // Remove brick
                return; // Assume only one collision per frame for simplicity
            }
        }
    }


    function updateHighScore() {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("brickHighScore", highScore);
        }
    }

    function drawScore() {
        ctx.font = "30px cinzel";
        ctx.fillStyle = "#eee";
        ctx.textAlign = "left";

        const scoreX = 25;
        const scoreY = 35; // Adjusted Y position slightly
        const iconSize = 24;
        const textPadding = 10; // Increased padding

        if (scoreIcon && scoreIcon.complete) {
            ctx.drawImage(scoreIcon, scoreX, scoreY - iconSize * 0.8, iconSize, iconSize);
            ctx.fillText(": " + score, scoreX + iconSize + textPadding, scoreY);
        } else {
             ctx.fillText("Score: " + score, scoreX, scoreY); // Fallback if icon fails
        }


        ctx.textAlign = "right";
        ctx.fillText("High Score: " + highScore, canvas.width - 20, scoreY);
    }

    function gameLoop() {
        if (gameState === "playing") {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (!allImagesLoaded) {
                ctx.font = "20px Arial";
                ctx.fillStyle = "#fff";
                ctx.textAlign = "center";
                ctx.fillText("Loading Assets...", canvas.width / 2, canvas.height / 2);
            } else {
                drawElements();
                drawBall();
                drawSlider(); // Now draws the image
                drawScore();

                x += dx;
                y += dy;

                checkCollisions();

                // Wall Collisions
                if (x + dx > canvas.width - r || x + dx < r) {
                    dx = -dx;
                    x = Math.max(r, Math.min(canvas.width - r, x)); // Prevent sticking
                }
                if (y + dy < r) {
                    dy = -dy;
                    y = r; // Prevent sticking to top
                }

                // Paddle Collision Check (using sliderHeight for the vertical collision zone)
                if (y + dy > canvas.height - sliderHeight - r && y < canvas.height - sliderHeight) {
                    if (x + r > sliderX && x - r < sliderX + sliderWidth) {
                        // Collision with paddle detected
                        let speed = Math.sqrt(dx * dx + dy * dy);
                        let hitPosition = (x - (sliderX + sliderWidth / 2)) / (sliderWidth / 2); // -1 to 1
                        let maxAngle = (75 * Math.PI) / 180; // 75 degrees in radians
                        let angle = hitPosition * maxAngle;

                        // Calculate new velocities based on angle
                        dx = speed * Math.sin(angle);
                        dy = -speed * Math.cos(angle); // Always bounce upwards

                        // Ensure minimum upward velocity to prevent flat bounces
                         const minVerticalSpeedRatio = 0.2; // e.g., at least 20% of speed is vertical
                         if (Math.abs(dy) < speed * minVerticalSpeedRatio) {
                            dy = -speed * minVerticalSpeedRatio * Math.sign(dy || -1); // Ensure negative dy
                            // Adjust dx to maintain overall speed (Pythagorean theorem)
                            dx = Math.sqrt(speed*speed - dy*dy) * Math.sign(dx || (Math.random() - 0.5));
                         }

                        y = canvas.height - sliderHeight - r - 1; // Move ball slightly above paddle
                    }
                } else if (y + r > canvas.height) { // Check if ball bottom edge passed canvas bottom
                    gameState = "lost";
                    updateHighScore();
                    Swal.fire({
                        title: "Game Over!",
                        text: "You lost. Your score: " + score,
                        icon: "error",
                        confirmButtonText: "Try Again",
                    }).then((result) => {
                         if (result.isConfirmed) { // Check if confirm button was clicked
                             resetGame();
                             showMenu(); // Go back to menu instead of reloading page
                         }
                    });
                    requestAnimationFrame(gameLoop); // Keep loop running for modal display
                    return; // Stop game logic execution for this frame
                }

                // Paddle Movement
                if (rightPressed && sliderX < canvas.width - sliderWidth) {
                    sliderX += sliderSpeed;
                } else if (leftPressed && sliderX > 0) {
                    sliderX -= sliderSpeed;
                }

                 // Check Win Condition
                if (objects.length === 0) {
                    gameState = "won";
                    updateHighScore();
                    Swal.fire({
                        title: "Congratulations!",
                        text: "You cleared all the bricks! Your score: " + score,
                        icon: "success",
                        confirmButtonText: "Play Again",
                    }).then((result) => {
                        if (result.isConfirmed) {
                           resetGame();
                           showMenu();
                        }
                    });
                    requestAnimationFrame(gameLoop);
                    return;
                }
            }
        } else if (gameState === "menu") {
             // Clear canvas for menu state if needed (e.g., show title/instructions)
             // ctx.clearRect(0, 0, canvas.width, canvas.height);
             // Potentially draw menu elements on canvas if desired
        }
        requestAnimationFrame(gameLoop);
    }

    function drawBall() {
        if (ballIcon && ballIcon.complete) {
            // Draw ball slightly larger for better visibility/icon representation
            ctx.drawImage(ballIcon, x - r * 1.3, y - r * 1.3, 2.6 * r, 2.6 * r);
        } else {
            // Fallback circle
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = "#FFD700";
            ctx.fill();
            ctx.closePath();
        }
    }

    function drawSlider() {
         if (paddleImage && paddleImage.complete) {
            // Draw paddle image at slider position and dimensions
            ctx.drawImage(paddleImage, sliderX, canvas.height - sliderHeight - 5, sliderWidth, sliderHeight + 10); // Draw slightly taller
         } else {
            // Fallback rectangle if image fails
            ctx.beginPath();
            ctx.rect(sliderX, canvas.height - sliderHeight, sliderWidth, sliderHeight);
            ctx.fillStyle = "#999";
            ctx.fill();
            ctx.closePath();
         }
    }

    function resetGame() {
        score = 0;
        x = canvas.width / 2;
        y = canvas.height - 50; // Reset start position
        // Give a random initial horizontal direction but consistent speed
        let initialSpeed = 6; // Control overall speed
        dx = (Math.random() < 0.5 ? 1 : -1) * initialSpeed * 0.707; // Start at 45 degrees
        dy = -initialSpeed * 0.707;

        objects = [];
        if (allImagesLoaded) { // Only setup if images are ready
            setupObjects();
        }
        sliderX = (canvas.width - sliderWidth) / 2; // Center slider
        rightPressed = false; // Reset controls state
        leftPressed = false;
    }

    function showMenu() {
        gameState = "menu";
        document.getElementById("menu").style.display = "flex";
        // Optionally clear canvas or draw a menu screen here
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Hide legend when in menu? Optional.
        // document.getElementById("legend").style.display = 'none';
    }

    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);

    function keyDownHandler(e) {
        if (gameState !== "playing") return;
        if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
        else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
    }

    function keyUpHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
        else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
    }

    document.getElementById("playBtn").addEventListener("click", function () {
        document.getElementById("menu").style.display = "none";
        // document.getElementById("legend").style.display = 'block'; // Ensure legend is visible
        gameState = "playing";
        resetGame(); // Reset game state and setup objects
        // Start game loop if it wasn't running (it should be via requestAnimationFrame)
    });

    document.getElementById("infoBtn").addEventListener("click", function () {
        info(); // Assumes info() function is defined globally or within scope
    });

    // Initial setup
    populateLegend(); // Populate legend on page load
    showMenu(); // Start with the menu visible
    requestAnimationFrame(gameLoop); // Start the loop immediately

    // Optional: Add resize handler if needed, though layout handles some responsiveness
    window.addEventListener('resize', () => {
        // Basic example: could adjust canvas size and redraw, but complex for this game
        // canvas.width = Math.min(window.innerWidth * 0.6, 1000);
        // canvas.height = Math.min(window.innerHeight * 0.65, 700);
        // Re-center slider? recalculate brick positions? Might be simpler to prompt refresh on resize.
        // sliderX = (canvas.width - sliderWidth) / 2;
        // if(gameState === 'playing') { setupObjects(); } // Reset bricks might be too disruptive
        console.log("Window resized. For best results, consider refreshing if layout is broken.");
    });

});