import jwt from "jsonwebtoken";

const generateCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "30d",
  });

  res.cookie("session", token, {
    httpOnly: true,
    secure: false, // ❌ पहले true था, इसे false कर दें
    sameSite: "Lax", // ✅ Fix: अब cross-site cookies भी allow होंगी
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export default generateCookie;
