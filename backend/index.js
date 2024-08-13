import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import mongoDB from "./db/mongoDBConnection.js";
import userRoutes from "./routes/user.routes.js";
import noteRoutes from "./routes/note.routes.js";

const app = express();

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoDB();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));

// Static files
const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend", "dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.json({ data: "Hello World" });
  });
}

// Routes
app.use("/api/user", userRoutes);
app.use("/api/notes", noteRoutes);

// Error handling (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
