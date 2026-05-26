import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const res = await api.get("/payments/my-courses");
        setCourses(res.data.courses);
      } catch (err) {
        setError("Courses load karne mein problem aayi");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">Loading your courses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          My Learning
        </h1>
        <p className="text-gray-600 mb-8">
          Aapke khareede hue courses
        </p>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!error && courses.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">
              Abhi tak koi course nahi khareeda
            </p>
            <Link
              to="/"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Browse Courses
            </Link>
          </div>
        )}

        {/* Courses grid */}
        {courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
              >
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                    ✓ Purchased
                  </span>
                  <h3 className="text-xl font-semibold text-gray-800 mt-3 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <Link
                    to={`/courses/${course._id}`}
                    className="block w-full bg-blue-600 text-white text-center py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    Start Learning
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyCourses;