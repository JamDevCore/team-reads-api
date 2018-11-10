import mongoose from 'mongoose';

delete mongoose.connection.models['Shelf'];

const ShelfSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  ownerId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  books: {
    type: [String],
    default: []
  }
});

export default mongoose.model('Shelf', ShelfSchema);
