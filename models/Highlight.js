import mongoose from 'mongoose';

delete mongoose.connection.models['Highlight'];

const HighlightSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  bookId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    optional : true
  },
  text: {
    type: String,
    required: true
  }
});

export default mongoose.model('Highlight', HighlightSchema);
