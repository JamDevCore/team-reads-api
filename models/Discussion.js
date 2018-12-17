import User from './User';
import Book from './Book';
import Comment from './Comment';
import mongoose from 'mongoose';


const Schema = mongoose.Schema;

delete mongoose.connection.models['Discussion'];

const DiscussionSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: String,
    ref: 'User'
  },
  bookId: {
      type: Schema.Types.ObjectId,
      ref: 'Book'
    },
  title: {
    type: String
  },
  note: {
    type: String
  },
  ideas: {
    type: Number,
    default: 0
  },
  comments: [{
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }]
});

export default mongoose.model('Discussion', DiscussionSchema);
