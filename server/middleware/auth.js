import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) return res.status(401).json({ msg: "No token, auth denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "devsecret");
    req.user = {id: decoded.id}; // <-- VERY IMPORTANT
    next();
  } catch (err) {
    res.status(400).json({ msg: "Token is invalid" });
  }
}
