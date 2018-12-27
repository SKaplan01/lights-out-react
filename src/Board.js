import React, { Component } from 'react';
import Cell from './Cell';
import './Board.css';

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - Difficulty: int, number of permutations to mess up the board at start of game
 *
 * State:
 *
 * - hasWon: boolean, true when board is all off
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render a grid of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

class Board extends Component {
  static defaultProps = {
    nrows: 5,
    ncols: 5,
    chanceLightStartsOn: 0.1
  };

  constructor(props) {
    super(props);
    this.state = {
      board: this.createBoard(),
      hasWon: true
    };
  }

  //returns an array-of-arrays of true/false values representing the state of the board (lit and unlit cells)
  createBoard() {
    let board = [];
    let { ncols, nrows, chanceLightStartsOn } = this.props;
    for (let j = 0; j < nrows; j++) {
      //make each row
      let row = [];
      for (let i = 0; i < ncols; i++) {
        let on = Math.random();
        if (on < chanceLightStartsOn) {
          row.push(true);
        } else {
          row.push(false);
        }
      }
      board.push(row);
    }
    return board;
  }

  /** handle changing a cell: update board & determine if winner */

  flipCellsAround(coord) {
    let { ncols, nrows } = this.props;
    let board = this.state.board;
    let [y, x] = coord.split('-').map(Number);

    function flipCell(y, x) {
      // if this coord is actually on board, flip it
      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        board[y][x] = !board[y][x];
      }
    }

    // When cell is clicked, flip the cell and the cells around it
    flipCell(y, x);
    flipCell(y, x + 1);
    flipCell(y, x - 1);
    flipCell(y - 1, x);
    flipCell(y + 1, x);

    // Determine if the game has been won (win when every cell is turned off)
    let hasWon = true;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j]) {
          hasWon = false;
        }
      }
    }

    this.setState({ board, hasWon });
  }

  reStartGame() {
    let board = this.createBoard();
    let hasWon = false;
    this.setState({ board, hasWon });
  }

  /** Render game board or winning message. */

  render() {
    // if the game is won, just show a winning msg & render nothing else
    let winningMessage = (
      <div>
        <h2>You win!</h2>
        <button onClick={() => this.reStartGame()}>Play again</button>
      </div>
    );

    // make table board
    let tableBoard = [];
    let { board } = this.state;
    for (let i = 0; i < board.length; i++) {
      let row = [];
      for (let j = 0; j < board[i].length; j++) {
        let coord = `${i}-${j}`;
        row.push(
          <Cell
            isLit={board[i][j]}
            key={coord}
            flipCellsAroundMe={this.flipCellsAround.bind(this, coord)}
          />
        );
      }
      tableBoard.push(
        <div key={i} className="row">
          {row}
        </div>
      );
    }

    return (
      <div>
        <h1>Lights Out</h1>
        {this.state.hasWon ? (
          winningMessage
        ) : (
          <div id="board">{tableBoard}</div>
        )}
      </div>
    );
  }
}

export default Board;
