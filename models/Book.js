import mongoose from 'mongoose';

/* Delete the Account model so it can be recreated
by another endpoint without an error */
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
