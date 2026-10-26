import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.js";

const router = express.Router();

//  User Signup Route
router.post("/signup", async (req, res) => {
  const { name, email, phone, password, userType = "user" } = req.body; 

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" }); //bad req

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      userType //  save userType
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  Login Route
router.post("/login", async (req, res) => {
  try {
    const { userType = "user", email, password } = req.body;

    const validTypes = ["user", "owner"];
    if (!validTypes.includes(userType)) {
      return res.status(400).json({ message: "Invalid userType" });
    }

    //  Find user by email AND userType
    const user = await User.findOne({ email, userType });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    //  Return user data
    return res.status(200).json({
      message: "Login successful!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        address: user.address || "",
        businessName: user.businessName || "",
        userType: user.userType,
        createdAt: user.createdAt
      }
    });

  } catch (err) {
    console.error("❌ Login error:", err);
    return res.status(500).json({ message: "Login failed", error: err.message });
  }
});

export default router;


// import express from "express";
// import bcrypt from "bcryptjs";
// import User from "../models/user.js";

// const router = express.Router();

// // User Signup
// router.post("/signup", async (req, res) => {
//   const { name, email, phone, password } = req.body;

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser)
//       return res.status(400).json({ message: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ name, email, phone, password: hashedPassword });
//     await newUser.save();

//     res.status(201).json({ message: "User registered successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Login route
// export async function login(req, res) {
//   try {
//     const { userType = "user", email, password } = req.body;

//     const validTypes = ["user", "owner"];
//     if (!validTypes.includes(userType)) {
//       return res.status(400).json({ message: "Invalid userType" });
//     }

//     const Model = userType === "owner" ? Owner : User;

//     // ✅ Use .lean() to ensure plain object
//     const user = await Model.findOne({ email }).lean();

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid password" });
//     }

//     delete user.password;

//     return res.status(200).json({
//       message: "Login successful!",
//       user: {
//         ...user,
//         id: user._id,
//         phone: user.phone || "",
//         address: user.address || "",
//         createdAt: user.createdAt || new Date().toISOString(),
//         businessName: user.businessName || "",
//         userType: user.userType || "user"
//       }
//     });

//   } catch (err) {
//     console.error("❌ Login error:", err);
//     return res.status(500).json({ message: "Login failed", error: err.message });
//   }
// }
