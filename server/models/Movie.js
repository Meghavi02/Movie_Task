const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  cast: { type: [String], default: [] },
  releaseDate: Date,
  director: String,
  producer: String,
  description: String,
  posterUrl: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Movie', MovieSchema);
