const CELL_SIZE = 15;
const ROWS = 42;
const COLS = 52;

const canvas = document.querySelector("canvas");
canvas.height = CELL_SIZE * ROWS;
canvas.width = CELL_SIZE * COLS;
const ctx = canvas.getContext("2d");

let Grid = makeGrid();
let velGrid = makeGrid();
let empty = "#292929";
let filled = "#214f6c";
let filled2 = "#3b6d22";
let filled3 = "#6c5321";

let mouse = { x: 0, y: 0 };

let mouseDown = false;

canvas.addEventListener("mousemove", (e) => {
  let [x, y] = [e.offsetX, e.offsetY];
  mouse.x = x;
  mouse.y = y;
});

canvas.addEventListener("mousedown", (e) => {
  let [x, y] = [e.offsetX, e.offsetY];
  mouse.x = x;
  mouse.y = y;
  mouseDown = true;
});

window.addEventListener("mouseup", (e) => {
  mouseDown = false;
});

const Game = {
  update() {
    let nextGrid = makeGrid();
    let nextVelGrid = makeGrid();
    for (let y = ROWS - 1; y >= 0; y--) { 
      for (let x = COLS - 1; x >= 0; x--) {
        if (Grid[y][x] > 0) {
          if (y === 39 && x === 1) {
            console.log("y: ", y, "x: ", x);
          }
          if (y < ROWS - 1 && (Grid[y + 1][x] === 0 || velGrid[y+1][x] === 1)) {
            if (y === 40 && x === 1) {
              console.log("in first if");
            }
            nextGrid[y + 1][x] = Grid[y][x];

            // decide how to set vel
            if (y + 1 === ROWS - 1 || (nextGrid[y + 2][x] > 0 && nextVelGrid[y + 2][x] === 0)) {
              nextVelGrid[y + 1][x] = 0;
            } else {
              nextVelGrid[y + 1][x] = 1;
            }
          } else if (y < ROWS - 1 && Grid[y + 1][x] > 0 && velGrid[y + 1][x] === 0) {
            let dir = Math.sign(Math.random(1) - 0.5);

            if (Grid[y + 1][x + dir] === 0 || velGrid[y + 1][x + dir] === 1) {
              nextGrid[y + 1][x + dir] = Grid[y][x];
              console.log("sliding down to: ", y + 1, x + dir);
              // decide how to set vel
              if (y + 1 === ROWS - 1 || (nextGrid[y + 2][x + dir] > 0  && nextVelGrid[y + 2][x + dir] === 0)) {
                nextVelGrid[y + 1][x + dir] = 0;
              } else {
                nextVelGrid[y + 1][x + dir] = 1;
              }
              // it works pretty well without this ...
            } else if (Grid[y + 1][x - dir] === 0 || velGrid[y + 1][x - dir] === 1) {
              nextGrid[y + 1][x - dir] = Grid[y][x];
              if (y + 1 === ROWS - 1 || (nextGrid[y + 2][x - dir] > 0  && nextVelGrid[y + 2][x - dir] === 0)) {
                nextVelGrid[y + 1][x - dir] = 0;
              } else {
                nextVelGrid[y + 1][x - dir] = 1;
              }
            } else {
              nextGrid[y][x] = Grid[y][x];
              nextVelGrid[y][x] = 0;
            }

          } else {
            // reason for falling bug was that here nextGrid is set not Grid, so new inserted squares kept vel 1
            nextGrid[y][x] = Grid[y][x];
            nextVelGrid[y][x] = 0;
          }
        }
      }
    }
    Grid = nextGrid;
    velGrid = nextVelGrid;
  },

  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let y in Grid) {
      for (let x in Grid[0]) {
        if (Grid[y][x] === 0) {
          ctx.fillStyle = empty;
        } else if (Grid[y][x] == 1){
          ctx.fillStyle = filled;
        } else if (Grid[y][x] == 2) {
          ctx.fillStyle = filled2;
        }else if (Grid[y][x] == 3) {
          ctx.fillStyle = filled3;
        }
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}

let color = 1;

let fps = 9;
let frameTime = 1000 / fps;
let lastRun = 0;
function loop() {
  let elapsed = Date.now() - lastRun;
  if (elapsed > frameTime) {
    if (mouseDown && mouse.y >= 0 && mouse.y < canvas.height) {
      let row = Math.floor(mouse.y / CELL_SIZE);
      let col = Math.floor(mouse.x / CELL_SIZE);
      // don't change vel if cell already filled to avoid falling above
      if (Grid[row][col] === 0) {
        console.log("inserted at:", row, col);
        console.log("color:", color);
        Grid[row][col] = color;
        velGrid[row][col] = 1;
        color = (color++ % 3) + 1
      } else {
        Grid[row][col] = color;
        color = (color++ % 3) + 1
      }
    }
    Game.draw();
    Game.update()
    lastRun = Date.now() - (elapsed % frameTime);
  }
  requestAnimationFrame(loop);
}
loop()

function makeGrid() {
  let grid = [];
  for (let i = 0; i < ROWS; i++) {
    let row = [];
    for (let j = 0; j < COLS; j++) {
      row.push(0);
    }
    grid.push(row);
  }
  return grid;
}