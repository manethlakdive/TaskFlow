import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";

import connectDB from "./config/db.js";
import { initSocket } from "./socket.js";
import authRoutes from "./routes/auth.routes.js";
import boardRoutes from "./routes/board.routes.js";
import memberRoutes from "./routes/member.routes.js";
import inviteRoutes from "./routes/invite.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "SyncBoard API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/invites", inviteRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// express app eka http server ekakin wrap karanawa, socket.io ekath e server ekatama attach karanna
const httpServer = createServer(app);
initSocket(httpServer);

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`SyncBoard backend running on http://localhost:${PORT}`);
  });
});