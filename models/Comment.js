import mongoose from 'mongoose';

delete mongoose.connection.models['Comment'];

const CommentSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: String
    required: true,
  },
  discussionId: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});

export default mongoose.model('Comment', CommentSchema);
