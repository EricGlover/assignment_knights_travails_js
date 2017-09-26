const Stack = require("./stack");

const MOVES = [
  [-2, -1],
  [-2, 1],
  [-1, 2],
  [-1, -2],
  [1, 2],
  [1, -2],
  [2, 1],
  [2, -1]
];

const BOARD_X = 8;
const BOARD_Y = 8;
let ACCEPTABLE = [];

const _validMoves = (x, y) => {
  if (ACCEPTABLE[x] && ACCEPTABLE[x][y]) {
    return ACCEPTABLE[x][y];
  } else {
    let accepted = [];
    for (let move of MOVES) {
      if (
        x + move[0] > 0 &&
        x + move[0] < BOARD_X &&
        y + move[1] > 0 &&
        y + move[1] < BOARD_Y
      ) {
        accepted.push([x + move[0], y + move[1]]);
      }
    }
    ACCEPTABLE[x] = ACCEPTABLE[x] ? ACCEPTABLE[x] : [];
    ACCEPTABLE[x][y] = accepted;
    return accepted;
  }
};

class Square {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.adjacentSquares = [];
  }
}

class Board {
  constructor() {
    this.squares = [...Array(BOARD_X)].map((_, x) =>
      [...Array(BOARD_Y)].map((_, y) => new Square(x, y))
    );
    this.squares.forEach(row => {
      row.forEach(square => {
        square.adjacentSquares = _validMoves(
          square.x,
          square.y
        ).map(([x, y]) => {
          return this.squares[x][y];
        });
      });
    });
  }

  display() {
    console.log(this.squares);
  }
}

class KnightSearcher {
  constructor(board) {
    this.squares = board.squares;
  }

  //
  dfsFor([startX, startY], [endX, endY]) {
    let depthMap = new Map();
    let stack = new Stack();
    let pathStack = new Stack();
    let current = this.squares[startX][startY];
    depthMap.set(current, 1);
    pathStack.push([current.x, current.y]);
    do {
      //found the correct move
      if (current.x === endX && current.y === endY) {
        return pathStack.getStack();
      }

      let currentDepth = depthMap.get(current);
      for (let square of current.adjacentSquares) {
        //don't revisit squares
        if (!depthMap.has(square)) {
          stack.push(square);
          depthMap.set(square, currentDepth + 1);
        }
      }

      current = stack.pop();
      let newDepth = depthMap.get(current);
      if (newDepth > currentDepth) {
        pathStack.push([current.x, current.y]);
      } else if (newDepth === currentDepth) {
        pathStack.pop();
        pathStack.push([current.x, current.y]);
      } else {
        //we also need to pop off some stuff from the map
        //da backtracking, remove the failed path moves
        for (let i = 0; i < currentDepth - newDepth; i++) {
          let popped = pathStack.pop();
          console.log(
            `depthChange = ${currentDepth - newDepth} popped off = ${popped}`
          );
          console.log(
            `map has popped? = ${depthMap.delete(
              this.squares[popped[0]][popped[1]]
            )}`
          );
        }
        //replace the sibling path move
        pathStack.pop();
        pathStack.push([current.x, current.y]);
      }
      console.log("=========================");
      console.log(
        "X: ",
        current.x,
        "Y: ",
        current.y,
        "Depth: ",
        newDepth,
        "Previous: ",
        currentDepth
      );
      console.log(pathStack.getStack());
      console.log("=========================");
    } while (stack.length);
    return false;
  }
  bfsFor([x, y]) {
    let queue = new Queue();
    let current = this.start;
    do {
      if (current.x === x && current.y === y) {
        let answer = new Stack();
        answer.push([current.x, current.y]);
        while (current.parent) {
          answer.push([current.parent.x, current.parent.y]);
          current = current.parent;
        }
        return answer.stack.reverse();
      }
      if (current.children && current.children.length) {
        queue.concat(current.children);
      }
      current = queue.dequeue();
    } while (queue.length);
    return false;
  }
  benchmark(operationCount, testcases) {
    //dfs
    console.log("============== Running DFS =================");
    let start = Date.now();
    let count = operationCount;
    let answers = [];
    for (let i = 0; i < count; i++) {
      for (let oneCase of testcases) {
        answers.push([this.dfsFor(oneCase)]);
      }
    }
    let finalTime = (Date.now() - start) / 1000;
    console.log(`Time taken for dfs ${operationCount} times = `, finalTime);
    console.log(`Answers = `, answers.length);

    console.log("============== Running bfs =================");
    start = Date.now();
    count = operationCount;
    answers = [];
    for (let i = 0; i < count; i++) {
      for (let oneCase of testcases) {
        answers.push([this.bfsFor(oneCase)]);
      }
    }
    finalTime = (Date.now() - start) / 1000;
    console.log(`Time taken for bfs  ${operationCount} times  = `, finalTime);
    console.log(`Answers = `, answers.length);
  }
}

const before = Date.now();
const board = new Board();
// console.log(JSON.stringify(board.squares, null, 2));
// board.display();
console.log((Date.now() - before) / 1000);
const searcher = new KnightSearcher(board);
console.log("answer = ", searcher.dfsFor([1, 1], [2, 3]));
// console.log(searcher.dfsFor([8, 8]));
// console.log(searcher.bfsFor([4, 2]));
// console.log(searcher.bfsFor([8, 8]));
// searcher.benchmark(10, [4, 2]);
// searcher.benchmark(15, [8, 8]);

/////
