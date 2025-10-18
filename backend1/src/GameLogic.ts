import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { MessageType } from "./messages.js";

export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  private board: Chess;
  private startTime: Date;

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.startTime = new Date();
    
    this.player1.send(JSON.stringify({
      type: MessageType.INIT_GAME,
      payload: { color : "white" }
    }))
    this.player2.send(JSON.stringify({
      type: MessageType.INIT_GAME,
      payload: { color : "black" }
    }))
  }

  makeMove(socket: WebSocket, move: {
    from: string,
    to: string
  }) {
    if (this.board.moves.length % 2 === 0 && socket !== this.player1) {
      return;
    }
    else if (this.board.moves.length % 2 !== 0 && socket !== this.player2) {
      return;
    }

    try {
      this.board.move(move);
    }
    catch(e) {
      return;
    }

    if (this.board.isGameOver()) {
      const winner = (this.board.turn() === 'w')? "black": "white";
      this.player1.send(JSON.stringify({
        type: MessageType.GAME_OVER,
        payload: {
          winner: winner
        }
      }))
      this.player2.send(JSON.stringify({
        type: MessageType.GAME_OVER,
        payload: {
          winner: winner
        }
      }))
    }

    if (this.board.moves.length % 2 === 0) {
      this.player2.send(JSON.stringify({
        type: MessageType.MOVE,
        payload: move
      }))
    }
    else {
      this.player1.send(JSON.stringify({
        type: MessageType.MOVE,
        payload: move
      }))
    }
  }
}