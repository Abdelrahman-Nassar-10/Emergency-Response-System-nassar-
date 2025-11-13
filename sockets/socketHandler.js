// sockets/socketHandler.js
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    // المستخدم يرسل بلاغ
    socket.on("reportAccident", (data) => {
      console.log("🚨 New Accident:", data);

      // السيرفر يبعث البلاغ لجميع لوحات الإسعاف المتصلة
      io.emit("newAccident", data);
    });

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });
};
