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
// Middleware
// ==================
app.use(cors({
  origin: "*", // 👉 change this to your frontend URL in production
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ==================
// MongoDB Connection
// ==================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// ==================
// Routes
// ==================
app.get("/", (req, res) => {
  res.send("🚀 Backend is running...");
});

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
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});



// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";

// // Routes
// import userRoutes from "./routes/userAuth.js";
// import ownerRoutes from "./routes/ownerAuth.js";
// import productRoutes from "./routes/products.js";
// import Order from "./models/order.js";
// import orderRoutes from "./routes/orders.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ limit: '50mb', extended: true }));


// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log("✅ MongoDB Connected"))
// .catch((err) => console.error("❌ MongoDB Error:", err));

// // Routes
// app.get("/", (req, res) => {
//   res.send("Backend is running...");
// });

// app.use("/api/user", userRoutes);
// app.use("/api/owner", ownerRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/orders", orderRoutes);

// // Order creation
// app.post("/api/orders", async (req, res) => {
//   try {
//     const newOrder = new Order(req.body);
//     await newOrder.save();
//     res.json({ message: "Order saved successfully!" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
// });






// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import Product from "./models/product.js";
//  import Order from "./models/order.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB connection (cleaned up)
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.log("❌ MongoDB Error: ", err));

// // Routes
// app.get("/", (req, res) => {
//   res.send("Backend is running...");
// });

// // Get all products
// app.get("/api/products", async (req, res) => {
//   const products = await Product.find();
//   res.json(products);
// });

// // Add new product
// app.post("/api/products", async (req, res) => {
//   const newProduct = new Product(req.body);
//   await newProduct.save();
//   res.json({ message: "Product added!", product: newProduct });
// });

// app.post("/api/orders", async (req, res) => {
//   try {
//     const newOrder = new Order(req.body);
//     await newOrder.save();
//     res.json({ message: "Order saved successfully!" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Start server
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
// });
