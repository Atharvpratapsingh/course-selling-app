import Course from "../models/Course.js";

// ========== CREATE COURSE (admin only) ==========
export const createCourse = async (req, res) => {
  try {
    const { title, description, price, thumbnail, category, level, lessons } = req.body;

    if (!title || !description || !price || !category) {
      return res.status(400).json({ message: "Title, description, price, category zaroori hain" });
    }

    const course = await Course.create({
      title,
      description,
      price,
      thumbnail,
      category,
      level,
      lessons,
      instructor: req.user._id, // logged-in admin ki ID
    });

    res.status(201).json({ message: "Course ban gaya!", course });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ========== GET ALL COURSES (public) ==========
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ========== GET SINGLE COURSE (public) ==========
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("instructor", "name email");

    if (!course) {
      return res.status(404).json({ message: "Course nahi mila" });
    }

    res.status(200).json({ course });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};