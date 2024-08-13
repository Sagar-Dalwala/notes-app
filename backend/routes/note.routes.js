import express from "express";
import { authenticateToken } from "../utilities.js";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  updateNotePinned,
  searchNotes,
} from "../controllers/note.controllers.js";

const router = express.Router();

// router.get("/", getNotes);
router.post("/add-note", authenticateToken, createNote);

router.get("/get-notes", authenticateToken, getNotes);

router.delete("/delete-note/:noteId", authenticateToken, deleteNote);

router.put("/edit-note/:noteId", authenticateToken, updateNote);

router.put("/update-note-pinned/:noteId", authenticateToken, updateNotePinned);

router.get("/search-notes/", authenticateToken, searchNotes);

export default router;
