const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  summary: String, // NEW FIELD
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Note', NoteSchema);