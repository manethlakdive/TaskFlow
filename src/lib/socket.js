import { io } from "socket.io-client";

// backend eka run wena port ekatama point karanna (API_URL eke tiyena port ekatama)
export const socket = io("http://localhost:5001", {
  autoConnect: true,
});