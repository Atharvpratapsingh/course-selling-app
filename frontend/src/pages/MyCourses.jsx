import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

function MyCourses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      navigate("/login")
      return
    }

    const fetchMyCourses = async () => {
      try {
        const res = await api.get("/payments/my-courses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setCourses(res.data.courses)
      } catch (err) {
        console.log("Error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchMyCourses()
  }, [navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        My Courses
      </h1>

      {courses.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600">
            Abhi tak koi course nahi khareeda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="bg-white p-6 rounded-lg shadow">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                ✓ Purchased
              </span>
              <h2 className="text-xl font-bold text-gray-800 mt-3 mb-2">
                {course.title}
              </h2>
              <p className="text-gray-600">
                {course.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyCourses