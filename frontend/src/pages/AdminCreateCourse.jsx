import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

function AdminCreateCourse() {
  // Form fields ke states
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("Web Development")
  const [level, setLevel] = useState("Beginner")
  const [thumbnail, setThumbnail] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate()

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    const token = localStorage.getItem("token")

    if (!token) {
      alert("Pehle login karo")
      navigate("/login")
      return
    }

    try {
      await api.post(
        "/courses",
        {
          title: title,
          description: description,
          price: Number(price),
          category: category,
          level: level,
          thumbnail: thumbnail || undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      alert("Course ban gaya! 🎉")
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.message || "Course banane mein problem")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Create New Course
        </h1>

        <div className="bg-white p-8 rounded-lg shadow">
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full border border-gray-300 rounded p-2"
                placeholder="e.g., Complete React Course"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows="4"
                className="w-full border border-gray-300 rounded p-2"
                placeholder="Course details..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Price (₹)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
                className="w-full border border-gray-300 rounded p-2"
                placeholder="999"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
              >
                <option>Web Development</option>
                <option>Mobile Development</option>
                <option>Data Science</option>
                <option>Design</option>
                <option>Marketing</option>
                <option>Other</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">
                Thumbnail URL (optional)
              </label>
              <input
                type="url"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="https://..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Create Course
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminCreateCourse