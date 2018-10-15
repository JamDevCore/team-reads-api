import mongoose from 'mongoose';

delete mongoose.connection.models['Shelf'];

const ShelfSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    lowercase: true
  },
  books: {
    type: [String],
    default: []
  }
});

export default mongoose.model('Shelf', ShelfSchema);
