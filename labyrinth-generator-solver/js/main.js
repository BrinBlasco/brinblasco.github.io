const rowsField = document.querySelector("#numrowsDisp");
const colsField = document.querySelector("#numcolsDisp");
const cellField = document.querySelector("#cellsizeDisp");
const frameField = document.querySelector("#framerateDisp");

const dispFields = [rowsField, colsField, cellField, frameField];

let defaultValues = {
    rows : 10, 
    cols : 10,
    cellsize : 50,
    fps: 0
};

let step = 0;
document.querySelectorAll('input[type="range"]').forEach((el, i) => {
    el.addEventListener("input", (e) => {
        dispFields[i].textContent = e.target.value;
        defaultValues[Object.keys(defaultValues)[i]] = parseInt(e.target.value);
        step = 0;
    }); 
});


const arrow = document.querySelector(".right .back-arrow");
const generateButton = document.querySelector("#generate");
const mazeParameters = document.querySelector(".right .maze-parameters");
const solvingAlgorithms = document.querySelector(".right .solving-algorithms");
const solveButton = document.querySelector("#solve");
const clearButton = document.querySelector("#clear");

arrow.style.display = "none";
arrow.addEventListener("click", () => {
    solvingAlgorithms.classList.toggle("hidden");
    mazeParameters.classList.toggle("hidden");
    arrow.classList.toggle("rotate");
});

let startingIndex = 0;
let maze = null;
generateButton.addEventListener("click", async (e) => {  

    if (step == 0){
        maze = new Maze(...Object.values(defaultValues));
        maze.initCanvas("overlay");
        maze.initCanvas("grid");
        maze.initGrid();
        maze.initDragger();

        maze.dragger.addSquare(0);
        maze.dragger.enableDragging();
        
        step++;
        return;
    }
    maze.dragger.disableDragging();

    startingIndex = maze.dragger.squares.at(0)?.index || 0;
    maze.dragger.reset();

    arrow.style.display = "none";
    generateButton.disabled = true;

    document.querySelectorAll(".dispAlg").forEach(el => {
        el.textContent = "";
    });
    
    await maze.generateMaze(startingIndex);

    arrow.style.display = "flex";
    generateButton.disabled = false;
    clearButton.disabled = true;
    solveButton.disabled = true;

    document.querySelectorAll("input[name='alg']").forEach(rb => {
        rb.addEventListener("change", () => {
            solveButton.disabled = !document.querySelector("input[name='alg']:checked");
        });
    });

    solveButton.addEventListener("click", async () => {

        let alg = document.querySelector("input[name='alg']:checked")?.value || "default";
        solveButton.disabled = true;
        clearButton.disabled = true;
        arrow.style.display = "none";

        maze.ctx["overlay"].reset();
        
        switch (alg) {
            case "dfs":
                await maze.solveMazeDfs();
                break;
            case "bfs":
                await maze.solveMazeBfs();
                break;
            case "dijkstra":
                await maze.solveMazeDijkstra();
                break; 
            case "astar":
                await maze.solveMazeAstar();
                break;
            default:
                console.log("Unlockey u hit default");
                break;
        }

        arrow.style.display = "flex";
        solveButton.disabled = false;
        clearButton.disabled = false;
        maze.dragger.disableDragging();
    });

    clearButton.addEventListener("click", () => {
        maze.ctx["overlay"].reset();
        clearButton.disabled = true;
        maze.resetVisited();
        maze.dragger.reset();
        maze.dragger.addSquare(0);
        maze.dragger.addSquare(maze.grid.length-1);
        maze.dragger.enableDragging();

        document.querySelectorAll(".dispAlg").forEach(el => {
            el.textContent = "";
        });
    });

});
 