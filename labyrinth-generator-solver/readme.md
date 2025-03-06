# Labyrinth - Maze Generator and Solver

## Overview

Labyrinth is a web-based maze generator and solver that allows users to create and solve mazes using various algorithms. Whether you're interested in generating random mazes or solving them with depth-first search (DFS), breadth-first search (BFS), Dijkstra's algorithm, or A\* (A-Star), this project provides an interactive and visually appealing platform for exploring these concepts.

The project uses JavaScript along with HTML5 Canvas for rendering and manipulating the maze grid. Users can customize the maze parameters such as the number of rows, columns, cell size, and frame rate to suit their preferences.

---

## Features

- **Maze Generation**: Generate random mazes using Depth-First Search (DFS).
- **Solving Algorithms**: Solve mazes using:
  - Depth-First Search (DFS)
  - Breadth-First Search (BFS)
  - Dijkstra's Algorithm
  - A\* (A-Star) Algorithm
- **Customization**: Adjust maze dimensions, cell size, and frame rate.
- **Interactive Interface**: Drag-and-drop functionality to set start and end points.
- **Visualization**: Watch the maze generation and solving processes step-by-step.
- **Performance Metrics**: View expanded nodes and path lengths for each algorithm.

---

## Installation

To run Labyrinth locally, follow these steps:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/labyrinth.git
   cd labyrinth
   ```

2. **Open the Project**:
   Open the `index.html` file in your preferred web browser. Alternatively, you can serve the project using a local development server.

3. **Dependencies**:
   This project relies solely on vanilla JavaScript, so no external libraries or frameworks are required.

---

## Usage

### Generating a Maze

1. Customize the maze settings by adjusting the sliders for:
   - Number of Rows
   - Number of Columns
   - Cell Size
   - Framerate
2. Click the "Generate" button to create a new maze.
3. Use the drag-and-drop feature to set the start and end points.

### Solving the Maze

1. Choose a solving algorithm from the options provided:
   - DFS
   - BFS
   - Dijkstra's
   - A\*
2. Click the "Solve" button to initiate the solving process.
3. Observe the visualization of the algorithm as it explores the maze and finds the shortest path.
4. Performance metrics such as the number of expanded nodes and path length will be displayed after the solution is found.

### Clearing the Maze

To reset the maze and start over, click the "Clear" button. This will remove any generated paths and allow you to set new start and end points.

---

## Code Structure

The project is organized into several JavaScript files, each responsible for specific functionalities:

- **Utils.js**: Contains utility functions like `setIntervalAwaitable`, `drawRect`, and `drawLine`.

- **Cell.js**: Defines the `Cell` class, which represents individual cells in the maze grid.
- **Dragging.js**: Implements drag-and-drop functionality for setting start and end points.
- **Maze.js**: Handles maze generation, solving algorithms, and visualization.
- **main.js**: Manages user interactions, event listeners, and overall application flow.

---

## Contribution Guidelines

Contributions to Labyrinth are welcome! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix:

   ```bash
   git checkout -b feature-name
   ```

3. Commit your changes:

   ```bash
   git commit -m "Add new feature"
   ```

4. Push your branch to your forked repository:

   ```bash
   git push origin feature-name
   ```

5. Submit a pull request detailing your changes.

Please ensure that your contributions align with the project's coding style and adhere to best practices.

---

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute the code as needed.

---

## Acknowledgments

Special thanks to the open-source community for inspiring this project. The implementation of maze generation and solving algorithms draws inspiration from classic computer science literature and online resources.

---
