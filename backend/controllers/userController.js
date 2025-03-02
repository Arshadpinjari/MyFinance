import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import OTP from "../models/otpModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import {
  validateEmailAddress,
  validateUsernameLength,
  validatePasswordLength,
} from "../utils/validations.js";
import {
  getLastResendTime,
  updateLastResendTime,
} from "../utils/OTPs/OTPCooldown.js";

import generateCookie from "../utils/generateCookie.js";
import sendOTPemail from "../utils/OTPs/sendOTPemail.js";

// ✅ Register User
export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return res.status(400).json({ error: "Email is already registered!" });
  }

  const userNameExists = await User.findOne({ username });
  if (userNameExists) {
    return res.status(400).json({ error: "Username is already taken!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  await newUser.save();
  generateCookie(res, newUser._id);

  res.status(201).json({
    message: "User registered successfully!",
    user: {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      verified: newUser.verified,
    },
  });
});

// ✅ Login User
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return res.status(404).json({ error: "Email is not registered!" });
  }

  if (!existingUser.verified) {
    return res.status(401).json({ error: "Email is not verified!" });
  }

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid credentials!" });
  }

  generateCookie(res, existingUser._id);
  res.status(200).json({
    message: "Logged In Successfully!",
    user: {
      _id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
      verified: existingUser.verified,
    },
  });
});

// ✅ Logout User
export const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.clearCookie("session", { httpOnly: true, secure: true, sameSite: "None" });
  res.status(200).json({ message: "Logged Out Successfully!" });
});

// ✅ Get Current User Profile
export const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    return res.status(200).json({
      message: "User details retrieved successfully!",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        verified: user.verified,
      },
    });
  } else {
    return res.status(404).json({ error: "User Not Found!" });
  }
});

// ✅ Update User Profile
export const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ error: "User not found!" });

  const { username, email } = req.body;

  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already in use!" });
    }
    user.email = email;
  }

  if (username) user.username = username;
  const updatedUser = await user.save();

  res.status(200).json({
    message: "Profile updated successfully!",
    user: {
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      verified: updatedUser.verified,
    },
  });
});

// ✅ Reset Password
export const resetPassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ error: "User not found!" });

  const { oldPassword, newPassword } = req.body;

  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordValid) return res.status(401).json({ error: "Invalid old password!" });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.status(200).json({ message: "Password updated successfully!" });
});

// ✅ Send OTP
export const sendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email });
  if (!existingUser) return res.status(404).json({ error: "Email is not registered!" });

  const userID = existingUser._id;
  const cooldownDuration = 60 * 1000;
  const lastResendTime = await getLastResendTime(userID);

  if (lastResendTime && Date.now() - lastResendTime < cooldownDuration) {
    return res.status(429).json({ error: "Please wait before requesting another OTP!" });
  }

  await OTP.deleteMany({ userID });
  await sendOTPemail({ _id: userID, email }, res);
  await updateLastResendTime(userID);
});

// ✅ Verify OTP
export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const existingUser = await User.findOne({ email });
  if (!existingUser) return res.status(404).json({ error: "User not found!" });

  if (existingUser.verified) return res.status(400).json({ error: "Email is already verified!" });

  const userID = existingUser._id;
  const otpRecord = await OTP.findOne({ userID }).sort({ expiresAt: -1 });
  if (!otpRecord) return res.status(400).json({ error: "No valid OTP found. Request a new OTP!" });

  if (otpRecord.expiresAt < Date.now()) {
    await OTP.deleteMany({ userID });
    return res.status(400).json({ error: "OTP has expired!" });
  }

  const validOTP = await bcrypt.compare(otp, otpRecord.otp);
  if (!validOTP) return res.status(400).json({ error: "Invalid OTP!" });

  await User.updateOne({ _id: userID }, { verified: true });
  await OTP.deleteMany({ userID });

  res.status(200).json({
    message: "Email has been verified successfully!",
    user: {
      _id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
      verified: true,
    },
  });
});
