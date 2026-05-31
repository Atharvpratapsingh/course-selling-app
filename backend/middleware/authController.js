import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Token banane ka helper function
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ========== SIGNUP ==========
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Sab fields aaye hain ya nahi check karo
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Sab fields zaroori hain" });
    }

    // 2. Pehle se user exist toh nahi karta?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email pehle se registered hai" });
    }

    // 3. Password ko encrypt karo (hash karo)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Naya user database mein save karo
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 5. Token banao aur user ko bhejo
    const token = generateToken(user._id);

    res.status(201).json({
      message: "Account ban gaya!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ========== LOGIN ==========
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Fields check
    if (!email || !password) {
      return res.status(400).json({ message: "Email aur password dono daalo" });
    }

    // 2. User dhundo
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Galat email ya password" });
    }

    // 3. Password compare karo
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Galat email ya password" });
    }

    // 4. Token bhejo
    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};