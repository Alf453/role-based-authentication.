import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { requireAuth } from "../middleware/auth";

const router = Router();
const COOKIE_NAME = process.env.COOKIE_NAME || "token";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already in use" });
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: role || "User",
    });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: JWT_EXPIRES_IN,
    });
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.status(201).json({ user: user.toClient() });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Missing fields" });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const matched = await bcrypt.compare(password, user.passwordHash);
    if (!matched)
      return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: JWT_EXPIRES_IN,
    });
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.json({ user: user.toClient() });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  res.json({ user: req.user?.toClient() });
});

router.post("/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ message: "Logged out" });
});

export default router;
