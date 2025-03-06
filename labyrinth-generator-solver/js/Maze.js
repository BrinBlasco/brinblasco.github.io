
class Maze {
    constructor (rows, cols, cellsize, framerate){
        this.rows = rows;
        this.cols = cols;
        this.cellsize = cellsize;
        this.framerate = 1000/framerate;

        this.width = this.cols * cellsize;
        this.height = this.rows * cellsize;
        
        this.ctx = {};
        this.grid = null;
        this.dragger = null;
        
        this.genStart = null;
    }

    initCanvas = (id) => {
        this.destroyCanvas(id);
        const left = document.querySelector(".main .left .maze");
        const cnv = document.createElement("canvas");

        cnv.id = id;
        cnv.width = this.width;
        cnv.height = this.height;

        const ctx = cnv.getContext("2d");
        Object.assign(ctx, {
            globalAlpha : 1.0,
            globalCompositeOperation : "source-over",
            shadowBlur : 0,
            shadowColor : "transparent",
            imageSmoothingEnabled : true,
            imageSmoothingQuality : "high",
            lineCap: "butt",
            lineJoin : "round"
        });

        left.appendChild(cnv);

        this.ctx[id] = ctx;
    }

    destroyCanvas = (id) => {
        if(id){
            let cnv = document.querySelector(`#${id}`);
            if(cnv) cnv.remove();
        } else {
            document.querySelectorAll("canvas").forEach(e => {
                e.remove();
            }); 
        }
    };

    initGrid = () => {
        let grid = [];
        for(let r = 0; r < this.rows; r++){
            for(let c = 0; c < this.cols; c++){
                let cell = new Cell(r, c, this.cellsize);
                grid.push(cell);
                cell.show(this.ctx["grid"]);
            } 
        }
        this.grid = grid;
    };

    initDragger = () => {
        let dragger = new Dragger(this.ctx["overlay"], this.rows, this.cols, this.cellsize);
        this.dragger = dragger;
    }

    refreshGrid = (...kwargs) => {
        if (kwargs.length != 0) {
            kwargs.forEach(cell => {
                cell.show(this.ctx["grid"]);
            })
            return;
        }
        for(let i = 0; i < this.grid.length; i++){
            this.grid[i].show(this.ctx["grid"]);
        }
    };

    index = (r, c) => {
        if(r < 0 || c < 0 || c > this.cols - 1 || r > this.rows - 1) return -1;
        return c + r * this.cols;
    };

    randomNeighbor = (cell) => {
        
        let neighbors = [];

        [ // directions, u,r,d,l
            [-1,  0], [ 0,  1],
            [ 1,  0], [ 0, -1]
        ].forEach(dir => {
            let idx = this.index(cell.r+dir[0], cell.c+dir[1]);
            if(idx == -1) return;

            let nextCell = this.grid[idx];
            if(!nextCell.visited){
                neighbors.push(nextCell);
            }
        });
        
        if (neighbors.length > 0){
            let r = Math.floor(Math.random()*neighbors.length);
            return neighbors[r];
        } else {
            return null;
        }

    };

    getNeighbors = (cell, ignoreWalls = false) => {
        
        let neighbors = [];
        
        const walls = Object.values(cell.walls);

        const directions = [ // directions, u,r,d,l
            [-1,  0], [ 0,  1],
            [ 1,  0], [ 0, -1]
        ];

        directions.forEach(([dr, dc], i) => {
            let idx = this.index(cell.r + dr, cell.c + dc);
            if(idx == -1) return;

            let nextCell = this.grid[idx];
            
            if(!nextCell.visited && (ignoreWalls || !walls[i])){
                neighbors.push(nextCell);
            }
        });

        return neighbors;
    };

    resetVisited = () => {
        for(let cell of this.grid){
            cell.visited = false;
            cell.parent = null;
        }
    };

    highlightPath = async (cell) => {
        await setIntervalAwaitable(() => {
            if(cell.parent){
                cell.parent.drawPath(this.ctx["overlay"], cell, "blue");
                cell = cell.parent;
            } else {
                return true;
            }
        }, 0);
    };

