const express = require("express");
const http = require("http");
const app = express();
const cors = require("cors");
const authRoutes = require("./routes/userRouter.js");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const admin = require("./routes/adminRoute.js");
const hospitals = require("./routes/hospitalRoute.js");
const ambulances = require("./routes/ambulanceRoute.js");
const reportRoutes = require("./routes/reportRoutes.js");
const initSocket = require("./sockets/index.js"); // صح الاستيراد
const { authDbConnection } = require("./dataBase/dataBaseConnection.js");

const PORT = 2511;

// DB Connection
authDbConnection();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
// Routes
app.use("/admin", admin);
app.use("/ambulances", ambulances);
app.use("/hospitals", hospitals);
app.use("/api/reports", reportRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("hello from server !"));

// HTTP server + Socket.IO
const server = http.createServer(app);
initSocket(server); // initSocket ياخد السيرفر

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
