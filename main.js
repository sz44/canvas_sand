const CELL_SIZE = 55;
const ROWS = 10;
const COLS = 12;

const canvas = document.querySelector("canvas");
canvas.height = CELL_SIZE * ROWS;
canvas.width = CELL_SIZE * COLS;
const ctx = canvas.getContext("2d");

let Grid = makeGrid();
let empty = "#292929";
let filled = "#ff0000";

canvas.addEventListener("click", (e) => {
  let [x, y] = [e.offsetX, e.offsetY];
  console.log(x, y);
  let row = Math.floor(y / CELL_SIZE);
  let col = Math.floor(x / CELL_SIZE);
  console.log(row, col);
  Grid[row][col] = 1;
  console.log(Grid);
});

const Game = {
  cells: [],
  update() {
    for (let row in Grid) {
      for (let col in Grid[0]) {
        if (Grid[row][col] == 1) {
          
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

function loop() {
  Game.update()
  Game.draw()
  requestAnimationFrame(loop);
}
loop()

function makeGrid() {
  let grid = [];
  for (let i = 0; i<ROWS; i++) {
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