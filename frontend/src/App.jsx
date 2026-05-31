import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import MyCourses from "./pages/MyCourses"
import AdminCreateCourse from "./pages/AdminCreateCourse"

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/admin/create-course" element={<AdminCreateCourse />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App