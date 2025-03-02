import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";

const authenticateUser = asyncHandler(async (req, res, next) => {
  console.log("🔍 Checking Authentication...");
  console.log("🍪 Cookies:", req.cookies);

  if (req.path === "/api/v1/users/logout") return next();

  const token = req.cookies?.session; // ✅ Fix: Optional Chaining for safety

  if (!token) {
    console.error("❌ No Token Found!");
    return res.status(401).json({ error: "You must be authenticated to access this resource!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("✅ Token Decoded:", decoded);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      console.error("❌ User Not Found!");
      return res.status(401).json({ error: "Invalid User!" });
    }

    if (!user.verified) {
      console.error("❌ User Email Not Verified!");
      return res.status(403).json({ error: "Email not verified. Please verify first!" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Authentication Failed!", error.message);
    res.status(401).json({ error: "Token Expired or Invalid!" });
  }
});

export default authenticateUser; // ✅ FIX: Default Export
