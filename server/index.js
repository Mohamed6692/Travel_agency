const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

const ErrorHandler = require("./middleware/ErrorHandler");

// Routes
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const itemsRoutes = require("./routes/items");
const uploadRoutes = require("./routes/upload");
const reservationRoutes = require("./routes/reservation");
const paymentRoutes = require("./routes/payment");
const vehiculeRoutes = require("./routes/vehicule");
const chauffeurRoutes = require("./routes/chauffeur");
const villeRoutes = require("./routes/ville");
const trajetRoutes = require("./routes/trajet");
const planningRoutes =require("./routes/planning");

dotenv.config();

const app = express();
const server = http.createServer(app); 
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Connexion à MongoDB
mongoose.connect(
  process.env.MONGODB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("✅ Connected to MongoDB");
  }
);

const corsOptions = {
  credentials: true,
  origin: "*",
};


app.use(cors(corsOptions));
app.use("/", express.static(path.join(__dirname, "uploads")));

// Middleware
app.use(express.json({ limit: "1000mb" }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));

// WebSocket - Gestion des connexions
io.on("connection", (socket) => {
  console.log("⚡ Nouvelle connexion WebSocket");

  socket.on("disconnect", () => {
    console.log("🔌 Client déconnecté");
  });
});

// Fonction pour notifier un événement à tous les clients
const sendNotification = (event, data) => {
  io.emit(event, data);
};

// Utilisation des routes API
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/items", itemsRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/reservation", reservationRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/vehicule", vehiculeRoutes);
app.use("/api/chauffeur", chauffeurRoutes);
app.use("/api/ville", villeRoutes);
app.use("/api/trajet", trajetRoutes);
app.use("/api/planning",planningRoutes);


app.use(express.static('public'));

// Gestion des erreurs
app.use(ErrorHandler);
app.set("socketio", io);
// Démarrage du serveur
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});

module.exports = { app, server, io, sendNotification };
