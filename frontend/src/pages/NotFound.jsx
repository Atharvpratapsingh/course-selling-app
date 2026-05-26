import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          Jo page aap dhoondh rahe hain wo exist nahi karta
        </p>
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition inline-block font-semibold"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;