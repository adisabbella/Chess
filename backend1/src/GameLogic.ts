import type { WebSocket } from "ws";
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
      payload: { color: "white" }
    }));

    this.player2.send(JSON.stringify({
      type: MessageType.INIT_GAME,
      payload: { color: "black" }
    }));
  }

  private sendToBoth(message: unknown) {
    const s = JSON.stringify(message);
    try { this.player1.send(s); } catch {}
    try { this.player2.send(s); } catch {}
  }

  private sendToSocket(socket: WebSocket, message: unknown) {
    try { socket.send(JSON.stringify(message)); } catch {}
  }

  makeMove(socket: WebSocket, move: { from: string; to: string; promotion?: string }) {
    const turn = this.board.turn();

    if (turn === "w" && socket !== this.player1) return;
    if (turn === "b" && socket !== this.player2) return;

    try {
      this.board.move(move);
    }
    catch {
      socket.send("invalid move");
      return;
    }

    const opponent = socket === this.player1 ? this.player2 : this.player1;
    this.sendToSocket(opponent, { type: MessageType.MOVE, payload: move });

    if (this.board.isGameOver()) {
      let winner: string | null;

      if (this.board.isCheckmate()) {
        winner = this.board.turn() === "w" ? "black" : "white";
      }
      else {
        winner = "Game Ended in a DRAW!"
      }
    
      this.sendToBoth({
        type: MessageType.GAME_OVER,
        payload: { winner }
      });
    }
  }

  isGameOver() {
    return this.board.isGameOver();
  }
}