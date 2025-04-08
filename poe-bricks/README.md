# PoE Currency Brick Breaker 🧱🎮

A classic Breakout / Arkanoid style game built with HTML5 Canvas and JavaScript, themed around Path of Exile currency items. Break all the currency orbs to win!

## Description

This is a simple web-based game where the player controls a paddle at the bottom of the screen to bounce a ball (a Vaal Orb!) upwards. The objective is to break all the "bricks" (represented by various Path of Exile currency icons) by hitting them with the ball. Each currency type has different point values and spawn weights based on its in-game rarity/value. Don't let the ball fall below the paddle!

## Features

*   Classic Breakout-style gameplay.
*   Path of Exile theme using currency icons for bricks and score, and a Vaal Orb for the ball.
*   Bricks are generated with weighted randomness based on the `currencyTypes` array (rarer currency is worth more points but appears less often).
*   Score tracking.
*   Persistent High Score using browser `localStorage`.
*   Paddle control using Left/Right Arrow keys.
*   Ball physics including variable angle bounce off the paddle.
*   Win condition (all bricks cleared) and Lose condition (ball hits the bottom).
*   Simple Start Menu.
*   Uses SweetAlert2 for clean win/loss notifications.

## How to Play

1.  Click the "Start Game" button on the menu.
2.  Use the **Left Arrow Key** (`←`) to move the paddle left.
3.  Use the **Right Arrow Key** (`→`) to move the paddle right.
4.  Bounce the Vaal Orb off the paddle to break the currency bricks above.
5.  Clear all the bricks to win the game.
6.  If the ball falls below your paddle, you lose.
7.  Try to beat your high score!

## Running Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```
2.  **Ensure you have the necessary files:**
    *   An `index.html` file (to host the canvas and load the script).
    *   The JavaScript file (e.g., `script.js` containing the provided code).
    *   An `assets/` folder containing all the required `.png` images (`VaalOrb.png`, `HeistCoinCurrency.png`, and all the currency files listed in `currencyTypes`).
    *   *(Optional but recommended)* A basic `style.css` for layout/menu styling.
    *   Make sure SweetAlert2 is included in your `index.html` (e.g., via CDN `<script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>`).
3.  **Run from a local web server:** Because the game loads local image assets, opening the `index.html` file directly in the browser (using `file:///...`) might lead to security errors (CORS policy). You need to serve the files using a simple local web server.
    *   **Using Python 3:**
        ```bash
        python -m http.server
        ```
    *   **Using Node.js (requires `http-server` installed: `npm install -g http-server`):**
        ```bash
        http-server .
        ```
    *   **Using VS Code:** Use the "Live Server" extension.
4.  **Open the game:** Navigate to the local server address (usually `http://localhost:8000` or `http://127.0.0.1:8080`) in your web browser.

## Technology Stack

*   HTML5 (Canvas API)
*   CSS3 (for basic styling/menu)
*   JavaScript (ES6+)
*   SweetAlert2 (for notifications)

## Assets

*   All game assets (currency icons, Vaal Orb, Heist Coin) are from the game Path of Exile by Grinding Gear Games.
*   This project is a fan-made creation for educational/demonstration purposes and is not affiliated with or endorsed by Grinding Gear Games.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License
* MIT License
