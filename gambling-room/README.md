# 🎲 PHP Dice Game

A simple and interactive multiplayer dice game built with **PHP**, **Tailwind CSS**, and **JavaScript**. Players take turns rolling dice across multiple rounds, and the player with the highest score at the end wins!

## 🌟 Features

- Add multiple players dynamically
- Choose number of dice (1–6) and number of turns (1–20)
- Animated dice roll display using dice images
- Tracks each player’s score and last roll
- Declares a winner or tie at the end of the game
- Responsive UI styled with Tailwind CSS
- Clean and secure server-side logic using PHP sessions

## 🚀 Live Demo

*(Optional: Add link if hosted somewhere like GitHub Pages + PHP backend on a server)*

---

## 🛠️ Setup Instructions

### Requirements

- PHP 7.4+ (recommended)
- A local web server like **XAMPP**, **WAMP**, **Laragon**, or a PHP built-in server
- Browser (Chrome, Firefox, Edge, etc.)
- Can be done with XAMPP too, put the files in the xampp/htdocs

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/php-dice-game.git
   cd php-dice-game
   ```

2. **Start a local PHP server**
   ```bash
   php -S localhost:8000
   ```

3. **Open in your browser**
   ```
   http://localhost:8000
   ```

> Or use XAMPP/WAMP by placing the project folder in your `htdocs` directory and navigating via `http://localhost/php-dice-game`.

---

## 🧩 Project Structure

```
php-dice-game/
│
├── assets/
│   └── dice1.png to dice6.png     # Dice face images
│
├── style.css                     # Optional custom styles
├── index.php                     # Main game logic and UI
└── README.md                     # Project documentation
```

---

## ⚙️ How It Works

- On game setup:
  - Users enter player names, choose dice count, and number of turns.
  - PHP initializes session-based game state.

- On each turn:
  - Players roll the dice.
  - Scores and rolls are updated.
  - Turns advance until all rounds complete.

- On game end:
  - The winner (or tie) is displayed.
  - Option to restart the game.

---

## 📸 Screenshots

*(Include some optional screenshots of the game in action if available)*

---

## 🧪 Development Notes

- Uses PHP `$_SESSION` to persist game state between requests
- All logic for game setup, rolling, and winner calculation is done server-side
- Frontend enhancements with TailwindCSS and minimal JS for dynamic player form

---

## ✅ To-Do / Enhancements

- Add sound effects for dice rolls
- Add animations for rolling dice
- Track full game history/log
- Add AI/computer players
- Allow downloadable game results

---

## 📄 License

MIT License. Feel free to use and modify!

---

## 🙌 Credits

- Dice icons from [your source or attribution if needed]
- Built with ❤️ using PHP & Tailwind CSS
