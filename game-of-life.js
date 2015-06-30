// Your task is to write a program to calculate the next generation of Conway's Game of Life, given any starting position. You start with a two dimensional grid of cells, where each cell is either alive or dead. The grid is finite, and no life can exist off the edges. When calculating the next generation of the grid, follow these four rules:

// Any live cell with fewer than two live neighbors dies, as if caused by underpopulation.
// Any live cell with more than three live neighbors dies, as if by overcrowding.
// Any live cell with two or three live neighbors lives on to the next generation.
// Any dead cell with exactly three live neighbors becomes a live cell.

var Cell = function(x,y) {
  this.isAlive = false;
  this.x = x;
  this.y = y;

  this.neighbors = null;        

  this.countNeighbors = function() {
    return this.neighbors.filter(function(cell) {
      return cell.isAlive;
    }).length;
  };
};

var Grid = function(width, height, initialState) {
  var me = this;
  var cells = new Array(width * height);

  var living = initialState;

  // instantiate cells
  for(var i = 0; i < width; i++) {
    for(var j = 0; j < height; j++) {
      (function(){
        cells[i + j * width] = new Cell(i, j);
      })();// Self executing function necessary to capture i and j values
           // For-loops in JavaScript DO NOT create scope which is a bummer                       
    }
  }

  cells.forEach(function(cell) {
    cell.neighbors = cells.filter(function(cell2) {
      var dx = Math.abs(cell2.x - cell.x);
      var dy = Math.abs(cell2.y - cell.y);
      return (dx === 1 && dy === 1 ) || (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
    });
  });

  me.seed = function() {
    living.forEach(function(coordinate) {
      cells[coordinate[0] + coordinate[1] * width].isAlive = true;
    });
  };

  me.updateLiving = function() {
    var deadOvercrowded = cells.filter(function(cell) {
      return cell.isAlive && (cell.countNeighbors() > 3);
    });

    var deadUnderpop = cells.filter(function(cell) {
      return cell.isAlive && (cell.countNeighbors() < 2);
    })

    var reproduction = cells.filter(function(cell) {
      return !cell.isAlive && cell.countNeighbors() === 3;
    });

    var livesOn = cells.filter(function(cell) {
      return cell.isAlive && (cell.countNeighbors() === 2 || cell.countNeighbors() === 3);
    });

    deadOvercrowded.concat(deadUnderpop).forEach(function(cell) {
      cell.isAlive = false;
    });

    reproduction.forEach(function(cell) {
      cell.isAlive = true;
    });
    livesOn.forEach(function(cell) {
      cell.isAlive = true;
    });
  };

  me.populate = function() {
    var printedGrid = "\n", counter = 1;

    for (var i = 0; i < cells.length; i++) {
      if (counter === width) { printedGrid += " " + determineShape(cells[i].isAlive) + " \n"; counter = 1; }
      else { printedGrid += " " + determineShape(cells[i].isAlive) + " "; counter += 1; }
    }
    return printedGrid;
  };

  me.start = function() {
    me.seed();
    setInterval(function() { 
      clearScreen();
      console.log(me.populate());
      me.updateLiving();
    }, 500);
  };

  function clearScreen() { process.stdout.write('\033c'); }

  function determineShape(state) {
    if (state === false) { return "\u25A9"; } 
    else { return "\u25C8"; }
  }

  function lastRow(index) {
    if (index >= cells.length - width && index < cells.length) { return true; }
    return false;
  }
};

var grid = new Grid(5, 5, [ [1, 2], [2, 2], [3, 2] ]);
// var grid = new Grid(6, 6, [ [1, 1], [2, 1], [1, 2], [3, 4], [4, 3], [4, 4] ]);
// var grid = new Grid(17, 17, [ [4, 2], [5, 2], [6, 2], [10, 2], [11, 2], [12, 2], [4, 7], [5, 7], [6, 7], [10, 7], [11, 7], [12, 7], [4, 9], [5, 9], [6, 9], [10, 9], [11, 9], [12, 9], [4, 14], [5, 14], [6, 14], [10, 14], [11, 14], [12, 14], [2, 4], [2, 5], [2, 6], [2, 10], [2, 11], [2, 12], [7, 4], [7, 5], [7, 6], [7, 10], [7, 11], [7, 12], [9, 4], [9, 5], [9, 6], [9, 10], [9, 11], [9, 12], [14, 4], [14, 5], [14, 6], [14, 10], [14, 11], [14, 12] ]);
grid.start();
