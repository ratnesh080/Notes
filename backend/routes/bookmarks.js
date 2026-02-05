const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');
const axios = require('axios');
const cheerio = require('cheerio');

// Helper to fetch title
const fetchTitle = async (url) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    return $('head > title').text() || 'No Title Found';
  } catch (error) {
    return 'New Bookmark';
  }
};

// GET all bookmarks
router.get('/', async (req, res) => {
  try {
    const { q, tags } = req.query;
    let query = {};

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    const bookmarks = await Bookmark.find(query).sort({ createdAt: -1 });
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new bookmark (Bonus: Auto-fetch title)
router.post('/', async (req, res) => {
  let { title, url, description, tags } = req.body;

  // Validation
  if (!url) return res.status(400).json({ message: "URL is required" });

  // Bonus: Auto-fetch title if empty
  if (!title) {
    title = await fetchTitle(url);
  }

  const bookmark = new Bookmark({ title, url, description, tags });

  try {
    const newBookmark = await bookmark.save();
    res.status(201).json(newBookmark);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE bookmark
router.delete('/:id', async (req, res) => {
  try {
    await Bookmark.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bookmark deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;