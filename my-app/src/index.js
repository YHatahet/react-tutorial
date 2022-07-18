import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.diag0Idx = new Set([0, 4, 8]);
    this.diag1Idx = new Set([2, 4, 6]);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
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
    };
  }

  getAffected(i) {
    const affected = [`row${parseInt(i / 3)}`, `col${parseInt(i % 3)}`];
    if (this.diag0Idx.has(i)) affected.push("diag0");
    if (this.diag1Idx.has(i)) affected.push("diag1");
    return affected;
  }

  getNewState(squares, i, affected = undefined) {
    squares[i] = this.state.xIsNext ? "X" : "O";
    const change = squares[i] === "X" ? 1 : -1;
    const newState = { squares: squares, xIsNext: !this.state.xIsNext };
    for (const val of affected) {
      newState[val] = this.state[val] + change;
      if (newState[val] === 3) newState.winner = "X";
      else if (newState[val] === -3) newState.winner = "O";
    }
    return newState;
  }

  handleClick(i) {
    const squares = this.state.squares.slice(); // shallow copy

    //if we have a winner or square is already selected, ignore
    if (this.state.winner || squares[i] !== null) return;

    const affected = this.getAffected(i);
    const newState = this.getNewState(squares, i, affected);
    this.setState(newState);
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    let status;
    if (this.state.winner) {
      status = `Winner: ${this.state.winner}`;
    } else {
      status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;
    }

    return (
      <div>
        <div className="status">{status}</div>
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
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
