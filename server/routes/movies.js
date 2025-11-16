const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Movie = require('../models/Movie');
const auth = require('../middleware/auth').default;
const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, uploadDir); },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const upload = multer({ storage });

// Create (protected)
router.post('/', auth, upload.single('poster'), async (req, res) => {
  try {
    const { title, cast, releaseDate, director, producer, description } = req.body;
    if (!title) return res.status(400).json({ msg:'Title required' });
    const posterUrl = req.file ? `/uploads/${req.file.filename}` : '';
    const movie = new Movie({
      title,
      cast: cast ? cast.split(',').map(s => s.trim()) : [],
      releaseDate: releaseDate || null,
      director, producer, description, posterUrl, createdBy: req.user.id
    });
    await movie.save();
    res.json(movie);
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
});

// Read all
router.get('/', async (req, res) => {
  const movies = await Movie.find().populate('createdBy','name email').sort({ createdAt: -1 });
  res.json(movies);
});

// Read one
router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id).populate('createdBy','name email');
  if (!movie) return res.status(404).json({ msg:'Not found' });
  res.json(movie);
});

// Update (protected + owner)
router.put('/:id', auth, upload.single('poster'), async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ msg:'Not found' });
    if (movie.createdBy && movie.createdBy.toString() !== req.user.id) return res.status(403).json({ msg:'Not allowed' });

    const { title, cast, releaseDate, director, producer, description } = req.body;
    if (req.file) movie.posterUrl = `/uploads/${req.file.filename}`;
    if (title) movie.title = title;
    if (cast) movie.cast = cast.split(',').map(s=>s.trim());
    if (releaseDate) movie.releaseDate = releaseDate;
    if (director) movie.director = director;
    if (producer) movie.producer = producer;
    if (description) movie.description = description;

    await movie.save();
    res.json(movie);
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
});

// Delete (protected + owner)
router.delete('/:id', auth, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ msg:'Not found' });
    if (movie.createdBy && movie.createdBy.toString() !== req.user.id) return res.status(403).json({ msg:'Not allowed' });
    // await movie.remove();
    await movie.deleteOne();
    res.json({ msg:'Removed' });
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
});

module.exports = router;
