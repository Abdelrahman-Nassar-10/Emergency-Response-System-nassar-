// ./sockets/index.js
const { Server } = require("socket.io");

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // أو origin: "http://127.0.0.1:5500" لو بتستخدم Live Server
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ Client connected:", socket.id);

    // استقبال بلاغ جديد من المستخدم
    socket.on("newAccident", (data) => {
      console.log("🚨 New accident received:", data);
      // إرسال البلاغ إلى جميع الـ dashboards
      io.emit("newAccident", data);
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });

  console.log("🚀 Socket.IO initialized");
}

module.exports = initSocket;
