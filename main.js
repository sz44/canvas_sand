const CELL_SIZE = 55;
const ROWS = 12;
const COLS = 10;

const canvas = document.querySelector("canvas");
canvas.height = CELL_SIZE * ROWS;
canvas.width = CELL_SIZE * COLS;
const ctx = canvas.getContext("2d");

canvas.addEventListener("click", (e) => {
  let x = e.offsetX;
  let y = e.offsetY;
  cell = new Cell(x,y);
  Game.cells.push(cell);
});

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

class Grid {

}

const Game = {
  cells : [],
  update() {
    for (cell of this.cells) {
      cell.update();
    }
  },
  draw() {
    ctx.clearRect(0,0, canvas.width, canvas.height)
    for (cell of this.cells) {
      cell.draw();
    }
  }
}

function loop() {
  Game.update()
  Game.draw()
  requestAnimationFrame(loop);
}
loop()