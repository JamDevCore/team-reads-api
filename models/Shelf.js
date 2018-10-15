import mongoose from 'mongoose';

/* Delete the Account model so it can be recreated
by another endpoint without an error */
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
