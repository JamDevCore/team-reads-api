import mongoose from 'mongoose';

delete mongoose.connection.models['Discussion'];

const DiscussionSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  startedBy: {
    type: String,
    required: true
  },
  bookId: {
    type: String,
    required: true
  },
  highlightId: {
    type: String
    required: true,
  },
  noteId: {
    type: String,
    required: true
  },
  comments: {
    type: [String],
    default: []
  }
});

export default mongoose.model('Discussion', DiscussionSchema);
