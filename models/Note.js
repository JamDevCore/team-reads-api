import mongoose from 'mongoose';

delete mongoose.connection.models['Note'];

const NoteSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: String,
    required: true
  },
  bookId: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});

export default mongoose.model('Note', NoteSchema);
