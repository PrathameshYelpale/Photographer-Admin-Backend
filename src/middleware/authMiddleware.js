const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ isLoggedIn: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "PHOTO@admin$890");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ isLoggedIn: false, message: "Invalid token" });
  }
};

module.exports = authMiddleware;