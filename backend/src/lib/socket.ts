import { Server, type Socket } from "socket.io";
import type { Server as HttpServer } from "http";

import { verifyAccessToken } from "./jwt.js";

type SocketAuth = {
    userId: string;
    role: string;
    email: string;
};

let _io: Server | null = null;

export function initSocket(httpServer: HttpServer): Server {
    _io = new Server(httpServer, {
        cors: {
            origin: process.env["FRONTEND_URL"] ?? "http://localhost:5173",
            credentials: true,
        },
    });

    _io.use((socket, next) => {
        const rawToken =
            typeof socket.handshake.auth.token === "string"
                ? socket.handshake.auth.token
                : typeof socket.handshake.headers.authorization === "string"
                ? socket.handshake.headers.authorization.replace(/^Bearer\s+/i, "")
                : null;

        if (!rawToken) {
            return next(new Error("Missing auth token"));
        }

        try {
            const payload = verifyAccessToken(rawToken);
            socket.data.auth = {
                userId: payload.sub,
                role: payload.role,
                email: payload.email,
            } satisfies SocketAuth;
            return next();
        } catch {
            return next(new Error("Invalid auth token"));
        }
    });

    _io.on("connection", (socket: Socket) => {
        const auth = socket.data.auth as SocketAuth;
        void socket.join(`user:${auth.userId}`);

        // Client sends { tournamentId } to subscribe to a tournament room.
        socket.on("join:tournament", (tournamentId: string) => {
            void socket.join(`tournament:${tournamentId}`);
        });

        socket.on("leave:tournament", (tournamentId: string) => {
            void socket.leave(`tournament:${tournamentId}`);
        });

        socket.on("join:chat", (chatId: string) => {
            void socket.join(`chat:${chatId}`);
        });

        socket.on("leave:chat", (chatId: string) => {
            void socket.leave(`chat:${chatId}`);
        });
    });

    return _io;
}

export function getIO(): Server {
    if (!_io) throw new Error("Socket.io not initialised");
    return _io;
}
