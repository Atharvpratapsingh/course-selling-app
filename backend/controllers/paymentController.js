import Course from "../models/Course.js";
import Purchase from "../models/Purchase.js";

/* 
  ⚠️ NOTE: Ye MOCK payment system hai (learning ke liye).
  Production mein yahaan Razorpay/Stripe ka real API call hoga.
  Logic flow bilkul same hai — sirf "fake order" banta hai actual ki jagah.
*/

// ========== 1) ORDER BANAO (mock) ==========
export const createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;

    // 1. Course exist karta hai?
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course nahi mila" });
    }

    // 2. User pehle se khareed chuka?
    const alreadyPurchased = await Purchase.findOne({
      user: req.user._id,
      course: courseId,
      status: "completed",
    });
    if (alreadyPurchased) {
      return res.status(400).json({ message: "Tum pehle se ye course khareed chuke ho" });
    }

    // 3. MOCK: Fake order ID banao
    const mockOrderId = "order_mock_" + Date.now();

    // 4. Database mein pending purchase save karo
    await Purchase.create({
      user: req.user._id,
      course: courseId,
      amount: course.price,
      razorpayOrderId: mockOrderId,
      status: "pending",
    });

    // 5. Frontend ko order details bhejo
    res.status(200).json({
      orderId: mockOrderId,
      amount: course.price * 100,
      currency: "INR",
      courseName: course.title,
      message: "Mock order banaya (testing ke liye)",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ========== 2) PAYMENT VERIFY KARO (mock) ==========
export const verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID zaroori hai" });
    }

    const mockPaymentId = "pay_mock_" + Date.now();

    const purchase = await Purchase.findOneAndUpdate(
      { razorpayOrderId: orderId, user: req.user._id },
      {
        razorpayPaymentId: mockPaymentId,
        status: "completed",
      },
      { new: true }
    ).populate("course");

    if (!purchase) {
      return res.status(404).json({ message: "Purchase record nahi mila" });
    }

    res.status(200).json({
      message: "Payment successful (mock)!",
      purchase,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ========== 3) MERE COURSES ==========
export const getMyCourses = async (req, res) => {
  try {
    const purchases = await Purchase.find({
      user: req.user._id,
      status: "completed",
    }).populate("course");

    const courses = purchases.map((p) => p.course);
    res.status(200).json({ count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};