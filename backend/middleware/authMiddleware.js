import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Bouncer #1: Sirf logged-in users
export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Header se token nikalo
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Login zaroori hai, token nahi mila" });
    }

    // 2. Token verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. User dhundo database mein
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User exist nahi karta" });
    }

    // 4. User ko request mein attach karo
    req.user = user;
    next(); // ✅ Bouncer aage jaane de raha hai
  } catch (error) {
    res.status(401).json({ message: "Token invalid ya expired hai" });
  }
};

// Bouncer #2: Sirf admin
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Sirf admin ye kaam kar sakta hai" });
  }
};