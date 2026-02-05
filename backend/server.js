const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
//app.use(cors());
// backend/server.js

// Allow your specific Vercel URL (and localhost for testing)
const allowedOrigins = [
  'http://localhost:3000', 
  'http://localhost:5001',
  'https://notes-git-main-ratneshs-projects-12b69610.vercel.app/notes' 
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('API is running successfully!');
});
const notesRouter = require('./routes/notes');
const bookmarksRouter = require('./routes/bookmarks');

app.use('/api/notes', notesRouter);
app.use('/api/bookmarks', bookmarksRouter);

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));