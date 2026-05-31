import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

function Home() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses")
        setCourses(res.data.courses)
      } catch (err) {
        console.log("Error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  // Buy Now click handler
  const handleBuy = async (courseId) => {
    // Check login
    const token = localStorage.getItem("token")
    if (!token) {
      alert("Pehle login karo")
      navigate("/login")
      return
    }

    try {
      // Step 1: Order banao
      const orderRes = await api.post(
        "/payments/create-order",
        { courseId: courseId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const orderId = orderRes.data.orderId

      // Step 2: Payment verify karo
      await api.post(
        "/payments/verify",
        { orderId: orderId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      alert("Course khareed liya! 🎉")
      navigate("/my-courses")
    } catch (err) {
      alert(err.response?.data?.message || "Purchase fail hua")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <p>Loading courses...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        All Courses
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {course.title}
            </h2>
            <p className="text-gray-600 mb-4">
              {course.description}
            </p>
            <p className="text-2xl font-bold text-blue-600 mb-4">
              ₹{course.price}
            </p>
            <button
              onClick={() => handleBuy(course._id)}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home