    generateMaze = async (startIndex) => {

        let next;
        let neighbors;
        let stack = [];
        let curr = this.grid[startIndex];
        this.genStart = startingIndex;
        curr.visited = true;

        await setIntervalAwaitable(() => {

            neighbors = this.getNeighbors(curr, true);
            next = neighbors[parseInt(Math.random()*neighbors.length)];
            
            
            if(next){

                next.visited = true;
                
                stack.push(curr);

                curr.removeWalls(next);
                
                curr = next;

                this.refreshGrid();
                return false;

            } else if (stack.length >= 0){

                if(stack.length == 0) {

                    this.resetVisited();

                    this.dragger.addSquare(startIndex);
                    this.dragger.addSquare(this.grid.length-1);
                    this.dragger.enableDragging();

                    let arrow = document.querySelector(".back-arrow");
                    arrow.style.display = "flex";
                    arrow.click();

                    step = 0;

                    return true;
                }

                curr = stack.pop();
                return false;
            }
            

        }, this.framerate);

    };

    solveMazeDfs = async () => {
        //console.log("Solving with Dfs...");
        this.ctx["overlay"].reset();
        this.resetVisited();

        let startAlg = this.dragger.squares[0].index;
        let endAlg = this.dragger.squares[1].index;
        
        let stack = [];
        let curr = this.grid[startAlg];
        let dest = this.grid[endAlg];
        
        let expanded = 0;
        let length = 0;

        stack.push(curr);
        
        await setIntervalAwaitable(() => {
            if (stack.length > 0){

                let v = stack.pop();

                if (v.visited) return false;
                v.visited = true;
                expanded++;

                if (v.r == dest.r && v.c == dest.c){
                    this.highlightPath(v);

                    let pathNode = v;
                    while(pathNode.parent){
                        length++;
                        pathNode = pathNode.parent;
                    }

                    let display = document.getElementById("dispDfs");
                    display.textContent = `Expanded: ${expanded}; Length: ${length}`
                    
                    console.log(`\nDfs Expanded: ${expanded}`);
                    console.log(`Dfs Path Length: ${length}`);
                    return true;
                }

                for(let w of this.getNeighbors(v)){
                    if (w.visited) continue;
                    w.parent = v;
                    stack.push(w);
                    w.highlight(this.ctx["overlay"], true, "cyan");
                }

                if (v.parent) v.parent.drawPath(this.ctx["overlay"], v);

            }
            return false;

        }, defaultValues.fps);

    }

    solveMazeBfs = async () => {
        //console.log("Solving with Bfs...");
        this.ctx["overlay"].reset();
        this.resetVisited();

        let startAlg = this.dragger.squares.at(0).index;
        let endAlg = this.dragger.squares.at(1).index;

        let expanded = 0;
        let length = 0;

        let queue = [];
        let curr = this.grid[startAlg];
        let dest = this.grid[endAlg];
        queue.push(curr);

        await setIntervalAwaitable(() => {
            if (queue.length > 0){

                let v = queue.shift();

                if (v.visited) return false;
                v.visited = true;
                expanded++;

                let w;
                for(w of this.getNeighbors(v)){
                    if (w.visited) continue;
                    w.parent = v;
                    queue.push(w)
                    w.highlight(this.ctx["overlay"], true, "cyan");
                }

                if (v.parent) v.parent.drawPath(this.ctx["overlay"], v);

                if (v.r == dest.r && v.c == dest.c){
                    this.highlightPath(v);

                    let pathNode = v;
                    while(pathNode.parent){
                        length++;
                        pathNode = pathNode.parent;
                    }
                    let display = document.getElementById("dispBfs");
                    display.textContent = `Expanded: ${expanded}; Length: ${length}`
                    
                    console.log(`\nBfs Expanded: ${expanded}`);
                    console.log(`Bfs Path Length: ${length}`);

                    return true;
                }
            }
            return false;

        }, defaultValues.fps);
    };

