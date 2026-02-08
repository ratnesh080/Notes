const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const analyzeNote = require('../utils/aiHelper');
// GET all notes (with optional search & filter)
router.get('/', async (req, res) => {
  try {
    const { q, tags } = req.query;
    let query = {};

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } }
      ];
    }
    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    const notes = await Note.find(query).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new note
// backend/routes/notes.js

router.post('/', async (req, res) => {
  const { title, content, tags } = req.body;
  let finalTags = tags;
  let aiSummary = "";

  // If tags are empty, let's have the AI generate them (and a summary) immediately
  if (!tags || tags.length === 0 || (tags.length === 1 && tags[0] === "")) {
    const aiData = await analyzeNote(content);
    finalTags = aiData.tags;
    aiSummary = aiData.summary;
  }

  const note = new Note({
    title,
    content,
    tags: finalTags,
    summary: aiSummary
  });

  try {
    const newNote = await note.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE note
router.delete('/:id', async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT route to summarize an existing note
router.put('/:id/summarize', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    // Call the AI Helper we created earlier
    const aiData = await analyzeNote(note.content);

    // Update the note with new AI data
    note.summary = aiData.summary;
    note.tags = aiData.tags; // This replaces old tags with AI-generated ones

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;