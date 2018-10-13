import mongoose from 'mongoose';

/* Delete the Account model so it can be recreated
by another endpoint without an error */
delete mongoose.connection.models['Book'];

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
