const CELL_SIZE = 15;
const ROWS = 32;
const COLS = 42;

const canvas = document.querySelector("canvas");
canvas.height = CELL_SIZE * ROWS;
canvas.width = CELL_SIZE * COLS;
const ctx = canvas.getContext("2d");

let Grid = makeGrid();
let empty = "#292929";
let filled = "#214f6c";

let mouse = {x: 0, y: 0}

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

let speed = 50;
let lastRun = 0;
function loop() {
  if (mouseDown && mouse.y >= 0 && mouse.y < canvas.height) {
    let row = Math.floor(mouse.y / CELL_SIZE);
    let col = Math.floor(mouse.x / CELL_SIZE);
    Grid[row][col] = 1;
  }
  Game.draw()
  if (Date.now() - lastRun > speed) {
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