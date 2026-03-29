import { Server, type Socket } from "socket.io";
import type { Server as HttpServer } from "http";

let _io: Server | null = null;

export function initSocket(httpServer: HttpServer): Server {
  _io = new Server(httpServer, {
    cors: {
      origin: process.env["FRONTEND_URL"] ?? "http://localhost:5173",
      credentials: true,
    },
  });

  _io.on("connection", (socket: Socket) => {
    // Client sends { tournamentId } to subscribe to a tournament room.
    socket.on("join:tournament", (tournamentId: string) => {
      void socket.join(`tournament:${tournamentId}`);
    });

    socket.on("leave:tournament", (tournamentId: string) => {
      void socket.leave(`tournament:${tournamentId}`);
    });
  });

  return _io;
}

export function getIO(): Server {
  if (!_io) throw new Error("Socket.io not initialised");
  return _io;
}
