const CELL_SIZE = 10;
const ROWS = 42;
const COLS = 52;

const INIT_VEL = 1;

const canvas = document.querySelector("canvas");
canvas.height = CELL_SIZE * ROWS;
canvas.width = CELL_SIZE * COLS;
const ctx = canvas.getContext("2d");

let Grid = makeGrid();
let velGrid = makeGrid();
let empty = "#292929";
let filled = "#214f6c";

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
        if (Grid[y][x] === 1) {
          if (y === 40 && x === 1) {
            console.log("y: ", y, "x: ", x);
          }
          if (y < ROWS - 1 && (Grid[y + 1][x] === 0 || velGrid[y + 1][x] === 1)) {
            if (y === 40 && x === 1) {
              console.log("in first if");
            }
            nextGrid[y + 1][x] = 1;

            // decide how to set vel
            if (y + 1 === ROWS - 1 || (nextGrid[y + 2][x] === 1 && nextVelGrid[y + 2][x] === 0)) {
              nextVelGrid[y + 1][x] = 0;
            } else {
              nextVelGrid[y + 1][x] = 1;
            }
          } else if (y < ROWS - 1 && Grid[y + 1][x] === 1 && velGrid[y + 1][x] === 0) {
            let dir = Math.sign(Math.random(1) - 0.5);

            if (x > 0 && (Grid[y + 1][x + dir] === 0 || velGrid[y + 1][x + dir] === 1)) {
              nextGrid[y + 1][x + dir] = 1;
              console.log("sliding down to: ", y + 1, x + dir);
              // decide how to set vel
              if (y + 1 === ROWS - 1 || (nextGrid[y + 2][x + dir] === 1 && nextVelGrid[y + 2][x + dir] === 0)) {
                nextVelGrid[y + 1][x + dir] = 0;
              } else {
                nextVelGrid[y + 1][x + dir] = 1;
              }
            } else {
              nextGrid[y][x] = 1;
              nextVelGrid[y][x] = 0;
            }

          } else {
            // reason for falling bug was that here nextGrid is set not Grid, so new inserted squares kept vel 1
            nextGrid[y][x] = 1;
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
        } else {
          ctx.fillStyle = filled;
        }
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}

let fps = 10;
let frameTime = 1000 / fps;
let lastRun = 0;
function loop() {
  requestAnimationFrame(loop);
  if (mouseDown && mouse.y >= 0 && mouse.y < canvas.height) {
    let row = Math.floor(mouse.y / CELL_SIZE);
    let col = Math.floor(mouse.x / CELL_SIZE);
    // don't change vel if cell already filled to avoid falling above
    if (Grid[row][col] === 0) {
      console.log("inserted at:", row, col);
      Grid[row][col] = 1;
      velGrid[row][col] = 1;
    } else {
      Grid[row][col] = 1;
    }
  }
  Game.draw();
  let elapsed = Date.now() - lastRun;
  if (elapsed > frameTime) {
    Game.update()
    lastRun = Date.now() - (elapsed % frameTime);
  }
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