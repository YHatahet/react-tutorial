import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// TODO
// - Display the location for each move in the format (col, row) in the move history list.
// - Bold the currently selected item in the move list.
// - Rewrite Board to use two loops to make the squares instead of hardcoding them.
// - Add a toggle button that lets you sort the moves in either ascending or descending order.
// - When someone wins, highlight the three squares that caused the win.
// - When no one wins, display a message about the result being a draw.



function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.diag0Idx = new Set([0, 4, 8]);
    this.diag1Idx = new Set([2, 4, 6]);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          // totals used to calculate the winner
          row0: 0,
          row1: 0,
          row2: 0,
          col1: 0,
          col2: 0,
          col0: 0,
          diag0: 0, //top left to bot right
          diag1: 0, //bot left to top right
          winner: null,
        },
      ],
      xIsNext: true,
      stepNumber: 0,
    };
  }

  getAffected(i) {
    const affected = [`row${parseInt(i / 3)}`, `col${parseInt(i % 3)}`];
    if (this.diag0Idx.has(i)) affected.push("diag0");
    if (this.diag1Idx.has(i)) affected.push("diag1");
    return affected;
  }

  updateCalculations(affected, current, change) {
    for (const val of affected) {
      current[val] = current[val] + change;
      if (current[val] === 3) current.winner = "X";
      else if (current[val] === -3) current.winner = "O";
    }
    return current;
  }

  jumpTo(step) {
    this.setState({ stepNumber: step, xIsNext: step % 2 === 0 });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1); // slice to "now", ignore future steps if they exist
    const current = Object.assign({}, history[history.length - 1]);
    const squares = current.squares.slice(); // shallow copy

    //if we have a winner or square is already selected, ignore
    if (current.winner || squares[i] !== null) return;

    //write into box
    squares[i] = this.state.xIsNext ? "X" : "O";

    const change = squares[i] === "X" ? 1 : -1;

    const affected = this.getAffected(i);
    const newState = this.updateCalculations(affected, current, change);
    newState.squares = squares;

    history.push(newState);

    this.setState({
      xIsNext: !this.state.xIsNext,
      history: history,
      stepNumber: history.length - 1,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          {" "}
          <button onClick={() => this.jumpTo(move)}>{desc}</button>{" "}
        </li>
      );
    });

    let status;
    if (current.winner) {
      status = `Winner: ${current.winner}`;
    } else {
      status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves} </ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
