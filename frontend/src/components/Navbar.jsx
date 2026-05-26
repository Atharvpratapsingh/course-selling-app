import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-blue-600">
        🎓 CourseHub
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="text-gray-700 hover:text-blue-600 transition"
        >
          Home
        </Link>

        {user ? (
          // Logged in — show user info + My Courses + Logout
          <>
            <Link
              to="/my-courses"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              My Courses
            </Link>
            <span className="text-gray-600">
              Hi, <span className="font-semibold">{user.name}</span>
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          // Not logged in — show Login + Sign Up
          <>
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
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