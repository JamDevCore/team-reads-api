import mongoose from 'mongoose';

/* Delete the Account model so it can be recreated
by another endpoint without an error */
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
  }
});

export default mongoose.model('Highlight', HighlightSchema);
