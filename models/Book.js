import mongoose from 'mongoose';

delete mongoose.connection.models['Book'];

const BookSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    required: true,
    lowercase: true
  },
  author: {
    type: String,
    required: true,
    lowercase: true
  },
  isbn: {
    type: String,
    optional : true
  },
  readBy: {
    type: [String],
    required: true,
    default: []
  },
  notes: {
    type: [String],
    default: []
  },
  highlights: {
    type: [String],
    default: []
  }
});

export default mongoose.model('Book', BookSchema);
