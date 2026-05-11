import Admin from "../models/Admin.js";
import generateToken from "../utils/generateToken.js";

// @desc Register Admin (run once)
export const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = await Admin.create({ email, password });

    res.status(201).json({
      _id: admin._id,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    /* ================= VALIDATION ================= */
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    /* ================= FIND ADMIN ================= */
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    /* ================= ROLE CHECK ================= */
    if (admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    /* ================= PASSWORD CHECK ================= */
    const isPasswordMatch = await admin.matchPassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    /* ================= TOKEN ================= */
    const token = generateToken(admin._id);

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      data: {
        _id: admin._id,
        email: admin.email,
        role: admin.role,
        token,
      },
    });

  } catch (error) {
    console.error("LOGIN ADMIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};