import jwt from "jsonwebtoken";
import { User } from "./models/user.models.js";

function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }

      try {
        // Verify that the user exists in the database
        const user = await User.findById(decoded.id);

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        // Attach user information to the request object
        req.user = user;
        next();
      } catch (dbError) {
        console.error("Database error:", dbError);
        return res.status(500).json({ message: "Internal server error" });
      }
    });
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
}

export { authenticateToken };
