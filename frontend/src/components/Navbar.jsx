// Pages aur Components alag kyun?

// pages/ mein full screen components hote (Home, Login)
// components/ mein chote reusable pieces (Navbar, Button)

import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  // Check karo user logged in hai ya nahi
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      {/* Logo / App name */}
      <Link to="/" className="text-xl font-bold text-blue-600">
        🎓 CourseHub
      </Link>

      {/* Navigation links */}
      <div className="flex gap-4 items-center">
        <Link to="/" className="text-gray-700 hover:text-blue-600">
          Home
        </Link>

        {token ? (
          // Logged in user
          <>
            {user?.role === "admin" && (
              <Link
                to="/admin/create-course"
                className="text-purple-600 hover:text-purple-800 font-semibold"
              >
                + Create Course
              </Link>
            )}
            <Link
              to="/my-courses"
              className="text-gray-700 hover:text-blue-600"
            >
              My Courses
            </Link>
            <span className="text-gray-700">Hi, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          // Not logged in
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600">
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
