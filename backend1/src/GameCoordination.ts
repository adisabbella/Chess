import type { WebSocket } from "ws";
import { MessageType } from "./messages.js";
import { Game } from "./GameLogic.js";

export class GameManager {
  private games: Game[];
  private users: WebSocket[];
  private pendingUser: WebSocket | null;

  constructor() {
    this.games = [];
    this.users = [];
    this.pendingUser = null;
  }

  addUser(socket: WebSocket) {
    this.users.push(socket);
    this.addHandler(socket);
  }

  removeUser(socket: WebSocket) {
    this.users = this.users.filter(user => user !== socket);
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());
      
      if (message.type === MessageType.INIT_GAME) {
        if (this.pendingUser) {
          const newGame = new Game(this.pendingUser, socket);
          this.games.push(newGame);
          this.pendingUser = null;
        }
        else {
          this.pendingUser = socket;
        }
      }

      if (message.type == MessageType.MOVE) {
        const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
        if (game) {
          game.makeMove(socket, message.move);
        }
      }
    })
  }
}