import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import User from "../models/User.js";

/* =========================================
   ADMIN PROTECT
========================================= */
export const protectAdmin = async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const admin = await Admin.findById(decoded.id).select("-password");

      if (!admin) {
        return res.status(401).json({
          success: false,
          message: "Admin not found",
        });
      }

      req.admin = admin;

      return next();
    }

    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};

/* =========================================
   USER PROTECT
========================================= */
export const protectUser = async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      /* ================= OPTIONAL SAFETY GATE ================= */
      if (!user.isEmailVerified) {
        return res.status(403).json({
          success: false,
          message: "Email not verified",
        });
      }

      req.user = user;

      return next();
    }

    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};