    solveMazeDijkstra = async () => {
        //console.log("Solving with Dijkstra..."); 
        this.ctx["overlay"].reset();
        this.resetVisited();

        let startAlg = this.dragger.squares[0].index;
        let endAlg = this.dragger.squares[1].index;
        
        let pq = [];
        let distances = new Map();

        let expanded = 0;
        let length = 0;

        let start = this.grid[startAlg];
        let dest = this.grid[endAlg];

        distances.set(start, 0);
        pq.push({ node: start, cost: 0 });

        await setIntervalAwaitable(() => {
            if (pq.length > 0) {
                pq.sort((a, b) => a.cost - b.cost);
                let v = pq.shift().node;

                if (v.visited) return false;
                v.visited = true;
                expanded++;

                if (v.r === dest.r && v.c === dest.c) {
                    this.highlightPath(v);

                    let pathNode = v;
                    while(pathNode.parent){
                        length++;
                        pathNode = pathNode.parent;
                    }
                    let display = document.getElementById("dispDijkstra");
                    display.textContent = `Expanded: ${expanded}; Length: ${length}`
                    
                    console.log(`\nDjkstra's Expanded: ${expanded}`);
                    console.log(`Djkstra's Path Length: ${length}`);

                    return true;
                }

                let w;
                for (w of this.getNeighbors(v)) {
                    if (w.visited) continue;

                    let newCost = distances.get(v) + 1;
                    if (!distances.has(w) || newCost < distances.get(w)) {
                        w.parent = v;
                        distances.set(w, newCost);
                        pq.push({ node: w, cost: newCost });
                        w.highlight(this.ctx["overlay"], true, "cyan");
                    }
                }

                if (v.parent) v.parent.drawPath(this.ctx["overlay"], v);
            }
            return false;
        }, defaultValues.fps);
    }

    solveMazeAstar = async () => {
        // console.log("Solving with Astart...")
        this.ctx["overlay"].reset();
        this.resetVisited();
    
        let startAlg = this.dragger.squares[0].index;
        let endAlg = this.dragger.squares[1].index;

        let length = 0;
        let expanded = 0;
        
        let openSet = [];
        let gScore = new Map();
        let fScore = new Map();
    
        let start = this.grid[startAlg];
        let dest = this.grid[endAlg];
    
        gScore.set(start, 0);
        fScore.set(start, this.heuristic(start, dest));
    
        openSet.push({ node: start, f: fScore.get(start) });
    
        await setIntervalAwaitable(() => {
            if (openSet.length > 0) {
                openSet.sort((a, b) => a.f - b.f);
                let v = openSet.shift().node;
    
                if (v.visited) return false;
                v.visited = true;
                expanded++;
    
                if (v.r === dest.r && v.c === dest.c) {
                    this.highlightPath(v);

                    let pathNode = v;
                    while(pathNode.parent){
                        length++;
                        pathNode = pathNode.parent;
                    }
                    let display = document.getElementById("dispAstar");
                    display.textContent = `Expanded: ${expanded}; Length: ${length}`
                                        

                    console.log(`\nAstar Expanded: ${expanded}`);
                    console.log(`Astar Path Length: ${length}`);

                    return true;
                }
    
                for (let w of this.getNeighbors(v)) {
                    if (w.visited) continue;
    
                    let tentativeG = gScore.get(v) + 1;
                    if (!gScore.has(w) || tentativeG < gScore.get(w)) {
                        w.parent = v;
                        gScore.set(w, tentativeG);
                        fScore.set(w, tentativeG + this.heuristic(w, dest));
    
                        openSet.push({ node: w, f: fScore.get(w) });
                        w.highlight(this.ctx["overlay"], true, "cyan");
                    }
                }
    
                if (v.parent) v.parent.drawPath(this.ctx["overlay"], v);
            }
            return false;
        }, defaultValues.fps);
    };
    
    heuristic = (a, b) => Math.abs(a.r - b.r) + Math.abs(a.c - b.c);
}