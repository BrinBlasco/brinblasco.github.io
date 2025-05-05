<?php
    session_start();

    function initializeGame(array $playerNames, int $numDice, int $numTurns): array {
        $players = [];
        foreach ($playerNames as $name) {
            $trimmedName = trim($name);
            if (empty($trimmedName)) {
                $trimmedName = 'Player';
            }
            $players[] = ['name' => $trimmedName, 'score' => 0, 'lastRoll' => []];
        }

        if (empty($players)) {
            $players[] = ['name' => 'Player 1', 'score' => 0, 'lastRoll' => []];
        }

        return [
            'players' => $players,
            'num_dice' => max(1, $numDice),
            'num_turns' => max(1, $numTurns),
            'current_turn' => 1,
            'current_player_index' => 0,
            'game_over' => false,
            'winner_message' => '',
            'last_roll_total' => 0,
            'is_rolling' => false
        ];
    }

    function rollDice(int $numDice): array {
        $rolls = [];
        for ($i = 0; $i < $numDice; $i++) {
            $rolls[] = rand(1, 6);
        }
        return $rolls;
    }

    function determineWinner(array $players): string {
        if (empty($players)) {
            return "No players in the game.";
        }

        $highScore = -1;
        foreach ($players as $player) {
            if ($player['score'] > $highScore) {
                $highScore = $player['score'];
            }
        }

        if ($highScore <= 0) {
            $allZero = true;
            foreach ($players as $player) {
                if ($player['score'] != 0) {
                    $allZero = false;
                    break;
                }
            }
            if ($allZero && $highScore == 0) {} else if ($highScore < 0) {}
        }

        $winners = [];
        foreach ($players as $player) {
            if ($player['score'] == $highScore) {
                $winners[] = $player['name'];
            }
        }

        if (count($winners) === 1) {
            return htmlspecialchars($winners[0]) . " wins with a score of " . $highScore . "!";
        } elseif (count($winners) > 1) {
            $escaped_winners = array_map('htmlspecialchars', $winners);
            return "It's a tie between " . implode(', ', $escaped_winners) . " with a score of " . $highScore . "!";
        } else {
            return "Game over! No winner could be determined.";
        }
    }


    $action = $_POST['action'] ?? null;
    $game_state = $_SESSION['game_state'] ?? null;
    $setup_error = null;

    if ($action === 'setup') {
        $playerNamesInput = $_POST['player_names'] ?? [];
        $numDiceInput = $_POST['num_dice'] ?? null;
        $numTurnsInput = $_POST['num_turns'] ?? null;

        $playerNames = [];
        if(is_array($playerNamesInput)) {
            foreach($playerNamesInput as $name) {
                $trimmedName = trim($name);
                if (!empty($trimmedName)) {
                    $playerNames[] = $trimmedName;
                }
            }
        }

        $numDice = filter_var($numDiceInput, FILTER_VALIDATE_INT);
        $numTurns = filter_var($numTurnsInput, FILTER_VALIDATE_INT);

        if (!empty($playerNames) && $numDice !== false && $numDice > 0 && $numTurns !== false && $numTurns > 0) {
            $_SESSION['game_state'] = initializeGame($playerNames, $numDice, $numTurns);
            header("Location: " . $_SERVER['PHP_SELF']);
            exit;
        } else {
            $setup_error = "Please provide at least one valid player name and select valid numbers (greater than 0) for dice and turns.";
            unset($_SESSION['game_state']);
            $game_state = null;
        }

    } elseif ($action === 'roll' && $game_state && !$game_state['game_over']) {
        $currentPlayerIndex = $game_state['current_player_index'];
        $numDice = $game_state['num_dice'];
        $diceRolls = rollDice($numDice);
        $rollTotal = array_sum($diceRolls);

        $game_state['players'][$currentPlayerIndex]['score'] += $rollTotal;
        $game_state['players'][$currentPlayerIndex]['lastRoll'] = $diceRolls;
        $game_state['last_roll_total'] = $rollTotal;

        $nextPlayerIndex = ($currentPlayerIndex + 1) % count($game_state['players']);
        $game_state['current_player_index'] = $nextPlayerIndex;

        if ($nextPlayerIndex === 0) {
            $game_state['current_turn']++;
        }

        if ($game_state['current_turn'] > $game_state['num_turns']) {
            $game_state['game_over'] = true;
            $game_state['winner_message'] = determineWinner($game_state['players']);
            $game_state['current_player_index'] = $currentPlayerIndex;
        }

        $_SESSION['game_state'] = $game_state;
        header("Location: " . $_SERVER['PHP_SELF']);
        exit;

    } elseif ($action === 'restart') {
        unset($_SESSION['game_state']);
        header("Location: " . $_SERVER['PHP_SELF']);
        exit;
    }

    $game_state = $_SESSION['game_state'] ?? null;
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP Dice Game</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <div class="game-container">

        <?php if (!$game_state): ?>
            <h1 class="text-5xl font-bold text-center mb-6 text-red-500">Dice Game</h1>

            <?php if ($setup_error): ?>
                <div class="message-box bg-red-700 text-white p-4 rounded-lg mb-4 text-center">
                    <?php echo htmlspecialchars($setup_error); ?>
                </div>
            <?php endif; ?>

            <form action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" method="post">
                <input type="hidden" name="action" value="setup">

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-24">
                    <div class="settings-card">
                        <h3 class="text-xl">Settings</h3>
                        <div>
                            <label for="num_dice">Number of Dice per Roll:</label>
                            <select id="num_dice" name="num_dice" required class="w-full p-2 rounded bg-gray-700 border border-gray-600 mb-3">
                                <?php for ($i = 1; $i <= 6; $i++): ?>
                                    <option value="<?php echo $i; ?>" <?php echo ($i == 2) ? 'selected' : ''; ?>><?php echo $i; ?></option>
                                <?php endfor; ?>
                            </select>
                        </div>
                        <div>
                            <label for="num_turns">Number of Turns:</label>
                            <select id="num_turns" name="num_turns" required class="w-full p-2 rounded bg-gray-700 border border-gray-600">
                                <?php foreach ([1, 3, 5, 10, 15, 20] as $turns): ?>
                                     <option value="<?php echo $turns; ?>" <?php echo ($turns == 5) ? 'selected' : ''; ?>><?php echo $turns; ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                    </div>

                     <div class="settings-card">
                        <h3 class="text-xl">Players</h3>
                        <div id="player-inputs">
                            <div class="player-input-group">
                                <label for="player_name_1">Player 1 Name:</label>
                                <input type="text" id="player_name_1" name="player_names[]" placeholder="Enter Player Name" required class="w-full p-2 rounded bg-gray-700 border border-gray-600">
                            </div>
                        </div>
                        <button type="button" id="add-player-btn" class="add-player-btn" title="Add Player">+</button>
                     </div>
                </div>

                <div class="text-center">
                    <button type="submit" class="btn btn-primary w-full md:w-auto">Start Game</button>
                </div>
            </form>

            <script>
                const addPlayerBtn = document.getElementById('add-player-btn');
                const playerInputsDiv = document.getElementById('player-inputs');
                let playerCount = 1;

                addPlayerBtn.addEventListener('click', function() {
                    playerCount++;
                    const playerId = 'player_name_' + playerCount;

                    const newPlayerGroup = document.createElement('div');
                    newPlayerGroup.className = 'player-input-group';

                    const newLabel = document.createElement('label');
                    newLabel.htmlFor = playerId;
                    newLabel.textContent = 'Player ' + playerCount + ' Name:';
                    newLabel.style.marginBottom = '5px';

                    const newInput = document.createElement('input');
                    newInput.type = 'text';
                    newInput.id = playerId;
                    newInput.name = 'player_names[]';
                    newInput.placeholder = 'Enter Player Name';
                    newInput.className = 'w-full p-2 rounded bg-gray-700 border border-gray-600';

                    const removeBtn = document.createElement('button');
                    removeBtn.type = 'button';
                    removeBtn.textContent = '✕';
                    removeBtn.className = 'remove-player-btn';
                    removeBtn.title = 'Remove Player ' + playerCount;
                    removeBtn.onclick = function() {
                        newPlayerGroup.remove();
                    };

                    newPlayerGroup.appendChild(newLabel);
                    newPlayerGroup.appendChild(newInput);
                    newPlayerGroup.appendChild(removeBtn);

                    playerInputsDiv.appendChild(newPlayerGroup);
                    newInput.focus();
                });
            </script>

        <?php else: ?>
            <h1 class="text-3xl font-bold text-center mb-4 text-red-500">Dice Game</h1>

            <div class="turn-info text-center mb-6">
                <?php if (!$game_state['game_over']): ?>
                    Turn <?php echo htmlspecialchars($game_state['current_turn']); ?>
                    of <?php echo htmlspecialchars($game_state['num_turns']); ?> |
                    Current Player: <strong><?php echo htmlspecialchars($game_state['players'][$game_state['current_player_index']]['name']); ?></strong>
                <?php else: ?>
                    Game Over!
                <?php endif; ?>
            </div>

            <div class="grid-container mb-6">
                <?php
                $lastPlayerRolledIndex = -1;
                    if ($game_state['last_roll_total'] > 0 || ($game_state['current_turn'] > 1 || $game_state['current_player_index'] > 0)) {
                        $lastPlayerRolledIndex = ($game_state['current_player_index'] - 1 + count($game_state['players'])) % count($game_state['players']);
                    }
                    if ($game_state['game_over']) {
                        $lastPlayerRolledIndex = $game_state['current_player_index'];
                    }

                foreach ($game_state['players'] as $index => $player): ?>

                    <div class="player-card <?php echo (!$game_state['game_over'] && $index == $game_state['current_player_index']) ? 'border-2 border-yellow-400 shadow-lg' : ''; ?> <?php echo ($game_state['game_over'] && $index == $lastPlayerRolledIndex) ? 'opacity-90' : ''; ?> ">
                        <h3 class="text-lg"><?php echo htmlspecialchars($player['name']); ?></h3>
                        <div class="score"><?php echo htmlspecialchars($player['score']); ?></div>
                        <div class="dice-area">
                            <?php if (!empty($player['lastRoll']) && ($index === $lastPlayerRolledIndex || $game_state['game_over'])) : ?>
                                <div class="dice-info-text">
                                    <span class="label">Last Roll:</span>
                                    <div class="flex justify-center flex-wrap py-1">
                                    <?php foreach ($player['lastRoll'] as $roll): ?>
                                        <img src="./assets/dice<?php echo $roll; ?>.png" alt="Dice <?php echo $roll; ?>">
                                    <?php endforeach; ?>
                                    </div>
                                    Total: <strong><?php echo array_sum($player['lastRoll']); ?></strong>
                                </div>
                            <?php elseif ($game_state['game_over']) : ?>
                                <span class="dice-info-text italic">Finished</span>
                            <?php else : ?>
                                <span class="dice-info-text italic">Waiting...</span>
                            <?php endif; ?>
                        </div>
                    </div>

                <?php endforeach; ?>
            </div>

            <div class="text-center mt-6">
                <?php if ($game_state['game_over']): ?>
                    <div class="winner-message mb-4">
                        <?php echo $game_state['winner_message']; ?>
                    </div>
                    <form action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" method="post" class="inline-block">
                        <input type="hidden" name="action" value="restart">
                        <button type="submit" class="btn btn-danger">Restart Game</button>
                    </form>
                <?php else: ?>
                    <form action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" method="post" class="inline-block">
                        <input type="hidden" name="action" value="roll">
                        <button type="submit" class="btn btn-primary w-full sm:w-auto mb-2 sm:mb-0">
                            Roll for <?php echo htmlspecialchars($game_state['players'][$game_state['current_player_index']]['name']); ?>
                        </button>
                    </form>
                     <form action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" method="post" class="inline-block sm:ml-4">
                        <input type="hidden" name="action" value="restart">
                        <button type="submit" class="btn btn-danger w-full sm:w-auto">Restart Game</button>
                    </form>
                <?php endif; ?>
            </div>

        <?php endif; ?>

    </div>

</body>
</html>