import { Note } from "../models/note.models.js";

const createNote = async (req, res) => {
  try {
    const { title, content, tags, isPinned } = req.body;
    const user = req.user;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const newNote = new Note({
      title,
      content,
      tags,
      isPinned,
      userId: user._id,
    });

    await newNote.save();

    return res
      .status(201)
      .json({ newNote, message: "Note created successfully" });
  } catch (error) {
    console.log("Error in createNote: ", error);

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateNote = async (req, res) => {
  try {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;
    const user = req.user;

    if (!title && !content && !tags) {
      return res.status(400).json({ message: "No changes provided" });
    }

    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (title) {
      note.title = title;
    }

    if (content) {
      note.content = content;
    }

    if (tags) {
      note.tags = tags;
    }

    if (isPinned) {
      note.isPinned = isPinned;
    }

    await note.save(note);

    return res.status(200).json({ note, message: "Note updated successfully" });
  } catch (error) {
    console.log("Error in createNote: ", error);

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getNotes = async (req, res) => {
  try {
    const user = req.user;

    const note = await Note.find({ userId: user._id }).sort({
      createdOn: -1,
      isPinned: -1,
    });
    return res.status(200).json({ note, message: "Note fetched successfully" });
  } catch (error) {
    console.log("Error in createNote: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteNote = async (req, res) => {
  try {
    const noteId = req.params.noteId;
    const user = req.user;
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    await Note.deleteOne({ _id: noteId, userId: user._id });

    return res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.log("Error in createNote: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateNotePinned = async (req, res) => {
  try {
    const noteId = req.params.noteId;
    const user = req.user;
    const { isPinned } = req.body;
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    // note.isPinned = !note.isPinned;
    note.isPinned = isPinned;

    await note.save();
    return res.status(200).json({ note, message: "Note updated successfully" });
  } catch (error) {
    console.log("Error in createNote: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const searchNotes = async (req, res) => {
  try {
    const user = req.user;
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search Query is required" });
    }

    // const matchedNotes = await Note.find({
    //   userId: user._id,
    //   $or: [
    //     { title: { $regex: query, $options: "i" } },
    //     { content: { $regex: query, $options: "i" } },
    //   ],
    // }).sort({ createdOn: -1 });

    const matchedNotes = await Note.find({
      userId: user._id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    }).sort({ createdOn: -1 });

    return res.status(200).json({
      notes: matchedNotes,
      message: "Notes matching the search query retrieved successfully",
    });
  } catch (error) {
    console.log("Error in searchNotes: ", error);

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  createNote,
  updateNote,
  getNotes,
  deleteNote,
  updateNotePinned,
  searchNotes,
};
