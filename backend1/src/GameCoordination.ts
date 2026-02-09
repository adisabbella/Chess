import type { WebSocket } from "ws";
import { MessageType } from "./messages.js";
import { Game } from "./GameLogic.js";

export class GameManager {
  private games: Game[] = [];
  private users: WebSocket[] = [];
  private pendingUser: WebSocket | null = null;

  addUser(socket: WebSocket) {
    this.users.push(socket);
    this.addHandler(socket);

    socket.on("close", () => {
      this.removeUser(socket);

      if (this.pendingUser === socket) {
        this.pendingUser = null;
      }

      const game = this.findGame(socket);
      if (game) {
        const opponent = game.player1 === socket ? game.player2 : game.player1;
        try {
          opponent.send(JSON.stringify({
            type: MessageType.GAME_OVER,
            payload: { winner: "opponent_disconnected" }
          }));
        } catch {}
        this.games = this.games.filter(g => g !== game);
      }
    });
  }

  removeUser(socket: WebSocket) {
    this.users = this.users.filter(u => u !== socket);
  }

  private findGame(socket: WebSocket) {
    return this.games.find(
      g => g.player1 === socket || g.player2 === socket
    ) ?? null;
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", data => {
      let message: any;

      try {
        message = JSON.parse(data.toString());
      } catch {
        return;
      }

      if (message.type === MessageType.INIT_GAME) {
        if (this.pendingUser && this.pendingUser !== socket) {
          const game = new Game(this.pendingUser, socket);
          this.games.push(game);
          this.pendingUser = null;
        } else {
          this.pendingUser = socket;
        }
      }

      if (message.type === MessageType.MOVE) {
        const game = this.findGame(socket);
        if (game) {
          game.makeMove(socket, message.move);
          if (game.isGameOver()) {
            this.games.filter(g => g !== game);
          }
        }
        else {
          socket.send("Game Not Found!")
        }
      }
    });
  }
}