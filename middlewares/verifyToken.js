const jwt = require("jsonwebtoken");

const authToken = (req, res, next) => {
  try {
    // 1. Read Authorization header
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "توكن غير موجود ❌" });
    }

    const token = header.split(" ")[1];

    // 2. Verify JWT
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "توكن غير صالح أو منتهي الصلاحية ❌",
        });
      }

      // 3. Attach user data to request
      req.user = decoded;

      // 4. Continue to next middleware
      next();
    });
  } catch (error) {
    res.status(500).json({
      message: "حدث خطأ في التوكن 🚫",
      error: error.message,
    });
  }
};

module.exports = authToken;
