import mongoose from 'mongoose';

delete mongoose.connection.models['Discussion'];

const DiscussionSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: String,
    required: true
  },
  bookId: {
    type: String,
    required: true
  },
  title: {
    type: String
  },
  note: {
    type: String
  },
  comments: {
    type: [String],
    default: []
  }
});

export default mongoose.model('Discussion', DiscussionSchema);
