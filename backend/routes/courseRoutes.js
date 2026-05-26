import express from "express";
import { createCourse, getAllCourses, getCourseById } from "../controllers/courseController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes (sab dekh sakte hain)
router.get("/", getAllCourses);
router.get("/:id", getCourseById);

// Admin-only route
router.post("/", protect, adminOnly, createCourse);

export default router;