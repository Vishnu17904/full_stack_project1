// // server.js
// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";

// // Routes
// import userRoutes from "./routes/userAuth.js";
// import ownerRoutes from "./routes/ownerAuth.js";
// import productRoutes from "./routes/products.js";
// import orderRoutes from "./routes/orders.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // ==================
// // Middleware
// // ==================
// app.use(cors({
//   origin: "*", // 👉 change this to your frontend URL in production
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// }));

// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb", extended: true }));

// // ==================
// // MongoDB Connection
// // ==================
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => {
//     console.error("❌ MongoDB Connection Error:", err.message);
//     process.exit(1);
//   });

// // ==================
// // Routes
// // ==================
// app.get("/", (req, res) => {
//   res.send("🚀 Backend is running...");
// });

// app.use("/api/user", userRoutes);
// app.use("/api/owner", ownerRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/orders", orderRoutes);

// // ==================
// // Error Handler
// // ==================
// app.use((err, req, res, next) => {
//   console.error("❌ Server Error:", err.stack);
//   res.status(500).json({ message: "Internal Server Error" });
// });

// // ==================
// // Start Server
// // ==================
// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
// });


// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Routes
import userRoutes from "./routes/userAuth.js";
import ownerRoutes from "./routes/ownerAuth.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==================
// CORS FIX FOR RENDER
// ==================
const allowedOrigins = [
  "https://vinayak-sweet-namkeens.onrender.com",
  "https://vinayak-sweet.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ==================
// Body Parsers
// ==================
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ==================
// MongoDB Connection
// ==================
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// ==================
// Test Route
// ==================
app.get("/", (req, res) => {
  res.send("🚀 Backend is running...");
});

// ==================
// API Routes
// ==================
app.use("/api/user", userRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// ==================
// Error Handler
// ==================
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// ==================
// Start Server
// ==================
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});
