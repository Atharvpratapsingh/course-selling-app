// Backend ki APIs call karne ka code alag file mein rakhenge — clean code ke liye.
import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:5000/api",
})

export default api