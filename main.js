const CELL_SIZE = 35;
const ROWS = 16;
const COLS = 22;

const canvas = document.querySelector("canvas");
canvas.height = CELL_SIZE * ROWS;
canvas.width = CELL_SIZE * COLS;
const ctx = canvas.getContext("2d");

let Grid = makeGrid();
let empty = "#292929";
let filled = "#0fe2e2";

let mouseDown = false;

canvas.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    let [x, y] = [e.offsetX, e.offsetY];
    let row = Math.floor(y / CELL_SIZE);
    let col = Math.floor(x / CELL_SIZE);
    Grid[row][col] = 1;
  }
});

canvas.addEventListener("mousedown", (e) => {
  let [x, y] = [e.offsetX, e.offsetY];
  let row = Math.floor(y / CELL_SIZE);
  let col = Math.floor(x / CELL_SIZE);
  Grid[row][col] = 1;
  mouseDown = true;
});
canvas.addEventListener("mouseup", (e) => {
  mouseDown = false;
});

const Game = {
  update() {
    for (let y = ROWS - 1; y >= 0; y--) {
      for (let x = COLS - 1; x >= 0; x--) {
        if (Grid[y][x] === 1 && y < ROWS - 1 && Grid[y + 1][x] === 0) {
          [Grid[y][x], Grid[y + 1][x]] = [Grid[y + 1][x], Grid[y][x]];
        }
      }
    }
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

let speed = 10;
let lastRun = 0;
function loop() {
  if (Date.now() - lastRun > speed) {
    Game.draw()
    Game.update()
    lastRun = Date.now();
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

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vel = 1;
    this.color = "#ff0000";
  }
  update() {
    this.y += this.vel;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, CELL_SIZE, CELL_SIZE);
  }
}