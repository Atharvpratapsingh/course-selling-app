import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [purchasing, setPurchasing] = useState(false);
  const [purchased, setPurchased] = useState(false);

  // Course details fetch karo
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data.course);

        // Agar user logged in hai, check karo ye course owned hai ya nahi
        if (user) {
          const myCoursesRes = await api.get("/payments/my-courses");
          const isOwned = myCoursesRes.data.courses.some(
            (c) => c._id === id
          );
          setPurchased(isOwned);
        }
      } catch (err) {
        setError("Course load karne mein problem aayi");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, user]);

  // Buy Now handler
  const handleBuyNow = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setPurchasing(true);

    try {
      // Step 1: Create order
      const orderRes = await api.post("/payments/create-order", {
        courseId: id,
      });

      const orderId = orderRes.data.orderId;

      // Step 2: Verify payment (mock — real mein Razorpay popup yahaan khulta)
      await api.post("/payments/verify", { orderId });

      // Success!
      toast.success("Course successfully purchase ho gaya! 🎉");
      navigate("/my-courses");
    } catch (err) {
      toast.error(err.response?.data?.message || "Purchase fail hua");
    } finally {
      setPurchasing(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">Loading course...</p>
      </div>
    );
  }

  // Error state
  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || "Course not found"}</p>
          <Link to="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Courses
        </Link>

        {/* Course card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Thumbnail */}
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-72 object-cover"
          />

          {/* Content */}
          <div className="p-8">
            {/* Tags */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                {course.category}
              </span>
              <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                {course.level}
              </span>
            </div>

            {/* Title + Instructor */}
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {course.title}
            </h1>
            <p className="text-gray-500 mb-6">
              by{" "}
              <span className="font-semibold text-gray-700">
                {course.instructor?.name || "Unknown"}
              </span>
            </p>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                About this course
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {course.description}
              </p>
            </div>

            {/* Lessons */}
            {course.lessons && course.lessons.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  What you'll learn
                </h2>
                <ul className="space-y-2">
                  {course.lessons.map((lesson, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 text-gray-700"
                    >
                      <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </span>
                      <span>{lesson.title}</span>
                      {lesson.duration && (
                        <span className="text-sm text-gray-400 ml-auto">
                          {lesson.duration} min
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Price + Buy section */}
            <div className="border-t pt-6 flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="text-4xl font-bold text-blue-600">
                  ₹{course.price}
                </p>
              </div>

              {/* Conditional button */}
              {purchased ? (
                <button
                  onClick={() => navigate("/my-courses")}
                  className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition font-semibold"
                >
                  ✓ Go to Course
                </button>
              ) : !user ? (
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition font-semibold"
                >
                  Login to Buy
                </Link>
              ) : (
                <button
                  onClick={handleBuyNow}
                  disabled={purchasing}
                  className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition font-semibold disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  {purchasing ? "Processing..." : "Buy Now"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;