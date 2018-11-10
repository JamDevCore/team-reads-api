import mongoose from 'mongoose';

delete mongoose.connection.models['Book'];

const BookSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  ownerId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
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
  discussions: {
    type: [String],
    default: []
  }
});

export default mongoose.model('Book', BookSchema);
